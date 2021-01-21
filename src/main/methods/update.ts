import functs from '../helpers/functs';
import { Condition } from '../../main/interfaces';

const { confirmPropMatch, getFieldsToReturn  } = functs;
function update(propsToUpdate: any, conditions: Condition, returnFields=[]) {
  /* 
    propsToUpdate contain the new properties to replace the old ones
    this method should be called on the particular object to update.
    which means that before call update you must use the finder methods to 
    get the particular object.
  */

  if (!Array.isArray(returnFields)) {
    throw new TypeError('Expected an array of fields to return');
  }
  const result = new Promise((resolve, reject) => {
    if (!propsToUpdate || (Object.prototype.toString.call(propsToUpdate) !== '[object Object]'))
    return reject({ message:
      'require argument 1 of type object. only one argument supplied!' });

    if (!conditions || !conditions.where)
      return reject({ message:
        'require argument at position 2 to specify update condition' });

    const missingSchemaProp = propsToUpdate && Object.keys(propsToUpdate).find(field => {
      if (!['id', 'updatedAt', 'createdAt'].includes(field)) {
        return !this.allowedFields.includes(field);
      }
    });
    if (missingSchemaProp) {
      reject({ message: `${missingSchemaProp} is not defined in schema for ${this.modelName}`});
    }
      
    
    if (this.using_db) {
      propsToUpdate.updatedAt = 'now()';
      const queryString = this.getQuery(this.modelName, conditions, propsToUpdate);
      this.dbConnection.query(queryString)
        .then(res => {
          return res.rows[0]
        })
        .then(( /* user created */ ) => this.updateQuery(
          this.modelName, conditions, propsToUpdate, returnFields
        ))
        .then(queryString => this.dbConnection.query(queryString))
        .then(res => {
          if (!res.rows.length) {
            return reject({ message: `${this.singleModel} not found` });
          }
          return resolve(res.rows[0])
        })
        .catch(err => reject(err));
    } else {
      const props = Object.keys(propsToUpdate);
      let modelsFound = this.model.filter((model: any) => {
        // if only id is specified
        if (Object.keys(conditions.where).length === 1 && conditions.where.id) 
          return model.id === conditions.where.id;
        const findMatchProps = confirmPropMatch(model, conditions);
        if (findMatchProps) return true;
      });

      if (!modelsFound.length) reject({ message: `${this.singleModel} not found` });

      const updatedModels = modelsFound.map((model: any) => {
        props.forEach((property) => {
          model[property] = propsToUpdate[property]
        });
        model.updatedAt = new Date();
        return resolve(getFieldsToReturn(model, returnFields))
      });
      // return a single object
      if (updatedModels.length === 1) resolve(updatedModels[0]);

      // return an array of the modified models
      resolve(updatedModels);
    }
  });
  return result;
}

export default update;