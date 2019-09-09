const mongoose = require('mongoose');
const assert = require('assert')
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const should = chai.should();
chai.use(chaiHttp);

/** Test register */
describe('To test user registeration', () => {
	// Clean up test database before running each test.
	beforeEach((done) => {
		mongoose.connect(process.env.MONGODB_PATH);
		mongoose.connection.once('open', () => {
			//console.log('Connected to test Mongodb for cleaning up legacy test data.');
			mongoose.connection.dropCollection('users', (err, result) => {
		        if (err) {
		        	console.log("error in deleting collection, " + err);
		        }
		        done();
			});
		}).on('error', (error) => {
			console.log('Connection error:', error);
			done();
		});
	});

	it('successfully registered one user', (done) => {
		const register_detail = {
			'username': 'testuser1',
			'password': 'password1',
			'email': 'testuser1@gmail.com',
			'phone': '1234567890',
		};
		chai.request(app)
			.post('/user/register')
			.send(register_detail)
			.end((err, res) => {
				res.should.have.status(200);
				done();
			});
	});
});
