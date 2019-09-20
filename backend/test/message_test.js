const assert = require('assert')
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const messageCache = require('../models/message');

const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

/** Test send message */
describe('To test send messages', () => {

	it('successfully send four messages.', (done) => {
		chai.request(app)
			.post('/message/send')
			.send({
				sender: "user1",
				receiver: "user2",
				message: "First message"
			})
			.then(res => {
				expect(res).to.have.status(200);
				return chai.request(app)
				.post('/message/send')
				.send({
					sender: "user1",
					receiver: "user3",
					message: "Second message"
				})
			})
			.catch(err => {
				throw err;
			})
			.then(res => {
				expect(res).to.have.status(200);
				return chai.request(app)
				.post('/message/send')
				.send({
					sender: "user1",
					receiver: "user2",
					message: "Third message"
				})
			})
			.catch(err => {
				throw err;
			})
			.then(res => {
				expect(res).to.have.status(200);
				return chai.request(app)
				.post('/message/send')
				.send({
					sender: "user2",
					receiver: "user3",
					message: "Fourth message"
				})
			})
			.catch(err => {
				throw err;
			})
			.then(res => {
				expect(res).to.have.status(200);

				const receivers = new Map();
				
				delete messageCache.getReceiversMapForTest().get("user2").get("user1")[0].timestamp;
				receivers.set("user2", new Map());
				receivers.get("user2").set("user1", [{
					message: "First message"
				}]);
				
				delete messageCache.getReceiversMapForTest().get("user3").get("user1")[0].timestamp;
				receivers.set("user3", new Map());
				receivers.get("user3").set("user1", [{
					message: "Second message"
				}]);
				
				delete messageCache.getReceiversMapForTest().get("user2").get("user1")[1].timestamp;
				receivers.get("user2").get("user1").push({
					message: "Third message"
				});
				
				delete messageCache.getReceiversMapForTest().get("user3").get("user2")[0].timestamp;
				receivers.get("user3").set("user2", [{
					message: "Fourth message"
				}]);

				messageCache.getReceiversMapForTest().should.be.eql(receivers);
				done();
			})
			.catch(err => {
				expect(err).to.be.null;
				done();
			});
	});
});

/** Test read message */
describe('To test read messages', () => {

	it('successfully read messages.', (done) => {
		const receivers = new Map();

		receivers.set("user2", new Map());
		receivers.get("user2").set("user1", [{
			message: "First message",
			timestamp: 1
		},
		{
			message: "Second message",
			timestamp: 2
		}]);
		receivers.get("user2").set("user3", [{
			message: "Third message",
			timestamp: 3
		}]);
		receivers.set("user1", new Map());
		receivers.get("user1").set("user3", [{
			message: "Third message",
			timestamp: 4
		}]);
		messageCache.setReceiversMapForTest(receivers);
		chai.request(app)
			.post('/message/read')
			.send({
				sender: "user1",
				receiver: "user2"
			})
			.then(res => {
				expect(res).to.have.status(200);
				const expectedReceivers = new Map();

				expectedReceivers.set("user2", new Map());
				expectedReceivers.get("user2").set("user1", []);
				expectedReceivers.get("user2").set("user3", [{
					message: "Third message",
					timestamp: 3
				}]);
				expectedReceivers.set("user1", new Map());
				expectedReceivers.get("user1").set("user3", [{
					message: "Third message",
					timestamp: 4
				}]);
				res.body.should.be.eql({ messages: [
					{ message: 'First message', timestamp: 1 },
					{ message: 'Second message', timestamp: 2 }
				]});
				messageCache.getReceiversMapForTest().should.be.eql(expectedReceivers);
				done();
			})
			.catch(err => {
				expect(err).to.be.null;
				done();
			});
	});
});

/** Test message notifications. */
describe('To test messages notifications.', () => {

	it('successfully received message notifications.', (done) => {
		const receivers = new Map();

		receivers.set("user2", new Map());
		receivers.get("user2").set("user1", [{
			message: "First message",
			timestamp: 1
		},
		{
			message: "Second message",
			timestamp: 2
		}]);
		receivers.get("user2").set("user3", [{
			message: "Third message",
			timestamp: 3
		}]);
		receivers.set("user1", new Map());
		receivers.get("user1").set("user3", [{
			message: "Third message",
			timestamp: 4
		}]);
		messageCache.setReceiversMapForTest(receivers);
		chai.request(app)
			.post('/message/getNotification')
			.send({	receiver: "user2" })
			.then(res => {
				expect(res).to.have.status(200);
				res.body.should.be.eql({ notifications: {user1: 2, user3: 1} });
				done();
			})
			.catch(err => {
				expect(err).to.be.null;
				done();
			});
	});
});