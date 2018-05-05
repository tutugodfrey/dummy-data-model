
import chai from 'chai';
import DataModel from './../src/DummyDataModel';

const { expect } = chai;
const users = new DataModel('users');
const user1 = {
	name: 'jane doe',
	email: 'jane_doe@somebody.com',
	address: 'somewhere in the world',
}
const user2 = {
	name: 'alice',
	email: 'alice@somebody.com',
	address: 'lives in another planet',
}
const createdUser2 = {
	id: 2,
	name: 'alice',
	email: 'alice@somebody.com',
	address: 'lives in another planet',
}
const wrongdUser2 = {
	id: 1,
	name: 'alice',
	email: 'alice@somebody.com',
	address: 'lives in another planet',
}
const updateUser2 = {
	name: 'alice bob',
	address: 'now living in planet earth',
}

describe('Dummy Data Model', () => {
	describe('DataModel', () => {
		it('should export a function', () => {
			expect(DataModel).to.be.a('function');
		})
	});

	describe('Users', () => {
		it('should export a function', () => {
			expect(users).to.be.a('object');
		});
		it('should be an instance of DataModel', () => {
			expect(users).to.be.an.instanceOf(DataModel);
		})
	});

	describe('create method', () => {
		it('user model should be an array', () => {
			expect(users.model).to.be.an('array');
		})
		it('it should a new user', () => {
			users.create(user1)
			.then((user) => {
				expect(user).to.eql({
					id: 1,
					name: 'jane doe',
					email: 'jane_doe@somebody.com',
					address: 'somewhere in the world'
				});
			});
		});

		it('it should a another user', () => {
			users.create(user2)
			.then((user) => {
				expect(user).to.eql({
					id: 2,
					name: 'alice',
					email: 'alice@somebody.com',
					address: 'lives in another planet'
				});
			});
		});

		it('lenght of model should increase', () => {
			expect(users.model.length).to.equal(2);
		})
	});

	describe('update method', () => {
		it('should update a model', () => {
			users.update(createdUser2, updateUser2)
			.then((newUser2) => {
				expect(newUser2).to.eql({
					id: 2,
					email: 'alice@somebody.com',
					name: 'alice bob',
					address: 'now living in planet earth',
				});
			});
		});
		it('should not update a wrong model', () => {
			users.update(wrongdUser2, updateUser2)
			.then((newUser2) => {
				expect(newUser2).to.eql({
					id: 2,
					email: 'alice@somebody.com',
					name: 'alice bob',
					address: 'now living in planet earth',
				});
			})
			.catch((error) => {
				expect(error).to.eql({ message: `user not found` })
			})
		});
	});

	describe('findById', () => {
		it('should return the model with the given id', () => {
			users.findById(1)
			.then((user) => {
				expect(user).to.eql({
					id: 1,
					name: 'jane doe',
					email: 'jane_doe@somebody.com',
					address: 'somewhere in the world',
				});
			});
		});

		it('should return not found if model with given id is not not found', () => {
			users.findById(3)
			.then((user) => {
				expect(user).to.eql({
					id: 1,
					name: 'jane doe',
					email: 'jane_doe@somebody.com',
					address: 'somewhere in the world',
				});
			})
			.catch((error) => {
				expect(error).to.eql({ error: 'user not found' });
			});
		});
	});

	describe('find', () => {
		it('should find a model that meet the given conditions', () => {
			users.find({
				where: {
					name: 'alice bob',
				}
			})
			.then((user) => {
				expect(user).to.eql({
					id: 2,
					email: 'alice@somebody.com',
					name: 'alice bob',
					address: 'now living in planet earth',
				})
			})
		});

		it('should only return a model that meet all conditions', () => {
			users.find({
				where: {
					name: 'alice bob',
					id: 4,
				}
			})
			.then((user) => {
				expect(user).to.eql({
					id: 2,
					email: 'alice@somebody.com',
					name: 'alice bob',
					address: 'now living in planet earth',
				});
			})
			.catch((error) => {
				expect(error).to.eql({ message: 'user not found' });
			});
		});
	});

	describe('findAll', () => {
		it('should return all models if no condition is specified', () => {
			users.findAll()
			.then((allUsers) => {
				expect(allUsers).to.be.an('array');
				expect(allUsers.length).to.equal(2);
			});
		});

		it('should return all models that meets the specified conditions', () => {
			users.findAll({
				where: {
					address: 'somewhere in the world',
				}
			})
			.then((allUsers) => {
				expect(allUsers).to.be.an('array');
				expect(allUsers).to.have.length.of.at.least(1);
			});
		});
	});

	describe('destroy', () => {
		it('should delete a model that meets the specified condition', () => {
			users.destroy({
				where: {
					id: 1,
				}
			})
			.then((message) => {
				expect(message).to.eql({ message: 'user has been deleted' });
			})
		})
	})
});