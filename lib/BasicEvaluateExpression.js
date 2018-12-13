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

    isArray() {
        return Object.prototype.hasOwnProperty.call(this, 'items');
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

    setTruthy() {
        this.falsy = false;
        this.truthy = true;
        return this;
    }

    setArray(items) {
        this.items = items;
        return this;
    }

    asBool() {
        if (this.truthy) return true;
    }

    setRange(range) {
        this.range = range;
        return this;
    }

    setIdentifier(identifier) {
        if (identifier === null)
            delete this.identifier;
        else
            this.identifier = identifier;
        return this;
    }

    setRegExp(regExp) {
        if (regExp === null)
            delete this.regExp;
        else
            this.regExp = regExp;
        return this;
    }
}

module.exports = BasicEvaluateExpression;
