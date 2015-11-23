/**
 * @file question
 * @author guoyao(root[AT]guoyao.me)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const u = require('underscore');

const storagePath = path.join(__dirname, 'data.json');

const questions = [];

class Question {
    constructor(time, target, detail) {
        this.time = time;
        this.target = target;
        this.detail = detail;
    }

    // Load persisted data from local file
    static load() {
        let arr = [];

        if (!fs.existsSync(storagePath)) {
            fs.closeSync(fs.openSync(storagePath, 'w'));
            fs.writeFileSync(storagePath, '[]', 'utf-8');
        }
        else {
            try {
                arr = JSON.parse(fs.readFileSync(storagePath, 'utf-8'));
            }
            catch (e) {
                /* eslint-disable */
                console.error(e);
                /* eslint-enable */
            }
        }

        if (arr.length > 0) {
            arr.forEach((item) => {
                if (item.time && item.detail) {
                    questions.push(Question.fromRaw(item));
                }
            });
        }

        Question.sort(questions);

        return questions;
    }

    // Persist data in memory to local file
    static persist() {
        let questionsJson = JSON.stringify(questions);
        fs.writeFileSync(storagePath, questionsJson, 'utf-8');
    }

    static fromRaw(pojo) {
        !pojo.time && (pojo.time = new Date().getTime());
        return new Question(pojo.time, pojo.target, pojo.detail);
    }

    // List questions, only retrun the new added questions
    static list(ctx) {
        let time = ctx.request.query.time;
        let results = questions;
        if (time) {
            time = parseInt(time, 10);
            if (time > 0 && (questions.length === 0 || time < questions[0].time)) {
                ctx.body = [{cleared: true}];
                return;
            }
            results = u.filter(results, (question) => question.time > time);
        }
        ctx.body = Question.sort(results);
    }

    static create(ctx) {
        let body = ctx.request.body;
        questions.push(Question.fromRaw(body));
        ctx.body = {success: true};
    }

    // Clear all questions and flush to all clients, empty the question wall
    // Here, admin and baidubce@9527 are magic words
    static clear(ctx, name, password) {
        if (name === 'admin' && password === 'baidubce@9527') {
            questions.splice(0, questions.length);
            ctx.body = {success: true, result: {cleared: true}};
            return;
        }
        
        ctx.status = 404;
    }

    static sort(questions) {
        questions.sort(function (a, b) {
            return a.time - b.time;
        });

        return questions;
    }
}

exports = module.exports = Question;
