function AllCalculations (_name, _matrix) {
    var matrix = _matrix,
        name = _name,
        functions = [funcENUM.TRANSPOSE, funcENUM.INVERSE, funcENUM.DET, funcENUM.ROWREDUCE],
        label = '<div class="allCalcLabel">';

    function generateAll() {
        var str = '$$';
        // First the actual matrix
        str += '\\text{' + name + '}=' + matrix.getTex() + '$$';

        for (var func in functions) {
            str += label + funcENUM.getString(functions[func]) + '</div>';
            try {
                str += '$$' + matrix.performFunction(functions[func],null,new CalculationStep()).getTex() + '$$';
            } catch (e) {
                str += '-';
            }
        }

        return str;

    }

    return {
        getTex: generateAll,
    };
}
