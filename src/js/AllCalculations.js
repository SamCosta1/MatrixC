function AllCalculations (_name, _matrix) {
    var matrix = _matrix,
        name = _name,
        functions = [funcENUM.TRANSPOSE, funcENUM.INVERSE, funcENUM.DET, funcENUM.ROWREDUCE, funcENUM.RANK],
        label = '<div class="allCalcLabel">';

    function generateAll() {
        var str = '$$',
            calcSteps = new CalculationArray();
        // First the actual matrix
        str += '\\text{' + name + '}=' + matrix.getTex() + '$$';

        for (var func in functions) {
            str += label + funcENUM.getString(functions[func]) + '</div>';
            try {
                var step = new CalculationStep({
                    type: functions[func],
                    op1:  matrix,
                });

                step.data.result = matrix.performFunction(functions[func],null,step);
                str += '$$' + step.data.result.getTex() + '$$';

                calcSteps.push(step);
            } catch (e) {
                str += '-';
            }
        }

        calcSteps.render($('.sidebarBody'));
        return str;

    }

    return {
        getTex: generateAll,
    };
}
