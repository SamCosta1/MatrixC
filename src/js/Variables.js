function Variables() {
    var variables = new Map(),
        alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
        letterIndex = -1;

    function get(v) {
        return variables.get(v);
    }

    function set(key, val) {
        variables.set(key, val);
        $('body').trigger('matrixChange');
    }

    function deleteVar(key) {
        variables.delete(key);
        $('body').trigger('matrixChange');        
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
        letterIndex++;
        if (letterIndex >= alphabet.length)
            letterIndex = 0;
        if (isValid(alphabet[letterIndex]))
            return alphabet[letterIndex];

        var withRndm = alphabet[letterIndex] + parseInt(Math.random() * 100);
        if (isValid(withRndm))
            return withRndm;
        else
            getNextFreeLetter();
    }

    return {
        get: get,
        set: set,
        getNextFreeLetter: getNextFreeLetter,
        isValid: isValid,
        delete: deleteVar,
        iterate: iterate
    };
}
