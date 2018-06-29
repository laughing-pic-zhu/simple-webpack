class BasicEvaluateExpression {
    constructor(props) {
        this.range = null;
    }

    isNumber() {
        return Object.prototype.hasOwnProperty.call(this, 'number');
    }

    isString() {
        return Object.prototype.hasOwnProperty.call(this, 'string');
    }

    isBoolean() {
        return Object.prototype.hasOwnProperty.call(this, 'boolean');
    }

    setNumber(num) {
        this.number = num;
        return this;
    }

    setString(str) {
        this.string = str;
        return this;
    }

    setBoolean(bool) {
        this.boolean = bool;
        return this;
    }

    setRange(range) {
        this.range = range;
        return this;
    }
}

module.exports = BasicEvaluateExpression;
