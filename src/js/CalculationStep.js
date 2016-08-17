var calculations = new Map();

function CalculationStep(operator, op1, result, op2, other, other1, other2) {
    this.operator = operator;
    this.op1 = op1;
    this.result = result;
    this.op2 = op2;
    this.other = other;
    this.other1 = other1;
    this.other2 = other2;

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
    var tex = '$$';
    switch (this.operator) {
        case funcENUM.INVERSE:
            tex += '\\text{inverse} \\Bigg(' + this.op1.getTex() + '\\Bigg) = ' + this.result.getTex();
            break;
        case funcENUM.DET:
            tex += '\\text{determinant} \\Bigg(' + this.op1.getTex() + '\\Bigg) = ' + this.result.getTex();
            break;
        case funcENUM.ROWREDUCE:
            tex += '\\text{reduced row echelon form of }' + this.op1.getTex() + ' is ' + this.result.getTex();
            break;
        case '+':
        case '-':
            tex += this.op1.getTex() + this.operator + this.op2.getTex() + '=' + this.result.getTex();
            break;
        case '*':
            tex += this.op1.getTex() + '\\times' + this.op2.getTex() + '=' + this.result.getTex();
            break;
        case '/':
            tex += '\\frac{' + this.op1.getTex() + '}{' + this.op2.getTex() + '}' + '=' + this.result.getTex();
            break;
        case '^':
            tex += '(' + this.op1.getTex() + ')^{' + this.op2.getTex() + '} = ' + this.result.getTex();
            break;
        case 'splitAug':
            tex += '\\text{Take the right hand side as the inverse: }' + this.op1.getTex();
            break;
        case 'swap':
            tex += '\\text{Swap } R_'+ (this.op1+1) +'\\text{ and }R_ ' + (this.op2+1) + ' => ' + this.result.getTex();
            break;
        case 'augment':
            tex += '\\text{augment } ' + this.op1.getTex() + ' \\text{with} ' + this.op2.getTex() + ' \\text{' + this.other + '}' + ' \\\\ =>' + this.result.getTex();
            break;
        case 'multiplyRow':
            tex += '\\text{Multiply } R_' + (this.other+1) + '\\text{ by }' + this.op2.getTex() + '\\\\' + this.op1.getRowTex(this.other) + '\\times' + this.op2.getTex() + '\\rightarrow' + this.result.getTex();
            break;
        case 'subtractRows':
        console.log(this);
            var multOp = (this.other.isPositive() ? '-' : '+'),
                mult = this.other.isOne() ? '' : '\\times' + this.other.abs();
            tex += 'R_' + (this.other2+1) + '\\leftarrow R_' + (this.other2+1) + multOp + 'R_' + (this.other1+1) + mult +
                        '\\\\' + this.op1.getTex() + multOp + this.op2.getTex() + mult + '=' +
                         this.result.getTex();
            break;

    }
    tex += '$$';
    console.log(this.operator);
    $parent.append(tex);
};
