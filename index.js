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

// BUG(koa-static): can't use the same option object for two or more serve functions
// So i have to use an object each
app.use(convert(serve(path.join(__dirname, 'public'), {maxage: 86400000})));
app.use(convert(serve(path.join(__dirname, 'node_modules/vue/dist'), {maxage: 86400000})));
app.use(convert(serve(path.join(__dirname, 'node_modules/vue-resource/dist'), {maxage: 86400000})));
app.use(convert(serve(path.join(__dirname, 'node_modules/vue-validator/dist'), {maxage: 86400000})));
app.use(convert(serve(path.join(__dirname, 'node_modules/underscore'), {maxage: 86400000})));


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

app.listen(8668);

