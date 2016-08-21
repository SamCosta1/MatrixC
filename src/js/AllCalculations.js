function AllCalculations (_name, _matrix) {
    var matrix = _matrix,
        name = _name;

    function generateAll() {
        var str = '$$';
        // First the actual matrix
        str += name + '=' + matrix.getTex();

        return str + '$$';

    }

    return {
        getTex: generateAll,
    };
}
