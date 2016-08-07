function CalculationArray() {
    this.array = [];
}
CalculationArray.prototype.push = function(obj) {
    this.array.push(obj);
};
CalculationArray.prototype.render = function($parent) {
    var $thisCalc = $('<div>', {
        class: 'calculation'
    });
    for (var step = 0; step < this.array.length; step++)
        this.array[step].render($thisCalc);    
    $parent.prepend($thisCalc);
}
