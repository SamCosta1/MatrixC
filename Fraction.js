function Fraction(top, bottom) {
    this.bottom = bottom;
    this.top = top;

    if (bottom == undefined)
        this.bottom = 1;
    if (top == undefined) {
        this.top = 1;
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
        this.multiply = function(v) {
            v = this.parseLiteral(v);
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
        this.minus = function(v) {
            v = this.parseLiteral(v);
            var result = new Fraction();
            result.top = this.top * v.bottom - this.bottom * v.top;
            result.bottom = this.bottom * v.bottom;
            return result
        },
        this.getLiteral = function() {
            return this.top / this.bottom;
        }
}
