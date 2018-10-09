const Watchpack = require('watchpack');

class NodeWatchFileSystem {
    constructor() {
        this.watcher = new Watchpack({
            aggregateTimeout: 0
        });
    }

    watch(files, dirs, missing, startTime, options, callback) {
        const oldWatcher = this.watcher;
        this.watcher = new Watchpack(options);
        this.watcher.watch(files.concat(missing), dirs.concat(missing), startTime);
        this.watcher.once('aggregated', changes => {
            callback(changes)
        });
        if (oldWatcher) {
            oldWatcher.close();
        }
    }
}

module.exports = NodeWatchFileSystem
