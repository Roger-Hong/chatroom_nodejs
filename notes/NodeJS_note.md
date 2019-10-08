* [ExpressJS Crash Course](https://www.youtube.com/watch?v=gnsO8-xJ8rs) (MongoDB 51:30)
* nodemon app.js: do not need to repeatedly restart server.
* ejs: embedded JS. Standard Html & easy to use.
* express-validator
* [Express directory structure](https://www.freecodecamp.org/news/how-to-write-a-production-ready-node-and-express-app-f214f0b17d8c/)
* [Express directory structure](https://www.terlici.com/2014/08/25/best-practices-express-structure.html)
* Smaple curl post: `curl -X POST http://localhost:3001/user/register -H 'Content-Type: application/json' -d '{"username": "yijiehong", "password": "1234567"}'`
* Sample for mocha and chai test: https://dev.to/asciidev/testing-a-nodeexpress-application-with-mocha--chai-4lho
* Explanation of env variables: https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
* Sinon for mock env: https://glebbahmutov.com/blog/mocking-process-env/
* Chained promise example: https://segmentfault.com/a/1190000015421820
* Lock - mutex: https://www.npmjs.com/package/locks
* Chai-http: https://www.chaijs.com/plugins/chai-http/
* Redis general instruction: https://zhuanlan.zhihu.com/p/37982685
* Docker
	* Create local mongo container: `docker run --name ChatroomMongodb -p 27019:27017 -v /tmp/db:/data/db -d mongo`
	* Create local mongo-express: `docker run -it --rm -p 8082:8081 --link <mongoDB container ID>:mongo mongo-express`