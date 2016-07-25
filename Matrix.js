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
        this.conjugate = function(power) {
            return power.inverse().times(this).times(power);
        },
        this.update = function(row, col, val) {
            this.matrix = math.subset(this.matrix, math.index(parseInt(row),
                parseInt(col)), parseFloat(val));
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
        },
        this.solveAugmentedMatrix = function(numCols) {
            if (numCols == undefined || numCols > this.numCols)
                numCols = this.numCols();

            var result = new Matrix(this.matrix);
            var takenPivots = -1;
            for (var col = 0; col < numCols; col++) {
                // Get a nonzero entry in this cell
                console.log("Col " + col, result.matrix + "","P",this.getCell(col, takenPivots + 1));
console.log(" ");
                if (result.getCell(col, takenPivots + 1) === 0) {
                    var zeroFound = false;
                    var _row = 0;
                    while (!zeroFound && _row < result.numRows()) {
                        if (result.getCell(_row, col) !== 0) {
                            zeroFound = true;
                            result.swap(_row, takenPivots + 1);
                            takenPivots++;
                        }
                        _row++;
                    }
                    // Non zero entry not found, so skip this column
                    if (_row == result.numRows())
                        continue;
                } else {
                    takenPivots++;
                }
                console.log("Col " + col + " after swap", result.matrix + "");console.log(" ");
                //console.log(takenPivots,col,this.getCell(takenPivots,col));
                result.multiplyRow(takenPivots, 1 / result.getCell(takenPivots, col));console.log(" ");
                console.log("Col " + col + " after *", result.matrix + "");
                result.killBelow(takenPivots, col);
                result.killAbove(takenPivots, col);
                console.log("Col " + col + " after kill", result.matrix + "");console.log(" ");
            }

            return result;
        },
        this.multiplyRow = function(row, multiplier) {
            var col = 0;
            var mat = this;
            math.forEach(this.matrix.toArray()[row], function(val) {
                mat.update(row, col, val * multiplier);
                col++;
            });

        },
        this.swap = function(row1, row2) {
            this.matrix = this.matrix.swapRows(row1, row2);
        },
        // Kill all cells BELOW row value NOT INCLUDING row value
        this.killBelow = function(rows, cols) {
            var M = this;
            for (var rowDying = rows + 1; rowDying < M.numRows(); rowDying++) {
                var multiplier = M.getCell(rowDying, cols);
                if (multiplier == 0) continue;

                for (var col = 0; col < M.numCols(); col++) {
                    var thisVal = M.getCell(rowDying, col);
                    var pivRowVal = M.getCell(rows, col);
                    M.update(rowDying, col, thisVal - multiplier * pivRowVal);
                }
            }
        },
        this.killAbove = function(rows, cols) {
            var M = this;
            for (var rowDying = rows - 1; rowDying >= 0; rowDying--) {
                var multiplier = M.getCell(rowDying, cols);
                if (multiplier == 0) continue;
                //console.log(multiplier);

                for (var col = 0; col < M.numCols(); col++) {
                    var thisVal = M.getCell(rowDying, col);
                    var pivRowVal = M.getCell(rows, col);
                    M.update(rowDying, col, thisVal - multiplier * pivRowVal);
                }
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
