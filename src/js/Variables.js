function Variables() {
    var variables = new Map(),
        alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        letterIndex = -1;

    function get(k) {
        return variables.get(k);
    }

    function set(key, val) {
        if (key === undefined)
            return;
        variables.set(key, val);
        $('body').trigger('matrixChange');
        updateStore(key);
    }

    function updateStore(key) {
        localStorage.setItem('MATRIX-' + key, JSON.stringify(get(key).matrix));
    }

    function removeFromStore(key) {
        localStorage.removeItem('MATRIX-' + key);
    }

    function extractAllFromStore() {
        for (var key in localStorage) {
            var res;
            if ((res = /MATRIX-(.+)/.exec(key))) {
                if (localStorage.getItem(key) === 'undefined') {
                    continue;
                }
                var rawData = JSON.parse(localStorage.getItem(key));
                for (var i = 0; i < rawData.length; i++)
                    for (var j = 0; j < rawData[i].length; j++)
                        rawData[i][j] = new Fraction(rawData[i][j].top, rawData[i][j].bottom);

                set(res[1], new Matrix(rawData));
            }
        }
    }

    function deleteVar(key) {
        variables.delete(key);
        $('body').trigger('matrixChange');
        removeFromStore(key);
    }

    function iterate(callback) {
        variables.forEach(callback);
    }

    function isValid(inputted, allowDuplicate) {
        return /^[a-z][a-z0-9]*$/i.test(inputted) && (allowDuplicate ? true :
                variables.get(inputted) === undefined) &&
            getEnum(inputted) === funcENUM.NONE;
    }

    function getNextFreeLetter() {
        letterIndex = (letterIndex + 1) % alphabet.length;

        if (isValid(alphabet[letterIndex])) {
            localStorage.setItem('letterIndex', letterIndex);
            return alphabet[letterIndex];
        }

        var withRndm = alphabet[letterIndex] + parseInt(Math.random() * 100);
        if (isValid(withRndm)) {
            localStorage.setItem('letterIndex', letterIndex);
            return withRndm;
        }
        else
            getNextFreeLetter();
    }

    function onCellChange(data) {
        if (localStorage.hasOwnProperty('MATRIX-' + data.key))
            updateStore(data.key);
    }

    function init() {
        extractAllFromStore();
        $('body').on('matrixCellChange', onCellChange);
        if (localStorage.hasOwnProperty('letterIndex')) {
            letterIndex = parseInt(localStorage.getItem('letterIndex'));
        }

    }

    function resetLetters() {
        letterIndex = -1;
        localStorage.setItem('letterIndex', letterIndex);
    }

    return {
        get: get,
        set: set,
        getNextFreeLetter: getNextFreeLetter,
        isValid: isValid,
        delete: deleteVar,
        iterate: iterate,
        init: init,
        reset: resetLetters
    };
}
