var variables = new Map();

var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
var letterIndex = -1;

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
