function Fraction(top, bottom) {
    this.bottom = bottom;
    this.top = top;

    if (top == undefined) {
        this.top = 0;
    }
    if (bottom == undefined) {
        if (typeof top === 'string' && top.includes('/')) {
            this.top = parseFloat(top.split('/')[0]);
            this.bottom = parseFloat(top.split('/')[1]);
        } else
            this.bottom = 1;
    }
    var topDec = this.top % 1 !== 0,
        botDec = this.bottom % 1 !== 0;
    if (topDec || botDec) {
        var noDigtsTop = topDec? this.top.toString().split('.')[1].length : 0;
        var noDigtsBot = botDec? this.bottom.toString().split('.')[1].length : 0;
        var multiplier = Math.pow(10,noDigtsBot > noDigtsTop ? noDigtsBot : noDigtsTop);
        this.top *= multiplier;
        this.bottom *= multiplier;
    }

    var gcd = GCD(this.top, this.bottom);
    this.top /= gcd;
    this.bottom /= gcd;
    if (this.bottom < 0) {
        this.top *= -1;
        this.bottom *= -1;
    }

    this.parseLiteral = function(v) {
            if (v instanceof Fraction)
                return v;
            else
                return new Fraction(v);
        },
        this.simplify = function() {
            var gcd = GCD(this.top, this.bottom);
            this.top /= gcd;
            this.bottom /= gcd;

            if (this.bottom < 0) {
                this.top *= -1;
                this.bottom *= -1;
            }
        },
        this.divide = function(v) {
            v = this.parseLiteral(v);
            var result = new Fraction();
            result.top = this.top * v.bottom;
            result.bottom = this.bottom * v.top;
            result.simplify();
            return result;
        },
        this.times = function(v) {
            v = this.parseLiteral(v);
            if (this.top == 0 || v.top == 0)
                return new Fraction(0, 1);
            var result = new Fraction();
            result.bottom = this.bottom * v.bottom;
            result.top = this.top * v.top;
            result.simplify();
            return result;
        },
        this.power = function(v) {
            v = this.parseLiteral(v);
            var pow = v.top;
            var result = this.clone();
            for (var p = 1; p < pow; p++)
                result = result.times(this);
            return result;
        }
    this.add = function(v) {
            v = this.parseLiteral(v);
            var result = new Fraction();
            result.top = this.top * v.bottom + this.bottom * v.top;
            result.bottom = this.bottom * v.bottom;
            result.simplify();
            return result
        },
        this.subtract = function(v) {
            v = this.parseLiteral(v);
            var result = new Fraction();
            result.top = this.top * v.bottom - this.bottom * v.top;
            result.bottom = this.bottom * v.bottom;
            result.simplify();
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
        },
        this.isOne = function() {
            return this.bottom == this.top == 1;
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

function GCD(big, small) {
    var r = big % small;
    if (r == 0)
        return small;
    else {
        return GCD(small, r);
    }
}
