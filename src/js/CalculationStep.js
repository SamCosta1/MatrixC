var calculations = new Map();

function CalculationStep(operator, op1, result, op2, other) {
    this.operator = operator;
    this.op1 = op1;
    this.result = result;
    this.op2 = op2;
    this.other = other;

    this.subSteps = [];
}

CalculationStep.prototype.push = function(calcStp) {
    this.subSteps.push(calcStp);
};
CalculationStep.prototype.length = function() {
    return this.subSteps.length;
};
CalculationStep.prototype.render = function($parent) {
    var $container = $('<div>', {
        class: 'calcStepContainer'
    });

    if (this.length() > 0) {
        var $subContainer = $('<div>', {
            class: 'calcStepContainer subContainer'
        });
        // Render all substeps
        for (var step = 0; step < this.length(); step++)
            this.subSteps[step].render($subContainer);
        $container.append($subContainer);
    }

    // render this
    var $resultContainer = $('<div>', {
        class: 'calcStepContainer resultContainer'
    });
    this.renderThis($resultContainer);
    $container.append($resultContainer);
    $parent.append($container);
};
CalculationStep.prototype.renderThis = function($parent) {
    var tex = "$$";
    switch (this.operator) {
        case funcENUM.INVERSE:
            tex += "\\text{inverse} \\Bigg(" + this.op1.getTex() + "\\Bigg) = " + this.result.getTex();
        break;
        case funcENUM.DET:
            tex += "\\text{determinant} \\Bigg(" + this.op1.getTex() + "\\Bigg) = " + this.result.getTex();
        break;
        case funcENUM.ROWREDUCE:
            tex += "\\text{reduced row echelon form of }" + this.op1.getTex() + " is " + this.result.getTex();
        break;
        case '+':
        case '-':
            tex += this.op1.getTex() + this.operator + this.op2.getTex() + '=' + this.result.getTex();
        break;
        case '*':
            tex += this.op1.getTex() + '\\times' + this.op2.getTex() + '=' + this.result.getTex();
        break;

    }
    tex += '$$';
    console.log(this.operator);
    $parent.append(tex);
};
