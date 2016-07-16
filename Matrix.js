var variables = new Map();

function Matrix(arrMatrix) {
    if (arrMatrix instanceof Array)
        this.matrix = math.matrix(arrMatrix);
    else if (arrMatrix == null)
        this.matrix = math.zeros(3,3);
    else
        this.matrix = arrMatrix;

    // Standard functions
    this.determinant = function() {
        return math.det(this.matrix);
    }
    this.det = function() {
        return this.determinant();
    }
    this.transpose = function() {
        return new Matrix(math.transpose(this.matrix));
    }
    this.add = function(other) {
        return new Matrix(math.add(this.matrix, other.matrix));
    }
    this.subtract = function(other) {
        var minusOher = math.multiply(other.matrix, -1);
        return new Matrix(math.add(this.matrix, minusOher));
    }
    this.power = function(power) {
        var result = this.matrix;
        for (i = 1; i < power; i++)
            result = math.multiply(result, this.matrix);
        return new Matrix(result);
    }

    this.update = function(row, col, val) {
        this.matrix = math.subset(this.matrix, math.index(parseInt(row),
            parseInt(col)), parseInt(val));
    }

    this.getCell = function(row,col) {
        return math.subset(this.matrix, math.index(row, col));
    }

}
