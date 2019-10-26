const assert = require('power-assert');
const expect = require('chai').expect;
const UserModel = require('../models/user');

/** Test create user */
// !!! When the test function returns a Promise, should not add "done()".
describe('To test create a user', function() {
	it('successfully create one user', function() {
		// UserModel.Create() 返回一个 Promise，然后then()应该在promise resolve后运行，之后it会退出
		// 现在 it() 在Promise resolve之前就退出报错了
		// Error： Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves. (/Users/Federer-HYJ/Documents/coding/NodeJS/projects/chatroom_nodejs/backend_v2/test/models_user_test.js)
		return UserModel.Create("user1", "password1", "email1", "phone1")
		.then(function(result) {
			expect(user.name).to.equal("user1");
		})
		.catch(function(err) {
			console.log("444444")
		});
		/*
		.then(result => {
			return UserModel.findUserTestOnly(result.uuid);
		})
		.catch(err => {
			throw err;
		})
		.then(user => {
			console.log(user)
			expect(user.name).to.equal("user2");
			expect(user.password).to.equal("password1");
			expect(user.email).to.equal("email1");
			expect(user.phone).to.equal("phone1");
			//user.password.should.be.eql("password1");
			//user.email.should.be.eql("email2");
			//user.phone.should.be.eql("phone1");
		})
		*/
	});
/*
	it('failed to create a user with no phone and email', () => {
		UserModel.Create("user1", "password1")
		.catch(err => {
			err.should.be.eql(new Error("Error"));
		});
	});
	*/
});
