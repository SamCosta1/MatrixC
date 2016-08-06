var calculations = new Map();

function CalculationStep (operator, op1, result, op2, other){
  this.operator = operator;
  this.op1 = op1;
  this.result = result;
  this.op2 = op2;
  this.other = other;

  this.subSteps = [];
}

CalculationStep.prototype.push = function(calcStp) {
    this.subSteps.push(calcStp);
},
CalculationStep.prototype.length = function() {
    return this.subSteps.length;
},
CalculationStep.prototype.render = function($container) {

}
