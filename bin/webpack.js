const webpack = require('../lib/webpack.js');

var yargs = require("yargs")
    .usage("webpack " + require("../package.json").version);

require('./config-yargs')(yargs);


yargs.parse(process.argv.slice(2), (err, argv, output) => {
    console.log(argv)
    const options = require('./convert-argv')(argv);
    const compiler = webpack(options);

    function compilerCallback() {
        console.log('compiler finish');
    }

    if (options.watch) {
        compiler.watch(options.watch, compilerCallback);
        console.log("\nWebpack is watching the files…\n");
    } else {
        compiler.run(compilerCallback);
    }
});


