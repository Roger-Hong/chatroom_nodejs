const assert = require('assert')
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const FriendshipModel = require('../models/friendship');

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

/** Test invite friends */
describe('To test invite friends', () => {

	// Chai-http with promise.
	it('successfully invited one user', (done) => {
		chai.request(app)
			.post('/friend/invite')
			.send({inviter: "user1", invitee: "user2"})
			.then(result => {
				expect(result).to.have.status(200);
				return FriendshipModel.db.findOne({
					inviterName: "user1",
					inviteeName: "user2"
				}).exec()
			})
			.catch(err => {
				throw err;
			})
			.then(result => {
				result.inviterName.should.be.eql("user1");
				result.inviteeName.should.be.eql("user2");
				result.status.should.be.eql("pending");
				done();
			})
			.catch(err => {
				expect(err).to.be.null;
				done();
			});
	});

	it('successfully invited one user twice', (done) => {
		chai.request(app)
			.post('/friend/invite')
			.send({inviter: "user1", invitee: "user2"})
			.then(result => {
				expect(result).to.have.status(200);
				return chai.request(app)
				.post('/friend/invite')
				.send({inviter: "user1", invitee: "user2"})
			})
			.catch(err => {
				throw err;
			})
			.then(result => {
				expect(result).to.have.status(200);
				return FriendshipModel.db.findOne({
					inviterName: "user1",
					inviteeName: "user2"
				}).exec()
			})
			.catch(err => {
				throw err;
			})
			.then(result => {
				result.inviterName.should.be.eql("user1");
				result.inviteeName.should.be.eql("user2");
				result.status.should.be.eql("pending");
				done();
			})
			.catch(err => {
				expect(err).to.be.null;
				done();
			});
	});

	it('failed to invite an accepted user.', (done) => {
		let friendship = new FriendshipModel.db({
			inviterName: "user1",
			inviteeName: "user2",
			status: FriendshipModel.friendshipStatus.ACCEPTED,
			timestamp: Date.now()
		})
		friendship.save()
		.then(result => {
			return chai.request(app)
			.post('/friend/invite')
			.send({inviter: "user1", invitee: "user2"})
		})
		.catch(err => {
			throw err;
		})
		.then(res =>{
			res.should.have.status(500);
			done();
		})
		.catch(err => {
			expect(err).to.be.null;
			done();
		});
	});
});

/** Test accept invitation */
describe('To test accept invitation', () => {
	it('successfully accepted an invitation', (done) => {
		let friendship1 = new FriendshipModel.db({
			inviterName: "user1",
			inviteeName: "user2",
			status: FriendshipModel.friendshipStatus.PENDING,
			timestamp: Date.now()
		})
		let friendship2 = new FriendshipModel.db({
			inviterName: "user2",
			inviteeName: "user1",
			status: FriendshipModel.friendshipStatus.PENDING,
			timestamp: Date.now()
		})
		friendship1.save()
		.then(result => {
			return friendship2.save();
		})
		.catch(err => {
			throw err;
		})
		.then(result => {
			return chai.request(app)
			.post('/friend/accept')
			.send({inviter: "user1", invitee: "user2"})
		})
		.catch(err => {
			throw err;
		})
		.then(res => {
			expect(res).to.have.status(200);
			return FriendshipModel.db.findOne({
				inviterName: "user2",
				inviteeName: "user1"
			}).exec()
		})
		.catch(err => {
			throw err;
		})
		.then(res => {
			expect(res).to.not.be.ok;
			return FriendshipModel.db.findOne({
				inviterName: "user1",
				inviteeName: "user2"
			}).exec()
		})
		.catch(err => {
			throw err;
		})
		.then(result => {
			result.inviterName.should.be.eql("user1");
			result.inviteeName.should.be.eql("user2");
			result.status.should.be.eql("accepted");
			done();
		})
		.catch(err => {
			expect(err).to.be.null;
			done();
		});
	});

	it('failed to accepted an accepted invitation', (done) => {
		let friendship = new FriendshipModel.db({
			inviterName: "user1",
			inviteeName: "user2",
			status: FriendshipModel.friendshipStatus.ACCEPTED,
			timestamp: Date.now()
		})
		friendship.save()
		.then(result => {
			return chai.request(app)
			.post('/friend/accept')
			.send({inviter: "user1", invitee: "user2"})
		})
		.catch(err => {
			throw err;
		})
		.then(res => {
			res.should.have.status(500);
			return FriendshipModel.db.findOne({
				inviterName: "user1",
				inviteeName: "user2"
			}).exec()
		})
		.catch(err => {
			throw err;
		})
		.then(result => {
			result.inviterName.should.be.eql("user1");
			result.inviteeName.should.be.eql("user2");
			result.status.should.be.eql("accepted");
			done();
		})
		.catch(err => {
			expect(err).to.be.null;
			done();
		});
	});
});

/** Test reject invitation. */
describe('To test reject invitation', () => {
	it('successfully rejected an invitation', (done) => {
		let friendship = new FriendshipModel.db({
			inviterName: "user1",
			inviteeName: "user2",
			status: FriendshipModel.friendshipStatus.PENDING,
			timestamp: Date.now()
		})
		friendship.save()
		.then(result => {
			return chai.request(app)
			.post('/friend/reject')
			.send({inviter: "user1", invitee: "user2"})
		})
		.catch(err => {
			throw err;
		})
		.then(res => {
			res.should.have.status(200);
			return FriendshipModel.db.findOne({
				inviterName: "user1",
				inviteeName: "user2"
			}).exec()
		})
		.catch(err => {
			throw err;
		})
		.then(result => {
			expect(result).to.not.be.ok;
			done();
		})
		.catch(err => {
			expect(err).to.be.null;
			done();
		});
	});

	it('failed to reject an invitation', (done) => {
		chai.request(app)
			.post('/friend/reject')
			.send({inviter: "user1", invitee: "user2"})
			.then(res => {
				res.should.have.status(500);
				done();
			})
			.catch(err => {
				expect(err).to.be.null;
				done();
			});
	});
});

/** Test isFriend(). */
describe('To test the judgement if two users are friends', () => {
	it('successfully found friendship', (done) => {
		let friendship1 = new FriendshipModel.db({
			inviterName: "user1",
			inviteeName: "user2",
			status: FriendshipModel.friendshipStatus.PENDING,
			timestamp: Date.now()
		})
		let friendship2 = new FriendshipModel.db({
			inviterName: "user2",
			inviteeName: "user1",
			status: FriendshipModel.friendshipStatus.ACCEPTED,
			timestamp: Date.now()
		})
		friendship1.save()
		.then(result => {
			return friendship2.save();
		})
		.catch(err => {
			throw err;
		})
		.then(result => {
			return chai.request(app)
			.post('/friend/isFriend')
			.send({user1: "user1", user2: "user2"})
		})
		.catch(err => {
			throw err;
		})
		.then(res => {
			res.should.have.status(200);
			res.body.should.be.eql({isFriend: true});
			done();
		})
		.catch(err => {
			expect(err).to.be.null;
			done();
		});
	});

	it('successfully not found friendship', (done) => {
		let friendship1 = new FriendshipModel.db({
			inviterName: "user1",
			inviteeName: "user2",
			status: FriendshipModel.friendshipStatus.PENDING,
			timestamp: Date.now()
		})
		friendship1.save()
		.then(result => {
			return chai.request(app)
			.post('/friend/isFriend')
			.send({user1: "user1", user2: "user2"})
		})
		.catch(err => {
			throw err;
		})
		.then(res => {
			res.should.have.status(200);
			res.body.should.be.eql({isFriend: false});
			done();
		})
		.catch(err => {
			expect(err).to.be.null;
			done();
		});
	});
});

/** Test delete invitation. */
describe('To test reject invitation', () => {
	it('successfully deleted one invitations', (done) => {
		let friendship1 = new FriendshipModel.db({
			inviterName: "user1",
			inviteeName: "user2",
			status: FriendshipModel.friendshipStatus.PENDING,
			timestamp: Date.now()
		})
		let friendship2 = new FriendshipModel.db({
			inviterName: "user2",
			inviteeName: "user1",
			status: FriendshipModel.friendshipStatus.ACCEPTED,
			timestamp: Date.now()
		})
		friendship1.save()
		.then(result => {
			return friendship2.save();
		})
		.catch(err => {
			throw err;
		})
		.then(result => {
			return chai.request(app)
			.post('/friend/delete')
			.send({inviter: "user1", invitee: "user2"})
		})
		.catch(err => {
			throw err;
		})
		.then(res => {
			res.should.have.status(200);
			return FriendshipModel.db.findOne({
				inviterName: "user2",
				inviteeName: "user1"
			}).exec()
		})
		.catch(err => {
			throw err;
		})
		.then(res => {
			expect(res).to.not.be.ok;
			return FriendshipModel.db.findOne({
				inviterName: "user1",
				inviteeName: "user2"
			}).exec()
		})
		.catch(err => {
			throw err;
		})
		.then(result => {
			result.inviterName.should.be.eql("user1");
			result.inviteeName.should.be.eql("user2");
			result.status.should.be.eql("pending");
			done();
		})
		.catch(err => {
			expect(err).to.be.null;
			done();
		});
	});
});