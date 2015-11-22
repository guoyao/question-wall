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

    static load() {
        fs.openSync(storagePath, 'a');
        let arr = [];
        try {
            arr = JSON.parse(fs.readFileSync(storagePath, 'utf-8'));
        } catch (e) {
            console.error(e);
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

    static persist() {
        let questionsJson = JSON.stringify(questions);
        fs.writeFileSync(storagePath, questionsJson, 'utf-8');
    }

    static fromRaw(pojo) {
        return new Question(pojo.time, pojo.target, pojo.detail);
    }

    static list(ctx) {
        let time = ctx.request.query.time;
        let results = questions;
        if (time) {
            time = parseInt(time, 10);
            results = u.filter(results, (question) => question.time > time);
        }
        ctx.body = JSON.stringify(results);
    }

    static sort(questions) {
        questions.sort(function (a, b) {
            return a.time - b.time;
        });
    }
}

exports = module.exports = Question;
