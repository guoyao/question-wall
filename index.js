/**
 * @file index.js
 * @author guoyao(root[AT]guoyao.me)
 */

const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const route = require('koa-route');
const convert = require('koa-convert');
const Question = require('./question');

const app = new Koa();

app.use(require('koa-logger')());
app.use(require('koa-bodyparser')());

app.use(convert(serve(path.join(__dirname, 'public'))));
app.use(convert(serve(path.join(__dirname, 'node_modules/vue/dist'))));
app.use(convert(serve(path.join(__dirname, 'node_modules/vue-resource/dist'))));
app.use(convert(serve(path.join(__dirname, 'node_modules/vue-validator/dist'))));
app.use(convert(serve(path.join(__dirname, 'node_modules/underscore'))));


Question.load();

process.on('exit', () => {
    Question.persist();
});

process.on('SIGINT', () => {
    process.exit(0);
});

app.use(route.get('/question', Question.list));
app.use(route.post('/question', Question.create));
app.use(route.get('/clear/:name/:password', Question.clear));

app.listen(3000);
