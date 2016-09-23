function CalculationStep(_data) {
    this.data = _data;
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
    switch (this.data.type) {
        case funcENUM.INVERSE:
            tex += '\\text{inverse} \\Bigg(' + this.data.op1.getTex() + '\\Bigg) = ' + this.data.result.getTex();
            break;
        case funcENUM.DET:
            tex += '\\text{determinant} \\Bigg(' + this.data.op1.getTex() + '\\Bigg) = ' + this.data.result.getTex();
            break;
        case funcENUM.ROWREDUCE:
            tex += '\\text{reduced row echelon form of }' + this.data.op1.getTex() + ' is ' + this.data.result.getTex();
            break;
        case funcENUM.TRANSPOSE:
            tex += '\\text{transpose} \\Bigg(' + this.data.op1.getTex() + '\\Bigg) = ' + this.data.result.getTex();
            break;
        case funcENUM.RANK:
            tex += '\\text{rank} \\Bigg(' + this.data.op1.getTex() + '\\Bigg) = ' + this.data.result.getTex();
            break;
        case '+':
        case '-':
            tex += this.data.op1.getTex() + this.data.type + this.data.op2.getTex() + '=' + this.data.result.getTex();
            break;
        case '*':
            tex += this.data.op1.getTex() + '\\times' + this.data.op2.getTex() + '=' + this.data.result.getTex();
            break;
        case 'comment':
            tex += '\\text{' + this.data.comment + '}';
            break;
        case '/':
            tex += '\\frac{' + this.data.op1.getTex() + '}{' + this.data.op2.getTex() + '}' + '=' + this.data.result.getTex();
            break;
        case '^':
            tex += '(' + this.data.op1.getTex() + ')^{' + this.data.op2.getTex() + '} = ' + this.data.result.getTex();
            break;
        case 'splitAug':
            tex += '\\text{Take the right hand side as the inverse: }' + this.data.op1.getTex();
            break;
        case 'swap':
            tex += '\\text{Swap } R_'+ (this.data.op1+1) +'\\text{ and }R_ ' + (this.data.op2+1) + ' => ' + this.data.result.getTex();
            break;
        case 'augment':
            tex += '\\text{augment } ' + this.data.op1.getTex() + ' \\text{with} ' + this.data.op2.getTex() + ' \\text{' + this.data.message + '}' + ' \\\\ =>' + this.data.result.getTex();
            break;
        case 'multiplyRow':
            tex += '\\text{Multiply } R_' + (this.data.rowNum+1) + '\\text{ by }' + this.data.op2.getTex() + '\\\\' + this.data.op1.getRowTex(this.data.rowNum) + '\\times' + this.data.op2.getTex() + '\\rightarrow' + this.data.result.getTex();
            break;
        case 'subtractRows':
            var multOp = (this.data.multiplier.isPositive() ? '-' : '+'),
                mult = this.data.multiplier.isOne() ? '' : '\\times' + this.data.multiplier.abs();
            tex += 'R_' + (this.data.row2Num+1) + '\\leftarrow R_' + (this.data.row2Num+1) + multOp + 'R_' + (this.data.row1Num+1) + mult +
                        '\\\\' + this.data.op1.getTex() + multOp + this.data.op2.getTex() + mult + '=' +
                         this.data.result.getTex();
            break;

    }
    tex += '$$';
    $parent.append(tex);
};
