var async = require("async");
const fs = require('fs');
var obj = {dev: "/a.js", test: "/b.js", prod: "/e.js"};

var configs = {};
var call_order = [];

async.parallel([function (callback) {
    setTimeout(function () {
        call_order.push(1);
        callback(null, 1);
    }, 50);
}, function (callback) {
    setTimeout(function () {
        call_order.push(2);
        callback(null, 2);
    }, 100);
},
    function (callback) {
        setTimeout(function () {
            call_order.push(3);
            callback(null, 3, 3);
        }, 25);
    }

], function (err, results) {
    console.log(call_order)
    console.log(results)
});

