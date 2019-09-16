const mongoose = require('mongoose');
const assert = require('assert')
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

/** Test register */
describe('To test user registeration', () => {

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
				expect(res.body).to.have.property('accessToken');
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
				expect(res.body).to.have.property('accessToken');
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
				expect(res.body).to.have.property('accessToken');
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
				expect(res.body).to.have.property('accessToken');
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

/** Test login */
describe('To test user login', () => {
	it('successfully login one user', (done) => {
		const register_detail = {
			'username': 'testuser1',
			'password': 'password1',
			'email': 'testuser1@gmail.com',
			'phone': '1234567890',
		};
		const login_detail = {
			'username': 'testuser1',
			'password': 'password1',
		}
		chai.request(app)
			.post('/user/register')
			.send(register_detail)
			.end((err, res) => {
				res.should.have.status(200);
				chai.request(app)
					.post('/user/login')
					.send(login_detail)
					.end((err, res) => {
						res.should.have.status(200);
						expect(res.body).to.have.property('accessToken');
						done();
					});
			});
	});

	it('Failed to login one user, invalid request.', (done) => {
		const register_detail = {
			'username': 'testuser1',
			'password': 'password1',
			'email': 'testuser1@gmail.com',
			'phone': '1234567890',
		};
		const login_detail = {
			'username': 'testuser1',
		}
		chai.request(app)
			.post('/user/register')
			.send(register_detail)
			.end((err, res) => {
				res.should.have.status(200);
				expect(res.body).to.have.property('accessToken');
				chai.request(app)
					.post('/user/login')
					.send(login_detail)
					.end((err, res) => {
						res.should.have.status(422);
						done();
					});
			});
	});

	it('Failed to login one user, due to incorrect password', (done) => {
		const register_detail = {
			'username': 'testuser1',
			'password': 'password1',
			'email': 'testuser1@gmail.com',
			'phone': '1234567890',
		};
		const login_detail = {
			'username': 'testuser1',
			'password': 'password2',
		}
		chai.request(app)
			.post('/user/register')
			.send(register_detail)
			.end((err, res) => {
				res.should.have.status(200);
				expect(res.body).to.have.property('accessToken');
				chai.request(app)
					.post('/user/login')
					.send(login_detail)
					.end((err, res) => {
						res.should.have.status(401);
						done();
					});
			});
	});
});
