var variables = new Map();

function Matrix(arrMatrix) {
    this.matrix = arrMatrix;
    if (arrMatrix == undefined)
        this.matrix = getZeros(3).matrix;

    this.update = function(row, col, val) {
            this.matrix[parseInt(row)][parseInt(col)] = val instanceof Fraction ? val : new Fraction(val);
        },
        this.getCell = function(row, col) {
            return this.matrix[row][col];
        },
        this.numRows = function() {
            return this.matrix.length;
        },
        this.numCols = function() {
            return this.matrix[0].length;
        },


        // Standard functions
        this.determinant = function() {
            //    return math.det(this.matrix);
        },
        this.det = function() {
            return this.determinant();
        },
        this.transpose = function() {
            //    return new Matrix(math.transpose(this.matrix));
        },
        this.inverse = function() {
            //    return new Matrix(math.inv(this.matrix));
        },
        this.add = function(other) {
            var result = [];
            for (var i = 0; i < this.numRows(); i++) {
                var sub = [];
                for (var j = 0; j < this.numCols(); j++)
                    sub.push(this.getCell(i, j).add(other.getCell(i, j)));
                result.push(sub);
            }
            return new Matrix(result);
        },
        this.subtract = function(other) {
            var result = [];
            for (var i = 0; i < this.numRows(); i++) {
                var sub = [];
                for (var j = 0; j < this.numCols(); j++)
                    sub.push(this.getCell(i, j).subtract(other.getCell(i, j)));
                result.push(sub);
            }
            return new Matrix(result);
        },
        this.times = function(other) {
            if (this.numCols() != other.numRows() || this.numRows() != other.numCols())
                throw "Dimension mismatch, can't multiply " + this.numRows() +
                    "x" + this.numCols() + " by " + other.numRows() + "x" + other.numCols();

            var result = new Matrix();
            for (var row = 0; row < this.numRows(); row++)
                for (var col = 0; col < this.numCols(); col++) {
                    var res = new Fraction();
                    for (var i = 0; i < this.numCols(); i++)
                        res = res.add(this.getCell(row, i).times(other.getCell(i, col)));
                    result.update(row, col, res);
                }
            return result;
        },
        this.divide = function(other) {
            /*    if (typeof other == 'object')
                    return this.times(other.inverse());
                else
                    return this.times(1 / other);*/
        },
        this.power = function(power) {
            if (this.numCols() != this.numRows())
                throw "You can only calculate powers of square matricies!";
            var result;
            if (power < 0) {
                result = this.inverse();
                power = Math.abs(power);
            } else {
                if (power == 0)
                    return this.getIdentity();
                result = this;
            }
            result = this.times(result);
            for (i = 1; i < power-1; i++)
                result = this.times(result);
            return result;
        },
        this.conjugate = function(power) {
            return power.inverse().times(this).times(power);
        },
        this.performFunction = function(func, args) {
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
                case funcENUM.ROWREDUCE:
                    return this.reduceToReducedEchF();
                case funcENUM.SOLVAUG:
                    return this.reduceToReducedEchF(-1);
                case funcENUM.ID:
                    return this.getIdentity(args[0], args[1]);
                case funcENUM.ZEROS:
                    return this.getZeros(args[0], args[1]);
            }
            throw "Something weird just happened!";
        },
        this.reduceToReducedEchF = function(numCols) {
            if (numCols == undefined || numCols > this.numCols)
                numCols = this.numCols();
            else if (numCols == -1) // Allow func to be called with -1 for solving aug
                numCols--;
            var numRows = this.numRows();


            var result = new Matrix(this.matrix);
            var takenPivots = -1;
            for (var col = 0; col < numCols && takenPivots < numRows - 1; col++) {
                // Get a nonzero entry in this cell (or try to)
                if (result.getCell(takenPivots + 1, col) === 0) {
                    var nonzeroFound = false;
                    var _row = takenPivots + 1;
                    while (!nonzeroFound && _row < result.numRows()) {
                        if (result.getCell(_row, col) !== 0) {
                            nonzeroFound = true;
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
                result.multiplyRow(takenPivots, 1 / result.getCell(takenPivots, col));
                result.killBelow(takenPivots, col);
                result.killAbove(takenPivots, col);
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
                    var newVal = thisVal - multiplier * pivRowVal;

                    if (Math.abs(newVal) < 1e-10)
                        newVal = 0;

                    M.update(rowDying, col, newVal);
                }
            }
        },
        this.killAbove = function(rows, cols) {
            var M = this;
            for (var rowDying = rows - 1; rowDying >= 0; rowDying--) {
                var multiplier = M.getCell(rowDying, cols);
                if (multiplier == 0) continue;

                for (var col = 0; col < M.numCols(); col++) {
                    var thisVal = M.getCell(rowDying, col);
                    var pivRowVal = M.getCell(rows, col);
                    var newVal = thisVal - multiplier * pivRowVal;
                    if (Math.abs(newVal) < 1e-10)
                        newVal = 0;

                    M.update(rowDying, col, newVal);
                }
            }
        },
        this.resize = function(rows, cols) {
            rows = parseInt(rows);
            cols = parseInt(cols);
            if (rows < this.numRows())
                this.matrix = this.matrix.slice(0, rows);
            else if (rows != this.numRows()) {
                var newRow = []
                for (var i = 0; i < cols; i++)
                    newRow.push(new Fraction());
                this.matrix.push(newRow);
            }
            if (cols < this.numCols()) {
                for (var row = 0; row < rows; row++)
                    this.matrix[row] = this.matrix[row].slice(0, cols);
            } else if (cols != this.numCols())
                for (var i = 0; i < rows; i++)
                    this.matrix[i].push(new Fraction());
        },
        this.getIdentity = function(rows, cols) {
            console.log(rows, cols);
            if (rows == undefined && cols != undefined)
                rows = cols;
            if (rows != undefined && cols == undefined)
                cols = rows;
            // If called with no arguments - use this matrix's dimensions
            if (rows == undefined)
                rows = this.numRows();
            if (cols == undefined)
                cols = this.numCols();
            console.log("Coords", rows, cols);

            var result = [];
            for (var row = 0; row < rows; row++) {
                var sub = [];
                for (var col = 0; col < cols; col++)
                    if (row == col)
                        sub.push(new Fraction(1));
                    else
                        sub.push(new Fraction());
                result.push(sub);
            }

            return new Matrix(result);
        }
}

function getZeros(rows, cols) {
    if (rows == undefined && cols != undefined)
        rows = cols;
    if (rows != undefined && cols == undefined)
        cols = rows;

    var result = [];
    for (var i = 0; i < rows; i++) {
        var sub = [];
        for (var j = 0; j < cols; j++)
            sub.push(new Fraction(0, 1));
        result.push(sub);
    }

    return new Matrix(result);
}
var funcENUM = {
    NONE: '#',
    TRANSPOSE: '#T',
    INVERSE: '#I',
    RANK: '#R',
    DET: '#D',
    EIGEN: '#E',
    DIAGONALIZE: '#DI',
    ROWREDUCE: '#RRD',
    SOLVAUG: '#SA',
    ID: '#ID',
    ZEROS: '#ZE',
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
            case this.ROWREDUCE:
            case this.SOLVAUG:
                return "Reduced Echelon Form";
            case this.ID:
                return "identity matrix";
            case this.ZEROS:
                return "0 matrix";
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
        case 'rowreduce':
            return funcENUM.ROWREDUCE;
        case 'solveaugmented':
        case 'solveaugmentedmatrix':
            return funcENUM.SOLVAUG;
        case 'id':
        case 'identity':
            return funcENUM.ID;
        case 'zeros':
            return funcENUM.ZEROS;
    }
    return funcENUM.NONE;
}
