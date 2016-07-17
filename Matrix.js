var variables = new Map();

function Matrix(arrMatrix) {
    if (arrMatrix instanceof Array)
        this.matrix = math.matrix(arrMatrix);
    else if (arrMatrix == null)
        this.matrix = math.zeros(2, 2);
    else
        this.matrix = arrMatrix;

    this.numRows = function() {
        return this.matrix.size()[0];
    }
    this.numCols = function() {
        return this.matrix.size()[1];
    }


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
    this.inverse = function() {
        return new Matrix(math.inv(this.matrix));
    }
    this.add = function(other) {
        return new Matrix(math.add(this.matrix, other.matrix));
    }
    this.times = function(other) {
        if (typeof other == 'object')
            return new Matrix(math.multiply(this.matrix, other.matrix));
        else
            return new Matrix(math.multiply(this.matrix, other));
    }
    this.divide = function(other) {
        if (typeof other == 'object')
            return this.times(other.inverse());
        else
            return this.times(1/other);
    }
    this.subtract = function(other) {
        var minusOther = math.multiply(other.matrix, -1);
        return new Matrix(math.add(this.matrix, minusOther));
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
    this.getCell = function(row, col) {
        return math.subset(this.matrix, math.index(row, col));
    }
    this.performFunction = function(func) {

        switch (func)
        {
            case "#transpose":return this.transpose(); break;
            case "#inverse": return this.inverse(); break;
            case "#rank": return null;/*this.transpose();*/ break;
            case "#det": return this.det(); break;
            case "#diagonalize": return null;/*this.transpose(); */break;
        }
    }

}
