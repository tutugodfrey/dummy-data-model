import functs from '../helpers/functs';

const { addReturnString } = functs;
const getQuery = (modelName, condition, returnFields=[]) => {
  const typeOfCondition = (typeof condition);
  if (typeOfCondition !== 'string' && typeOfCondition !== 'object' && typeOfCondition !== 'number') {
    return { message: 'type error!' };
  }

  let queryString = '';
  let returnString = '';
  if (returnFields.length){
    returnString = addReturnString('', returnFields).substr(11);
  } else {
    returnString = '*';
  }
  if (condition === 'all') {
    queryString = `SELECT ${returnString} FROM ${modelName}`;
  } else if (typeof condition === 'number') {
    queryString = `SELECT ${returnString} FROM ${modelName} WHERE "id" = ${condition}`;
  } else {
    /* eslint-disable prefer-destructuring */
    let type;
    if (!condition.type) {
      type = 'AND';
    } else {
      type = condition.type.toUpperCase();
    }
    const keys = Object.keys(condition.where);
    queryString = `SELECT ${returnString} FROM ${modelName}`;
    keys.forEach((key) => {
      if (Array.isArray(condition.where[key])) {
        let str = '';
        const matchValue = condition.where[key]
        matchValue.forEach(value => {
          if (!str) {
            str = `${str} "${key}" = '${value}'`
          } else {
            str = `${str} OR "${key}" = '${value}'`
          }
        });
        if (queryString.indexOf('WHERE') === -1) {
          queryString = `${queryString} WHERE ${str}`
        } else {
          queryString = `${queryString} ${type} ${str}`
        }
      } else if (queryString.indexOf('WHERE') === -1) {
        queryString = `${queryString} WHERE "${key}" = '${condition.where[key]}'`;
      } else {
        queryString = `${queryString} ${type} "${key}" = '${condition.where[key]}'`;
      }
    });
  }
  if (process.env.NODE_ENV !== 'production') {
    /* eslint-disable no-console */
    console.log(queryString);
  }
  return queryString;

  // return 'select all from users where username = \'john\'';
}

export default getQuery;
