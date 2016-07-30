function Fraction(top, bottom) {
    this.bottom = bottom;
    this.top = top;

    if (top == undefined) {
        this.top = 0;
    }
    if (bottom == undefined) {
        if (typeof top === 'string' && top.includes('/')) {
            this.top = parseInt(top.split('/')[0]);
            this.bottom = parseInt(top.split('/')[1]);
        } else
            this.bottom = 1;
    }
    this.parseLiteral = function(v) {
            if (v instanceof Fraction)
                return v;
            else
                return new Fraction(v);
        },
        this.divide = function(v) {
            v = this.parseLiteral(v);
            var result = new Fraction();
            result.top = this.top * v.bottom;
            result.bottom = this.bottom * v.top;
            return result;
        },
        this.times = function(v) {
            v = this.parseLiteral(v);
            if (this.top == 0 || v.top == 0)
                return new Fraction (0,1);
            var result = new Fraction();
            result.bottom = this.bottom * v.bottom;
            result.top = this.top * v.top;
            return result;
        },
        this.add = function(v) {
            v = this.parseLiteral(v);
            var result = new Fraction();
            result.top = this.top * v.bottom + this.bottom * v.top;
            result.bottom = this.bottom * v.bottom;
            return result
        },
        this.subtract = function(v) {
            v = this.parseLiteral(v);
            var result = new Fraction();
            result.top = this.top * v.bottom - this.bottom * v.top;
            result.bottom = this.bottom * v.bottom;
            return result
        },
        this.reciprocal = function() {
            if (this.top != 0)
                return new Fraction(this.bottom, this.top);
            else return new Fraction(0, 1);
        },
        this.getLiteral = function() {
            return this.top / this.bottom;
        },
        this.isZero = function() {
            return this.top == 0;
        }
        this.toString = function() {
            if (this.top == 0)
                return 0;
            if (this.bottom == 1)
                return this.top;
            if (this.top == this.bottom)
                return 1;
            return this.top + '/' + this.bottom;
        },
        this.clone = function() {
            return new Fraction(this.top, this.bottom);
        }
}
