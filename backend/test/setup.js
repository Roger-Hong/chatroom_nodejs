const mongoose = require('mongoose');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

// Setup test configs.
before(() => {
	sandbox.stub(process.env, 'NODE_ENV').value('test');
	sandbox.stub(process.env, 'PORT').value('3002');
	sandbox.stub(process.env, 'MONGODB_PATH').value('mongodb://localhost/testchatroom');
});

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

// Restore environment variables.
after((done) => {
	const dbPath = process.env.MONGODB_PATH
	sandbox.restore();
	mongoose.connect(dbPath);
	mongoose.connection.once('open', () => {
		//console.log('Connected to test Mongodb for cleaning up legacy test data.')
		mongoose.connection.dropDatabase((err, result) => {
	        if (err) {
	        	console.log("error in deleting test database, " + err);
	        }
	        done();
		});
	}).on('error', (error) => {
		console.log('Connection error:', error);
		done();
	});
});