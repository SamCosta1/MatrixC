function Fraction(top, bottom) {
    this.top = top;
    this.bottom = bottom;
    if (top === undefined || top === '') {
        this.top = '0';
        this.bottom = '1';
    } else if (bottom === undefined || bottom === '') {
        this.bottom = '1';
    }
    this.bottom = this.bottom.toString();
    this.top = this.top.toString();

    if (this.top.indexOf('/') > 0) {
        this.top = top.split('/')[0];
        this.bottom = top.split('/')[1];
    }

    this.top = new Big(this.top);
    this.bottom = new Big(this.bottom);

    // Convert decimal numbers into Fraction
    var topDec = !this.top.mod(1).eq(0);
    var botDec = !this.bottom.mod(1).eq(0);
    if (topDec || botDec) {
        var noDigtsTop = topDec ? this.top.toString().split('.')[1].length : 0;
        var noDigtsBot = botDec ? this.bottom.toString().split('.')[1].length : 0;
        var multiplier = Big(10).pow(noDigtsBot > noDigtsTop ? noDigtsBot : noDigtsTop);
        this.top = this.top.times(multiplier);
        this.bottom = this.bottom.times(multiplier);
    }
    this.simplify();
}

Fraction.prototype.parseLiteral = function(v) {
    if (v instanceof Fraction)
        return v;
    else
        return new Fraction(v);
};
Fraction.prototype.simplify = function() {
    var gcd = GCD(this.top, this.bottom);
    this.top = this.top.div(gcd);
    this.bottom = this.bottom.div(gcd);
    if (this.bottom.lt(0)) {
        this.top = this.top.times(-1);
        this.bottom = this.bottom.times(-1);
    }
};
Fraction.prototype.divide = function(v) {
    v = this.parseLiteral(v);
    var result = new Fraction();
    result.top = this.top.times(v.bottom);
    result.bottom = this.bottom.times(v.top);
    result.simplify();
    return result;
};
Fraction.prototype.getTopString = function() {
    return this.top.toString();
}
Fraction.prototype.getBottomString = function() {
    return this.bottom.toString();
}
Fraction.prototype.times = function(v) {
    v = this.parseLiteral(v);
    if (this.top.eq(0) || v.top.eq(0))
        return new Fraction();
    var result = new Fraction();
    result.bottom = this.bottom.times(v.bottom);
    result.top = this.top.times(v.top);
    result.simplify();
    return result;
};
Fraction.prototype.power = function(v) {
    v = this.parseLiteral(v);
    var pow = parseInt(v.top.valueOf());
    var result = this.clone();
    for (var p = 1; p < pow; p++)
        result = result.times(this);
    return result;
};
Fraction.prototype.add = function(v) {
    v = this.parseLiteral(v);
    var result = new Fraction();
    result.top = this.top.times(v.bottom).add(this.bottom.times(v.top));
    result.bottom = this.bottom.times(v.bottom);
    result.simplify();
    return result;
};
Fraction.prototype.subtract = function(v) {
    v = this.parseLiteral(v);
    var result = new Fraction();
    result.top = this.top.times(v.bottom).minus(this.bottom.times(v.top));
    result.bottom = this.bottom.times(v.bottom);
    result.simplify();
    return result;
};
Fraction.prototype.reciprocal = function() {
    if (!this.top.eq(0))
        return new Fraction(this.bottom, this.top);
    else return new Fraction();
};
Fraction.prototype.getLiteral = function() {
    return parseInt(this.top.div(this.bottom).valueOf());
};
Fraction.prototype.isPositive = function() {
    return this.top.gt(0);
};
Fraction.prototype.abs = function() {
    return new Fraction(this.top.abs(), this.bottom.abs());
};
Fraction.prototype.isZero = function() {
    return this.top.eq(0);
};
Fraction.prototype.isOne = function() {
    return this.bottom.eq(this.top);
};
Fraction.prototype.isInt = function() {
    return this.bottom.eq('1');
};
Fraction.prototype.toString = function() {
    if (this.top.eq(0))
        return '0';
    if (this.bottom.eq(1))
        return this.top.toString();
    if (this.isOne())
        return '1';
    return this.top.toString() + '/' + this.bottom.toString();
};
Fraction.prototype.clone = function() {
    return new Fraction(this.top, this.bottom);
};
Fraction.prototype.getTex = function() {
    if (this.isOne())
        return '1';
    else if (this.isZero())
        return '0';
    else if (this.bottom.eq(1))
        return this.top.toString();
    else
        return "\\frac{" + this.top.toString() + "}{" + this.bottom.toString() + "}";
};

function GCD(big, small) {
    //HACK Not sure if it's best to do this here
    if (small.eq(0))
        return 1;

    var r = big.mod(small);
    if (r.eq(0))
        return small;
    else {
        return GCD(small, r);
    }
}
