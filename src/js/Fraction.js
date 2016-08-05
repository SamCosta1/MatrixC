function Fraction(top, bottom) {
    this.top = top;
    this.bottom = bottom;
    if (top == undefined) {
        this.top = '0';
        this.bottom = '1';
    } else if (bottom == undefined) {
        this.bottom = '1';
    }
    this.bottom = this.bottom.toString();
    this.top = this.top.toString();

    if (this.top.includes('/')) {
        this.top = top.split('/')[0];
        this.bottom = top.split('/')[1];
    }

    this.top = new Big(this.top);
    this.bottom = new Big(this.bottom);

    var topDec = !this.top.mod(1).eq(0);
    botDec = !this.bottom.mod(1).eq(0);
    if (topDec || botDec) {
        var noDigtsTop = topDec ? this.top.toString().split('.')[1].length : 0;
        var noDigtsBot = botDec ? this.bottom.toString().split('.')[1].length : 0;
        var multiplier = Big(10).pow(noDigtsBot > noDigtsTop ? noDigtsBot : noDigtsTop);
        this.top = this.top.times(multiplier);
        this.bottom = this.bottom.times(multiplier);
    }

    var gcd = GCD(this.top, this.bottom);
    this.top = this.top.div(gcd);
    this.bottom = this.bottom.div(gcd);
    if (this.bottom.lt(0)) {
        this.top = this.top.times(-1);
        this.bottom = this.bottom.times(-1);
    }

    this.parseLiteral = function(v) {
            if (v instanceof Fraction)
                return v;
            else
                return new Fraction(v);
        },
        this.simplify = function() {
            var gcd = GCD(this.top, this.bottom);
            this.top = this.top.div(gcd);
            this.bottom = this.bottom.div(gcd);
            if (this.bottom.lt(0)) {
                this.top = this.top.times(-1);
                this.bottom = this.bottom.times(-1);
            }
        },
        this.divide = function(v) {
            v = this.parseLiteral(v);
            var result = new Fraction();
            result.top = this.top.times(v.bottom);
            result.bottom = this.bottom.times(v.top);
            result.simplify();
            return result;
        },
        this.times = function(v) {
            v = this.parseLiteral(v);
            if (this.top.eq(0) || v.top.eq(0))
                return new Fraction();
            var result = new Fraction();
            result.bottom = this.bottom.times(v.bottom);
            result.top = this.top.times(v.top);
            result.simplify();
            return result;
        },
        this.power = function(v) {
            v = this.parseLiteral(v);
            var pow = parseInt(v.top.valueOf());
            var result = this.clone();
            for (var p = 1; p < pow; p++)
                result = result.times(this);
            return result;
        },
        this.add = function(v) {
            v = this.parseLiteral(v);
            var result = new Fraction();
            result.top = this.top.times(v.bottom).add(this.bottom.times(v.top));
            result.bottom = this.bottom.times(v.bottom);
            result.simplify();
            return result;
        },
        this.subtract = function(v) {
            v = this.parseLiteral(v);
            var result = new Fraction();
            result.top = this.top.times(v.bottom).minus(this.bottom.times(v.top));
            result.bottom = this.bottom.times(v.bottom);
            result.simplify();
            return result;
        },
        this.reciprocal = function() {
            if (this.top.eq(0))
                return new Fraction(this.bottom, this.top);
            else return new Fraction();
        },
        this.getLiteral = function() {
            return parseInt(this.top.div(this.bottom).valueOf());
        },
        this.isZero = function() {
            return this.top.eq(0);
        },
        this.isOne = function() {
            return this.bottom.eq(this.top);
        },
    this.toString = function() {
            if (this.top.eq(0))
                return '0';
            if (this.bottom.eq(1))
                return this.top.toString();
            if (this.isOne())
                return '1';
            return this.top.toString() + '/' + this.bottom.toString();
        },
        this.clone = function() {
            return new Fraction(this.top, this.bottom);
        }
}

function GCD(big, small) {
    var r = big.mod(small);
    if (r.eq(0))
        return small;
    else {
        return GCD(small, r);
    }
}
