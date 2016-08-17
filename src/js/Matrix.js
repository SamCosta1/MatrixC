// Usually an array would be supplied to be wrapped, sometimes rows,cols will be surprised to allow
// creation of an empty matrix of any size;
function Matrix(arrMatrix, cols) {
    this.matrix = arrMatrix;
    if (arrMatrix && arrMatrix[0] instanceof Fraction) {
        this.matrix = [this.matrix];
    }
    this.multiplier = new Fraction('1');
    if (arrMatrix === undefined)
        this.matrix = this.getZeros(3).matrix;
    else if (!isNaN(arrMatrix))
        this.matrix = this.getZeros(arrMatrix, cols).matrix;
}

Matrix.prototype.update = function(row, col, val) {
    this.matrix[parseInt(row)][parseInt(col)] = val instanceof Fraction ?
        val : new Fraction(val);
};
Matrix.prototype.getCell = function(row, col) {
    return this.matrix[row][col];
};
Matrix.prototype.numRows = function() {
    return this.matrix.length;
};
Matrix.prototype.numCols = function() {
    return this.matrix[0].length;
};
Matrix.prototype.clone = function() {
    var result = [];
    for (var i = 0; i < this.numRows(); i++) {
        var sub = [];
        for (var j = 0; j < this.numCols(); j++)
            sub.push(this.getCell(i, j).clone());
        result.push(sub);
    }
    return new Matrix(result);
};
// Standard functions
Matrix.prototype.determinant = function() {
    if (this.numRows() == 2)
        return this.getCell(0, 0).times(this.getCell(1, 1))
            .subtract(this.getCell(1, 0).times(this.getCell(0, 1)));
    var reduced = this.reduceToReducedEchF();
    var multiplier = reduced.multiplier;

    var lastRow = reduced.numRows() - 1;
    var sum = new Fraction();
    var mult = 1;
    for (var col = 0; col < reduced.numCols(); col++, mult *= -1) {
        if (!reduced.matrix[lastRow][col].isZero())
            sum = sum.add(reduced.subMatrix(lastRow, col).det().times(mult).times(reduced.matrix[lastRow][col]));
    }
    return sum.times(multiplier);
};
Matrix.prototype.subMatrix = function(row, col) {
    var result = [];
    for (var r = 0; r < this.numRows(); r++) {
        if (r != row) {
            var sub = [];
            for (var c = 0; c < this.numCols(); c++)
                if (c != col)
                    sub.push(this.getCell(r, c).clone());
            result.push(sub);
        }
    }
    return new Matrix(result);
};
Matrix.prototype.det = function() {
    return this.determinant();
};
Matrix.prototype.transpose = function() {
    var result = [];
    for (var col = 0; col < this.numCols(); col++) {
        var sub = [];
        for (var row = 0; row < this.numRows(); row++)
            sub.push(this.getCell(row, col));
        result.push(sub);
    }
    return new Matrix(result);
};
Matrix.prototype.concat = function(other) {
    var result = this.clone().matrix;
    for (var r = 0; r < result.length; r++)
        result[r] = result[r].concat(other.matrix[r]);
    return new Matrix(result);
};
Matrix.prototype.inverse = function() {
    var id = this.getIdentity(this.numCols());
    var aug = this.concat(id);
    var augCopy = aug.clone();
    this.step.push(new CalculationStep('augment', this, augCopy, id, "(the identity matrix)"));
    aug = aug.reduceToReducedEchF(this.numCols(), this.step);
    this.step.push(new CalculationStep(funcENUM.ROWREDUCE, augCopy, aug.clone()));
    for (var r = 0; r < this.numRows(); r++) {
        // Check first part of augmented is identity (otherwise noninvertible)
        for (var c = 0; c < this.numCols(); c++) {
            if (c == r) {
                if (!aug.getCell(r, c).isOne())
                    throw ("Matrix non invertible");
            } else if (!aug.getCell(r, c).isZero())
                throw ("Matrix non invertible");
        }

        aug.matrix[r] = aug.matrix[r].slice(this.numCols(), this.numCols() * 2);
    }
    this.step.push(new CalculationStep('splitAug', aug));
    return aug;

};
Matrix.prototype.add = function(other) {
    var result = [];
    for (var i = 0; i < this.numRows(); i++) {
        var sub = [];
        for (var j = 0; j < this.numCols(); j++)
            sub.push(this.getCell(i, j).add(other.getCell(i, j)));
        result.push(sub);
    }
    return new Matrix(result);
};
Matrix.prototype.subtract = function(other) {
    var result = [];
    for (var i = 0; i < this.numRows(); i++) {
        var sub = [];
        for (var j = 0; j < this.numCols(); j++)
            sub.push(this.getCell(i, j).subtract(other.getCell(i, j)));
        result.push(sub);
    }
    return new Matrix(result);
};
Matrix.prototype.times = function(other) {
    if (!(other instanceof Matrix))
        return this.timesScalar(other);
    if (this.numCols() != other.numRows() || this.numRows() != other.numCols())
        throw "Dimension mismatch, can't multiply " + this.numRows() +
            "x" + this.numCols() + " by " + other.numRows() + "x" + other.numCols();

    var result = new Matrix(this.numRows(), other.numCols());
    for (var row = 0; row < this.numRows(); row++)
        for (var col = 0; col < this.numCols(); col++) {
            var res = new Fraction();
            for (var i = 0; i < this.numCols(); i++)
                res = res.add(this.getCell(row, i).times(other.getCell(i, col)));
            result.update(row, col, res);
        }
    return result;
};
Matrix.prototype.timesScalar = function(val) {
    var result = new Matrix(this.numRows(), this.numCols());
    for (var row = 0; row < this.numRows(); row++)
        for (var col = 0; col < this.numCols(); col++) {
            result.update(row, col, this.getCell(row, col).times(val));
        }
    return result;
};
Matrix.prototype.divide = function(other, stp) {
    this.step = stp;
    other.step = stp;
    if (other instanceof Matrix)
        return this.times(other.inverse());
    else {
        if (other instanceof Fraction)
            return this.times(other.reciprocal());
        else
            return this.times(new Fraction(1, other));
    }
};
Matrix.prototype.power = function(power) {
    if (this.numCols() != this.numRows())
        throw "You can only calculate powers of square matricies!";
    var result;
    if (power < 0) {
        result = this.inverse();
        power = Math.abs(power);
    } else if (power === 0)
        return this.getIdentity();
    else {
        result = this;
    }
    var base = result.clone();

    for (i = 1; i < power; i++) {
        var stp = new CalculationStep('*', result.clone(), null, base);
        result = base.times(result);
        stp.result = result.clone();
        this.step.push(stp);
    }
    return result;
};
Matrix.prototype.conjugate = function(power) {
    return power.inverse().times(this).times(power);
};
Matrix.prototype.performFunction = function(func, args, step) {
    this.step = step;
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
};
Matrix.prototype.reduceToReducedEchF = function(numCols, step) {
    if (numCols === undefined || numCols > this.numCols())
        numCols = this.numCols();
    if (step === undefined)
        step = this.step;
    else if (numCols == -1) // Allow func to be called with -1 for solving aug
        numCols--;
    var numRows = this.numRows();

    var result = this.clone();

    var currentPivPos = 0;
    for (var col = 0; col < numCols && currentPivPos < numRows; col++) {
        if (result.getCell(currentPivPos, col).isZero()) {
            var indexToSwap = result.getNonZeroRows(currentPivPos, col);
            if (indexToSwap != -1) {
                result.swap(indexToSwap, currentPivPos);
                step.push(new CalculationStep('swap', indexToSwap, result.clone(), currentPivPos));
            } else
                continue;
        }
        var mult = result.getCell(currentPivPos, col).reciprocal();
        if (!mult.isOne()) {
            result.multiplier = result.multiplier.divide(mult);
            var calcStep = new CalculationStep('multiplyRow', result.clone(), null, mult, currentPivPos);
            result.matrix[currentPivPos] = result.multiplyRow(currentPivPos, mult);
            calcStep.result = result.clone();
            step.push(calcStep);
        }

        result.kill(currentPivPos, col, step);
        currentPivPos++;
    }
    return result;
};
// MUTATES THE OBJECT
Matrix.prototype.kill = function(row, col, step) {
    for (var r = 0; r < this.numRows(); r++) {
        if (r == row)
            continue;
        var mult = this.getCell(r, col);
        if (!mult.isZero()) {
            var subStep = new CalculationStep('subtractRows', new Matrix(this.matrix[r]).clone(), null, new Matrix(this.matrix[row]).clone(), mult, row, r);
            this.matrix[r] = this.subtractRows(this.matrix[r],
                this.multiplyRow(row, mult), step);
            subStep.result = new Matrix(this.matrix[r]).clone();
            step.push(subStep);
        }
    }
};
Matrix.prototype.getNonZeroRows = function(row, col) {
    row++;
    while (row < this.numRows() && this.getCell(row, col).isZero())
        row++;
    if (row == this.numRows())
        return -1;
    else
        return row;
};
Matrix.prototype.subtractRows = function(row1, row2) {
    if (row1.length != row2.length)
        throw "Something weird happened!";
    var res = [];
    for (var i = 0; i < row1.length; i++)
        res.push(row1[i].subtract(row2[i]));
    return res;
};
Matrix.prototype.multiplyRow = function(row, mult) {
    var res = [];
    for (var col = 0; col < this.numCols(); col++)
        res.push(this.getCell(row, col).clone().times(mult));
    return res;
};
// MUTATES THIS OBJECT
Matrix.prototype.swap = function(row1, row2) {
    var tmp = this.matrix[row1];
    this.matrix[row1] = this.matrix[row2];
    this.matrix[row2] = tmp;
    this.multiplier = this.multiplier.times(-1);
};
Matrix.prototype.resize = function(rows, cols) {
    rows = parseInt(rows);
    cols = parseInt(cols);
    if (rows < this.numRows())
        this.matrix = this.matrix.slice(0, rows);
    else if (rows != this.numRows()) {
        var newRow = [];
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
};
Matrix.prototype.getIdentity = function(rows, cols) {
    if (rows == undefined && cols != undefined)
        rows = cols;
    if (rows != undefined && cols == undefined)
        cols = rows;
    // If called with no arguments - use this matrix's dimensions
    if (rows == undefined)
        rows = this.numRows();
    if (cols == undefined)
        cols = this.numCols();

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
};
Matrix.prototype.getZeros = function(rows, cols) {
    if (rows == undefined && cols != undefined)
        rows = cols;
    if (rows != undefined && cols == undefined)
        cols = rows;

    var result = [];
    for (var i = 0; i < rows; i++) {
        var sub = [];
        for (var j = 0; j < cols; j++)
            sub.push(new Fraction());
        result.push(sub);
    }

    return new Matrix(result);
};
Matrix.prototype.getTex = function() {
    var str = "\\begin{bmatrix}";
    for (var row = 0; row < this.numRows(); row++) {
        for (var col = 0; col < this.numCols(); col++)
            str += this.getCell(row, col).getTex() + ((col + 1 < this.numCols()) ? "&" : '');
        str += "\\\\";
    }
    str += "\\end{bmatrix}";
    return str;
};
Matrix.prototype.getRowTex = function(row) {
    var str = '\\begin{bmatrix}';
    for (var col = 0; col < this.numCols(); col++)
        str += this.getCell(row, col).getTex() + ((col + 1 < this.numCols()) ? "&" : '');
    return str + '\\end{bmatrix}';
};

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
