function CommandLine(_variables, _matrixManager) {

    var $commandLineTxtBox = $('#cmdinput'),
        $errorLabel = $('#errDisplay'),
        $errorContainer = $('.errContainer'),
        base = 'MatCalculator >> ',
        baseRegex = new RegExp('^' + base, 'i'),

        history = new commandHistory(),
        matrixManager = _matrixManager,
        calculations = new Map(),
        parser = new Parser(calculations, _variables);

    function init() {
        $commandLineTxtBox.bind('input', lockPromptText);
        $commandLineTxtBox.keyup(onKeyUp);
    }

    function onKeyUp(e) {
        e.stopImmediatePropagation(); // Mainly to stop delete key deleting the matrix
        var code = e.keyCode ? e.keyCode : e.which;

        switch (code) {
            case 13: // Enter key pressed
                var input = $commandLineTxtBox.val().slice(base.length);
                history.push(input);
                commandInput(input); // Execute
                break;

            case 38: // Up key pressed
                if ((returned = history.popUp())) {
                    $($commandLineTxtBox).val(base + returned);
                }
                break;

            case 40: // Down key pressed
                if ((returned = history.popDown())) {
                    $($commandLineTxtBox).val(base + returned);
                }
                break;

            default:
                history.resetCount();
                break;
        }
    }

    function commandInput(cmd) {
        try {
            var start = Date.now();

            $errorLabel.hide();
            var result = parser.parse(cmd);

            matrixManager.render(result);
            calculations.get(result.lbl).render($('.sidebarBody'));

            $commandLineTxtBox.val(base);

            var end = Date.now() - start;
            successHandle(end);
            console.log("Operation done in " + end + "ms");
        } catch (err) {
            errorHandle(err);
            $commandLineTxtBox.val($commandLineTxtBox.val().replace(/\n/g, ''));
        }
    }

    function errorHandle(err) {
        console.log(err);
        $errorContainer.removeClass('success');
        $errorLabel.text(err).show();
    }

    function successHandle(msg) {
        $errorContainer.addClass('success');
        $errorLabel.text('Command Successful! (' + msg + ' ms' + ')').show(200);
        setTimeout(function() {
            $errorLabel.hide(500);
        }, 2000);
    }

    function lockPromptText() {
        var query = $($commandLineTxtBox).val();
        if (!baseRegex.test(query)) {
            $($commandLineTxtBox).val(base);
        }
    }

    function commandHistory() {
        var comHist = [],
            histPos = -1;

        function push(item) {

            // Only add the command if not already present and not undefined
            if (comHist.indexOf(item) < 0 && /\S/.test(item) && comHist !== 'undefined') {
                comHist.push(item.replace(/\n/g, ''));
                histPos++;
            }
        }

        function popUp() {
            if (histPos > 0 && comHist.length > 0) {
                histPos--;
                return comHist[histPos];
            } else {
                return false;
            }
        }

        function popDown() {
            if (histPos < comHist.length - 1 && comHist.length > 0) {
                histPos++;
                return comHist[histPos];
            } else {
                return false;
            }
        }

        return {
            push: push,
            popUp: popUp,
            popDown: popDown,
            resetCount: function() {
                histPos = comHist.length;
            }
        };
    }

    return {
        init: init
    };
}
