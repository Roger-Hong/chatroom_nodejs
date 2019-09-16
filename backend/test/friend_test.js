const mongoose = require('mongoose');
const assert = require('assert')
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

/** Test search friends */
describe('To test searching friends', () => {

	// Chai-http with promise.
	it('successfully found one user through name', (done) => {
		const register_detail = {
			'username': 'testuser1',
			'password': 'password1',
		};
		chai.request(app)
			.post('/user/register')
			.send(register_detail)
			.then(res => {
				expect(res).to.have.status(200);
				return chai.request(app)
				.post('/friend/search')
				.send({'username' : 'testuser1'});
			})
			.catch(err => {
				throw err;
			})
			.then(res => {
				expect(res).to.have.status(200);
				res.body.should.be.eql(
					{users: [
						{ name: 'testuser1', password: 'password1' }
					]});
				done();
			})
			.catch(err => {
				expect(err).to.be.null;
				done();
			});
	});

	it('successfully found one user through email', (done) => {
		const register_detail = {
			'username': 'testuser1',
			'password': 'password1',
			'email': 'email1',
		};
		chai.request(app)
			.post('/user/register')
			.send(register_detail)
			.then(res => {
				expect(res).to.have.status(200);
				return chai.request(app)
				.post('/friend/search')
				.send({'email' : 'email1'});
			})
			.catch(err => {
				throw err;
			})
			.then(res => {
				expect(res).to.have.status(200);
				res.body.should.be.eql(
					{users: [
						{ name: 'testuser1', password: 'password1', email: 'email1' }
					]});
				done();
			})
			.catch(err => {
				expect(err).to.be.null;
				done();
			});
	});

	it('successfully found one user through phone', (done) => {
		const register_detail = {
			'username': 'testuser1',
			'password': 'password1',
			'phone': 'phone1',
		};
		chai.request(app)
			.post('/user/register')
			.send(register_detail)
			.then(res => {
				expect(res).to.have.status(200);
				return chai.request(app)
				.post('/friend/search')
				.send({'phone': 'phone1'});
			})
			.catch(err => {
				throw err;
			})
			.then(res => {
				expect(res).to.have.status(200);
				res.body.should.be.eql(
					{users: [
						{ name: 'testuser1', password: 'password1', phone: 'phone1' }
					]});
				done();
			})
			.catch(err => {
				expect(err).to.be.null;
				done();
			});
	});

	it('successfully found two users through name, email, and phone', (done) => {
		const register_detail1 = {
			'username': 'testuser1',
			'password': 'password1',
			'email': 'email1',
			'phone': 'phone1',
		};
		const register_detail2 = {
			'username': 'testuser2',
			'password': 'password2',
			'email': 'email2',
			'phone': 'phone2',
		};
		chai.request(app)
			.post('/user/register')
			.send(register_detail1)
			.then(res => {
				expect(res).to.have.status(200);
				return chai.request(app)
				.post('/user/register')
				.send(register_detail2)
			})
			.catch(err => {
				throw err;
			})
			.then(res => {
				expect(res).to.have.status(200);
				return chai.request(app)
				.post('/friend/search')
				.send({
					'username': 'testuser1',
					'email': 'email2',
					'phone': 'phone3'
				});
			})
			.catch(err => {
				throw err;
			})
			.then(res => {
				expect(res).to.have.status(200);
				res.body.should.be.eql(
					{users: [
						{ name: 'testuser1', password: 'password1', email: 'email1',phone: 'phone1' },
						{ name: 'testuser2', password: 'password2', email: 'email2',phone: 'phone2' },
					]});
				done();
			})
			.catch(err => {
				expect(err).to.be.null;
				done();
			});
	});

	it('successfully found one users through name, email, and phone', (done) => {
		const register_detail1 = {
			'username': 'testuser1',
			'password': 'password1',
			'email': 'email1',
			'phone': 'phone1',
		};
		const register_detail2 = {
			'username': 'testuser2',
			'password': 'password2',
			'email': 'email2',
			'phone': 'phone2',
		};
		chai.request(app)
			.post('/user/register')
			.send(register_detail1)
			.then(res => {
				expect(res).to.have.status(200);
				return chai.request(app)
				.post('/user/register')
				.send(register_detail2)
			})
			.catch(err => {
				throw err;
			})
			.then(res => {
				expect(res).to.have.status(200);
				return chai.request(app)
				.post('/friend/search')
				.send({
					'username': 'testuser4',
					'email': 'email2',
					'phone': 'phone2'
				});
			})
			.catch(err => {
				throw err;
			})
			.then(res => {
				expect(res).to.have.status(200);
				res.body.should.be.eql(
					{users: [
						{ name: 'testuser2', password: 'password2', email: 'email2',phone: 'phone2' }
					]});
				done();
			})
			.catch(err => {
				expect(err).to.be.null;
				done();
			});
		});
});