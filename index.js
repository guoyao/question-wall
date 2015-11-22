/**
 * Created by apple on 11/22/15.
 */

const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const route = require('koa-route');
const logger = require('koa-logger');
const convert = require('koa-convert');
const Question = require('./question');

const app = new Koa();

app.use(convert(serve(path.join(__dirname, 'public'))));
app.use(convert(serve(path.join(__dirname, 'node_modules/vue/dist'))));
app.use(logger());

Question.load();

process.on('exit', function () {
    Question.persist();
});

process.on('SIGINT', function () {
    process.exit(0);
});

app.use(route.get('/questions', Question.list));

app.listen(3000);