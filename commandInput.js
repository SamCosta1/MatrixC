var m = new Matrix([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]);

// Take input from commandLine
var base = 'MatCalculator >> ';
var regex = new RegExp('^' + base, 'i');
var comHist = [];

$('#cmdinput')
    .on('input', function(ev) {
        var query = $(this).val();
        if (!regex.test(query)) {
            //ev.preventDefault();
            $(this).val(base);
        }
    })
    .keyup(function(e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13) {
            // Enter key pressed
            var input = $(this).val().slice(base.length);
            commandInput(input);
            comHist.push(input.replace(/\n/g, ''));
        } else if (code == 38 && comHist.length > 0) {
            $(this).val(base + comHist[comHist.length - 1]);
            comHist.pop();
        }
    });
newInputComp('A', m);

function commandInput(cmd) {
    try {
        $('#errDisplay').hide();
        performCalc(cmd);
        $('#cmdinput').val(base);
    } catch (err) {
        errorHandle(err);
    }
}

function errorHandle(err) {
    console.log(err);
    $('#errDisplay').text(err)
        .show();
}

function performCalc(cmd) {
    cmd = cmd.replace(/ /g, '').replace(/\n/g, '');

    var lbl = '';
    if (cmd.includes('=')) {
        lbl = cmd.split('=')[0];
        if (isValid(lbl, true))
            cmd = cmd.split('=')[1];
        else
            throw "Invalid Variable Name :(";

    } else
        lbl = getNextFreeLetter();
    cmd = '(' + cmd + ')';

    var theArray = getArrayFromString(cmd);

    for (var i = 0; i < theArray.length; i++) {
        if (!isCloseBracket(theArray[i]))
            continue;

        var j = i;
        while (!isOpenBracket(theArray[j])) {
            if (isOperator(theArray[j])) {
                var res = calculate(theArray[j - 1], theArray[j + 1], theArray[j]);
                theArray.splice(j, 2);
                theArray[j - 1] = res;
            }
            j--;
        }
        if (funcENUM.isFunction(theArray[j - 1])) {
            var r = performFunction(theArray[j - 1], theArray[j + 1]);
            theArray.splice(j, 3);
            theArray[j - 1] = r;
        } else {
            theArray.splice(j, 1); // get rid of (
            theArray.splice(j + 1, 1); // get rid of )
        }
        if (j !== 0)
            i = j - 1;
        else
            break;
    }

    if (!variables.get(lbl))
        newInputComp(lbl, theArray[0]);
    else {
        if (typeof variables.get(lbl) == typeof theArray[0])
            updateGUI(lbl, theArray[0]);
        else {
            if (typeof theArray[0] === 'object')
                throw "You can't assign a matrix to a number";
            else
                throw "You can't assign a number to a matrix";

        }
    }
}

function getArrayFromString(cmd) {
    var openBktCnt = 1;
    var closeBktCnt = 0;

    var theArray = [];
    theArray.add = function(arg) {
        if (isOpenBracket(arg))
            openBktCnt++;
        else if (isCloseBracket(arg))
            closeBktCnt++;
        this.push(arg);
    };

    theArray.push('(');

    console.log(cmd);
    var highPrecendeces = [];
    for (var i = 1; i < cmd.length; i++) {
        if (isOperatorOrBracket(cmd[i]) &&
            !isOperatorOrBracket(cmd[i - 1])) {

            var j = i - 1;
            var identifier = '';
            while (!isOperatorOrBracket(cmd[j])) {
                identifier = cmd[j] + identifier;
                j--;
            }

            var result;
            if (!isNaN(identifier))
                result = parseInt(identifier);
            else
            if ((result = getEnum(identifier)) == funcENUM.NONE) {
                if (typeof(result = variables.get(identifier)) === 'undefined')
                    throw 'Sorry, I don\'t know what \'' + identifier + '\' is :(';
            }

            theArray.push(result);

        }
        if (isOperatorOrBracket(cmd[i]))
            theArray.add(cmd[i]);
    }

    // TODO Precedences

    if (openBktCnt > closeBktCnt)
        throw "Unexpected character (";
    else if (closeBktCnt > openBktCnt)
        throw "Unexpected character )";
    console.log('#1', theArray);
    return theArray;
}

function performFunction(func, arg) {
    if (typeof arg === 'number')
       throw "Can't calculate " + funcENUM.getString(func) + " of " + arg;
    return arg.performFunction(func);
}

function calculate(before, after, op) {
    var result;
    switch (op) {
        case '+':
            if (typeof before !== typeof after)
                throw "You can't add a matrix and number sorry!";
            if (typeof before == 'object')
                result = before.add(after);
            else
                result = before + after;
            break;
        case '-':
            if (typeof before !== typeof after)
                throw "You can't subtract a matrix and number sorry!";
            if (typeof before == 'object')
                result = before.subtract(after);
            else
                result = before - after;
            break;
        case '/':
            if (typeof before == 'object')
                result = before.divide(after);
            else if (typeof after == 'object')
                result = after.divide(before);
            else
                result = before / after;
            break;
        case '*':
            if (typeof before == 'object')
                result = before.times(after);
            else if (typeof after == 'object')
                result = after.times(before);
            else
                result = before * after;
            break;
        case '^':
            if (typeof before == 'object')
                result = before.power(after);
            else
                result = Math.pow(before, after);
            break;
    }
    return result;
}

function getOperand(oprnd) {
    if (!isNaN(oprnd)) return parseInt(oprnd);
    else if (typeof oprnd == 'object') return oprnd;
    else return variables.get(oprnd);
}

function parseNames(cmd) {
    var list = 'transpose inverse rank det diagonalize'.split(' ');
    for (i = 0; i < list.length; i++)
        cmd = cmd.replace(new RegExp(list[i], 'g'), '{#' + list[i] + '}');
    return cmd;
}

function isOperator(str) {
    return '+^-*/'.split('').indexOf(str) >= 0;
}

function isCloseBracket(str) {
    return str == ')';
}

function isOpenBracket(str) {
    return str == '(';
}

function isBrackets(str) {
    return isCloseBracket(str) || isOpenBracket(str);
}

function isOperatorOrBracket(str) {
    return isOperator(str) || isBrackets(str);
}

function isSquiggle(str) {
    return str == '}' || str == '{';
}
