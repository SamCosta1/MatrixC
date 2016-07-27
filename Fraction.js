function Fraction(top, bottom) {
    this.bottom = bottom;
    this.top = top;

    if (bottom == undefined)
        this.bottom = 1;
    this.parseLiteral = function(v) {
            if (v instanceof Fraction)
                return v;
            else
                return new Fraction(v);
        },
        this.divide = function(v) {
            v = this.parseLiteral(v);
            this.bottom *= v.top;
            this.top *= v.bottom;
        },
        this.multiply = function(v) {
            v = this.parseLiteral(v);
            this.bottom *= v.bottom;
            this.top *= v.top;
        },
        this.add = function(v) {
            v = this.parseLiteral(v);
            this.top = this.top * v.bottom + this.bottom * v.top;
            this.bottom *= v.bottom;
        },
        this.minus = function(v) {
            v = this.parseLiteral(v);
            this.top = this.top * v.bottom - this.bottom * v.top;
            this.bottom *= v.bottom;
        },
        this.getLiteral = function() {
            return this.top / this.bottom;
        }
}
