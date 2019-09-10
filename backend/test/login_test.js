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

	it('Failed to register user with duplicated name', (done) => {
		const register_detail = {
			'username': 'testuser1',
			'password': 'password1',
		};
		chai.request(app)
			.post('/user/register')
			.send(register_detail)
			.end((err, res) => {
				res.should.have.status(200);
				chai.request(app)
					.post('/user/register')
					.send(register_detail)
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
			});
	});

	it('Failed to register user with duplicated email', (done) => {
		const register_detail1 = {
			'username': 'testuser1',
			'password': 'password1',
			'email': 'email',
		};
		const register_detail2 = {
			'username': 'testuser2',
			'password': 'password2',
			'email': 'email',
		};
		chai.request(app)
			.post('/user/register')
			.send(register_detail1)
			.end((err, res) => {
				res.should.have.status(200);
				chai.request(app)
					.post('/user/register')
					.send(register_detail2)
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
			});
	});

	it('Failed to register user with duplicated phone', (done) => {
		const register_detail1 = {
			'username': 'testuser1',
			'password': 'password1',
			'phone': 'phone',
		};
		const register_detail2 = {
			'username': 'testuser2',
			'password': 'password2',
			'phone': 'phone',
		};
		chai.request(app)
			.post('/user/register')
			.send(register_detail1)
			.end((err, res) => {
				res.should.have.status(200);
				chai.request(app)
					.post('/user/register')
					.send(register_detail2)
					.end((err, res) => {
						res.should.have.status(500);
						done();
					});
			});
	});
});
