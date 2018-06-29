const map = {
    son: [
        'son1',
        'son2',
        'son3'
    ],
    son1: [
        'son4',
        'son5',
    ],
    son2: [
        'son6',
    ],
    son3: ['son6'],
    son4: [
        'son7',
    ],
    son5: [],
    son6: [],
    son7: [],
};

const tree = {};

function findTreeNodes() {
    findTreeNode('son', done);
}

function findTreeNode(name, callback) {
    findNode(name, function (sons) {
        if (tree[name]) {
            callback();
            return;
        }
        tree[name] = sons;
        let len = sons.length;
        if (len === 0) {
            callback();
        } else {
            sons.forEach(son => {
                findTreeNode(son, function () {
                    len--;
                    if (len === 0) {
                        callback();
                    }
                })
            })
        }
    })
}

function findNode(name, callback) {
    setTimeout(() => {
        callback(map[name]);
    }, 1000)
}

function done() {
    console.log(tree);
}

findTreeNodes();
