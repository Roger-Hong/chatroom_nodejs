const mongoose = require('mongoose');
const sinon = require('sinon');
const sandbox = sinon.createSandbox();

// Setup test configs.
before(() => {
	sandbox.stub(process.env, 'NODE_ENV').value('test');
	sandbox.stub(process.env, 'PORT').value('3002');
	sandbox.stub(process.env, 'MONGODB_PATH').value('mongodb://localhost/testchatroom');
});

// Restore environment variables.
after((done) => {
	sandbox.restore();
	mongoose.connect(process.env.MONGODB_PATH);
	mongoose.connection.once('open', () => {
		//console.log('Connected to test Mongodb for cleaning up legacy test data.');
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