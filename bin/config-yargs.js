module.exports = function (yargs) {
    yargs
        .help("help")
        .alias("help", "h")
        .version()
        .alias("version", "v")
        .options({
            "watch": {
                type: "boolean",
                alias: "w",
                describe: "Watch the filesystem for changes",
            },
            "devtool": {
                type: "string",
                describe:"Enable devtool for better debugging experience",
                requiresArg: true
            }
        })
}
