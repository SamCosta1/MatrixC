var Parser = function() {

    function performCalc(cmd) {
        cmd = cmd.replace(/ /g, '').replace(/\n/g, '');

        // Split lines by semi colon and run each command seperatly
        if (cmd.includes(';')) {
            var commands = cmd.split(';');
            for (var c in commands)
                performCalc(commands[c]);
            return;
        }

        if (cmd === '')
            return;

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

        var calcSteps = new CalculationArray();
        calculations.set(lbl, calcSteps);

        var theArray = getArrayFromString(cmd);
        if (!containsEqs && theArray.length == 3) {
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
                    var stp = new CalculationStep({
                        type: theArray[j],
                        op1: theArray[j - 1],
                        op2: theArray[j + 1]
                    });
                    var res = calculate( theArray[j], theArray[j - 1], theArray[j + 1], stp);
                    stp.data.result = res;
                    calcSteps.push(stp);
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
                        args.push(theArray[cnt + (j + 1)]);
                    cnt++;
                }
                var step = new CalculationStep({
                    type: theArray[j - 1],
                    op1: args[0],
                });
                var r = performFunction(theArray[j - 1], args,step);
                step.data.result = r;
                calcSteps.push(step);
                theArray.splice(j, cnt + 2);
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

        calculations.get(lbl).render($('.sidebarBody'));

        if (!variables.get(lbl))
            newInputComp(lbl, theArray[0].clone());
        else {
            if (typeof variables.get(lbl) == typeof theArray[0])
                updateGUI(lbl, theArray[0].clone());
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
        return theArray;
    }

    function performFunction(func, arg, step) {
        if (arg[0] instanceof Matrix)
            return arg[0].performFunction(func, null,step);
        else {
            if (func != funcENUM.ID && func != funcENUM.ZEROS)
                throw "Cannot perform operation: " + funcENUM.getString(func) + " of " + arg[0];
            return new Matrix().performFunction(func, arg, step);
        }

    }

    function calculate(op, before, after, stp) {
        var result;
        switch (op) {
            case '+':
                if (before instanceof Matrix && !(after instanceof Matrix) ||
                    after instanceof Matrix && !(before instanceof Matrix))
                    throw "You can't add a matrix and number sorry!";

                result = before.add(after);
                break;
            case '-':
                if (before instanceof Matrix && !(after instanceof Matrix) ||
                    after instanceof Matrix && !(before instanceof Matrix))
                    throw "You can't add a matrix and number sorry!";

                result = before.subtract(after);
                break;
            case '/':
                if (!(before instanceof Matrix) && after instanceof Matrix)
                    throw "You can't divide a number by a matrix!";
                else
                    result = before.divide(after,stp);
                break;
            case '*':
                if (before instanceof Matrix)
                    result = before.times(after);
                else if (after instanceof Matrix)
                    result = after.times(before);
                else
                    result = before.times(after);
                break;
            case '^':
                if (before instanceof Matrix) {
                    before.step = stp;
                    if (after instanceof Matrix)
                        result = before.conjugate(after);
                    else
                        result = before.power(after);
                }   else {
                    if (!(before instanceof Fraction) || !(after instanceof Fraction))
                        throw "That's not valid maths! ";

                    result = before.power(after);
                }
                break;
        }
        return result;
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

    return {
        parse: performCalc
    };
};
