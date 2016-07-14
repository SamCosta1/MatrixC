var variables = new Map();

function Matrix(arrMatrix) {
    if (arrMatrix instanceof Array)
        this.matrix = math.matrix(arrMatrix);
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
            result = math.multiply(result,this.matrix);

return new Matrix(result);

    }

    // Functions with label setters
    this.Ldeterminant = function(label) {
        var tmp = this.det();
        variables.set(label, tmp);
        return tmp;
    }
    this.Ldet = function(label) {
        return this.determinant(label);
    }

    this.Ltranspose = function(label) {
            var tmp = this.transpose();
            variables.set(label, tmp);
            return tmp;
        }
        //TODO
    this.Ladd = function(other, label) {
        return this.add(other);
    }
    this.Lsubtract = function(other, label) {
        var tmp = this.subtract(other);
        variables.set(label, tmp);
        return tmp;
    }
    this.Lpower = function(power, label) {
        var tmp = this.power(power);
        variables.set(label, tmp);
        return tmp;
    }
}
