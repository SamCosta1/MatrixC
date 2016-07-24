var variables = new Map();

function Matrix(arrMatrix) {
    if (arrMatrix instanceof Array)
        this.matrix = math.matrix(arrMatrix);
    else if (arrMatrix === 'null')
        this.matrix = math.zeros(2, 2);
    else
        this.matrix = arrMatrix;

    this.numRows = function() {
        return this.matrix.size()[0];
    },
    this.numCols = function() {
        return this.matrix.size()[1];
    },


    // Standard functions
    this.determinant = function() {
        return math.det(this.matrix);
    },
    this.det = function() {
        return this.determinant();
    },
    this.transpose = function() {
        return new Matrix(math.transpose(this.matrix));
    },
    this.inverse = function() {
        return new Matrix(math.inv(this.matrix));
    },
    this.add = function(other) {
        return new Matrix(math.add(this.matrix, other.matrix));
    },
    this.times = function(other) {
        if (typeof other == 'object')
            return new Matrix(math.multiply(this.matrix, other.matrix));
        else
            return new Matrix(math.multiply(this.matrix, other));
    },
    this.divide = function(other) {
        if (typeof other == 'object')
            return this.times(other.inverse());
        else
            return this.times(1 / other);
    },
    this.subtract = function(other) {
        var minusOther = math.multiply(other.matrix, -1);
        return new Matrix(math.add(this.matrix, minusOther));
    },
    this.power = function(power) {
        var result = this.matrix;
        for (i = 1; i < power; i++)
            result = math.multiply(result, this.matrix);
        return new Matrix(result);
    },

    this.update = function(row, col, val) {
        this.matrix = math.subset(this.matrix, math.index(parseInt(row),
            parseInt(col)), parseInt(val));
    },
    this.getCell = function(row, col) {
        return math.subset(this.matrix, math.index(parseInt(row), parseInt(col)));
    },
    this.performFunction = function(func) {
        switch (func) {
            case funcENUM.TRANSPOSE:
                return this.transpose();
            case funcENUM.INVERSE:
                return this.inverse();
            case funcENUM.RANK:
                return null;
            case funcENUM.DET:
                return this.det();
            case funcENUM.DIAGONALIZE:
                return null;
        }
    }
}
var funcENUM = {
    NONE: '#',
    TRANSPOSE: '#T',
    INVERSE: '#I',
    RANK: '#R',
    DET: '#D',
    EIGEN: '#E',
    DIAGONALIZE: '#DI',
    isFunction: function(str) {
        var found = false;
        $.each(this, function(key, value) {
            if (value == str)
                found = true;
        });
        return found;
    },
    getString: function(str) {
        switch (str) {
            case this.TRANSPOSE:
                return "transpose";
            case this.RANK:
                return "rank";
            case this.INVERSE:
                return "inverse";
            case this.DET:
                return "determinant";
            case this.EIGEN:
                return "eigenvalues/vectors";
            case this.DIAGONALIZE:
                return "diagonal form";
        }
        return "NOTHING";
    }
};

function getEnum(input) {
    switch (input.toLowerCase()) {
        case 'transpose':
        case 'trans':
            return funcENUM.TRANSPOSE;
        case 'inverse':
        case 'inv':
            return funcENUM.INVERSE;
        case 'rank':
            return funcENUM.RANK;
        case 'det':
        case 'determinant':
            return funcENUM.DET;
        case 'eigen':
            return funcENUM.EIGEN;
        case 'diagonalize':
            return funcENUM.DIAGONALIZE;
    }
    return funcENUM.NONE;
}
