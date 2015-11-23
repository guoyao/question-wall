/**
 * @file question
 * @author guoyao(root[AT]guoyao.me)
 */

(function () {
    var _ = window._;
    var Vue = window.Vue;

    _.mixin({
        trim: function (s) {
            return s.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    });

    var storage = {
        submiting: false,
        autoGotoBottomEnabled: true,
        question: {target: '', detail: ''},
        questions: []
    };

    Vue.filter('formatTime', function (value) {
        var date = new Date(value);
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    });

    Vue.filter('headIcon', function (value) {
        return 'images/head' + _.random(1, 15) + '.ico';
    });

    Vue.transition('expand', {
        afterEnter: function (el) {
            this.autoGotoBottomEnabled && window.scrollTo(0, document.body.scrollHeight);
        }
    });

    Vue.component('wall', {
        template: '#wall-template',
        data: function () {
            return storage;
        }
    });

    Vue.component('question', {
        template: '#question-template',
        data: function () {
            return storage;
        },
        methods: {
            submit: function () {
                var detail = _.trim(this.question.detail);
                if (!detail) {
                    alert('请填写提问内容');
                }
                else {
                    var resource = this.$resource('question/:id');
                    this.submiting = true;
                    resource.save({
                        target: this.question.target,
                        detail: this.question.detail
                    }).success(function () {
                        this.question.target = '';
                        this.question.detail = '';
                    }).always(function (data, status, request) {
                        this.submiting = false;
                        data.success !== true && alert('提问失败');
                    });
                }
            },
            toggleGotoBottom: function () {
                this.autoGotoBottomEnabled = !this.autoGotoBottomEnabled;
            }
        }
    });

    new Vue({
        el: 'body',
        ready: function () {
            var resource = this.$resource('question/:id');
            resource.get(function (data, status, request) {
                storage.questions.push.apply(storage.questions, resultHandler(data));

                var time = getLastTime();

                setInterval(function () {
                    resource.get({time: time}, function (data, status, request) {
                        storage.questions.push.apply(storage.questions, resultHandler(data));
                        time = getLastTime();
                    });
                }, 2000);
            });
        }
    });

    function getLastTime() {
        var time = -1;
        if (storage.questions.length > 0) {
            time = storage.questions[storage.questions.length - 1].time;
        }

        return time;
    }

    function resultHandler(data) {
        var arr = _.isArray(data) ? data : [];
        if (arr.length > 0 && arr[0].cleared === true) {
            storage.questions.splice(0, storage.questions.length);
            arr = [];
        }

        return arr;
    }
})();
