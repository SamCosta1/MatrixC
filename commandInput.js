var m = new Matrix([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1]
]);

// Take input from commandLine
var base = 'MatCalculator >> ';
var regex = new RegExp('^' + base, 'i');
var comHist = [];
comHist.add = function(toAdd) {
    if (this.indexOf(toAdd) < 0)
        this.push(toAdd);
}
var histPos = 0;

$('#cmdinput')
    .on('input', function(ev) {
        var query = $(this).val();
        if (!regex.test(query)) {
            //ev.preventDefault();
            $(this).val(base);
        }
    })
    .keyup(function(e) {
        e.stopImmediatePropagation();
        var code = e.keyCode ? e.keyCode : e.which;
        if (code == 13) {
            // Enter key pressed
            var input = $(this).val().slice(base.length);
            comHist.add(input.replace(/\n/g, ''));
            histPos++;
            commandInput(input);
        } else if (code == 38 && comHist.length > 0) {
            if (histPos > 0) histPos--;
            $(this).val(base + comHist[histPos]);
        } else if (code == 40 && comHist.length > 0) {
            if (histPos < comHist.length - 1) histPos++;
            $(this).val(base + comHist[histPos]);
        }
        else {
            histPos = comHist.length;
        }
    });

function commandInput(cmd) {
    //try {
    console.time('performCalc');
        $('#errDisplay').hide();
        performCalc(cmd);
        $('#cmdinput').val(base);
        console.timeEnd('performCalc');
    //} catch (err) {
    //    errorHandle(err);
//        $('#cmdinput').val($('#cmdinput').val().replace(/\n/g, ''));
    //}
}

function errorHandle(err) {
    console.log(err);
    $('#errDisplay').text(err)
        .show();
}

function performCalc(cmd) {
    cmd = cmd.replace(/ /g, '').replace(/\n/g, '');

    // Split lines by semi colon and run each command seperatly
    if (cmd.includes(';'))
    {
        var commands = cmd.split(';');
        for (var c in commands)
            performCalc(commands[c]);
        return;
    }


    var org = cmd;
    var lbl = '';
    var containsEqs = false;
    if (cmd.includes('=')) {
        containsEqs = true;
        lbl = cmd.split('=')[0];
        if (isValid(lbl, true))
            cmd = cmd.split('=')[1];
        else
            throw "Invalid Variable Name :(";

    } else
        lbl = getNextFreeLetter();
    cmd = '(' + cmd + ')';

    var theArray = getArrayFromString(cmd);
    console.log("#MAT-" + org);
    if (!containsEqs && theArray.length == 3 && typeof theArray[1] == 'object'){
        $("#MAT-" + org).trigger("click");
        $("#MAT-" + org).get(0).scrollIntoView();
        return;
    }

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
            var args = [],
                cnt = 0;

            while (!isCloseBracket(theArray[cnt + (j + 1)])) {
                if (theArray[cnt + (j + 1)] != ',')
                    args.push(theArray[cnt+ (j + 1)]);
                cnt++;
            }

            var r = performFunction(theArray[j - 1], args);
            theArray.splice(j, cnt+2);
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
            if (!isNaN(identifier)) {
                result = new Fraction(identifier);
                // Allow correct parsing of sign
                if (theArray[theArray.length - 1] == '-' &&
                    isNaN(theArray[theArray.length - 2])) {
                    theArray.pop();
                    result = result.times(-1);
                }
                if (theArray[theArray.length - 1] == '+' &&
                    isNaN(theArray[theArray.length - 2])) {
                    theArray.pop();
                }

            } else
            if ((result = getEnum(identifier)) == funcENUM.NONE) {
                if (typeof(result = variables.get(identifier)) === 'undefined')
                    if ((result = identifier) != ',')
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
console.log(theArray);
    return theArray;
}

function performFunction(func, arg) {
    if (arg[0] instanceof Matrix)
        return arg[0].performFunction(func);
    else
    {
        if (func != funcENUM.ID && func != funcENUM.ZEROS)
           throw "Cannot perform operation: " + funcENUM.getString(func) + " of " + arg[0];
        return new Matrix().performFunction(func,arg);
    }

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
                if (typeof after == 'object')
                    result = before.conjugate(after);
                else
                    result = before.power(after);
            else {
                if (!isNaN(before) || !isNaN(after))
                    throw "That's not valid maths! ";

                result = Math.pow(before, after);
            }
            break;
    }
    return result;
}

function getOperand(oprnd) {
    if (!isNaN(oprnd)) return parseInt(oprnd);
    else if (typeof oprnd == 'object') return oprnd;
    else return variables.get(oprnd);
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
    return isOperator(str) || isBrackets(str) || str == ',';
}

function isSquiggle(str) {
    return str == '}' || str == '{';
}
