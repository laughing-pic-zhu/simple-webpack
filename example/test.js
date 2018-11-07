var argv = require('yargs')
    .command("morning", "good morning", function (yargs) {
        console.log("Good Morning");
    })
    .command("evening", "good evening", function (yargs) {
        console.log("Good Evening");
    })
    .argv;
