function CalculationArray() {
    this.steps = [];
}
CalculationArray.prototype.push = function(obj) {
    this.steps.push(obj);
};
CalculationArray.prototype.render = function($parent) {
    if (this.steps.length === 0) {
        return;
    }
    var $thisCalc = $('<div class="calculation">');

    for (var step = 0; step < this.steps.length; step++)
        this.steps[step].render($thisCalc);
    $parent.prepend($thisCalc);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
};
