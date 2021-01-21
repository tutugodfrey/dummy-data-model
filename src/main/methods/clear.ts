function clear() {
  const result = new Promise((resolve, reject) => {
    if (this.using_db) {
      const queryString = `DELETE from ${this.modelName}`;
      this.dbConnection.query(queryString)
        .then(() => {
          resolve({ message: `Successfully cleared ${this.modelName}` });
        })
        .catch((err: object) => reject(err));
    } else {
      this.model.splice(0)
      resolve({ message: `Successfully cleared ${this.modelName}` });
    }
  });

  return result;
}

export default clear;