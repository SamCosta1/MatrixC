function QuickCalculations(_matrixManager) {
    var matrixManager = _matrixManager;
    var matrixSpecific = [{
        func: funcENUM.TRANSPOSE,
        text: "Transpose"
    }, {
        func: funcENUM.INVERSE,
        text: "Inverse"
    }, {
        func: funcENUM.DET,
        text: "Determinant"
    }];
    var matrixGeneral = [{
        func: funcENUM.ID,
        text: "New Identity Matrix"
    }, {
        func: funcENUM.ZEROS,
        text: "New Zero Matrix"
    }]

    currentMatrix = null;

    var $specificFuncsContainer = $('.quickClassMatSpecific'),
        $generalFuncsContainer = $('.quickCalcsGeneral');

    function init() {
        initSpecificBtns();
        initGeneralBtns();

        $('.quickBtn').click(onButtonClick);
    }

    function onButtonClick(e) {
        var func = $(e.currentTarget).attr('data-func');
        if ($(e.currentTarget).parent().hasClass('quickCalcsGeneral')) {
            matrixManager.render({
                matrix: new Matrix().performFunction(func, [3, 3])
            });
        } else {
            var calcSteps = new CalculationArray();
            var step = new CalculationStep({
                type: func,
                op1: currentMatrix,
            });
            matrixManager.render({
                matrix: currentMatrix.performFunction(func)
            });
            calcSteps.push(step);
            calcSteps.render($('.sidebarBody'));
        }
    }

    function initSpecificBtns() {
        for (btn in matrixSpecific) {
            $specificFuncsContainer.append(newButton(matrixSpecific[btn]));
        }
    }

    function initGeneralBtns() {
        for (btn in matrixGeneral) {
            $generalFuncsContainer.append(newButton(matrixGeneral[btn]));
        }
    }

    function newButton(data) {
        return '<div class="quickBtn" data-func="' + data.func + '"> \
                    <div class="icon-left-bracket"></div>  \
                    <div class="quickCalcBtnText">' + data.text + '</div> \
                    <div class="icon-right-bracket"></div>  \
                </div>';
    }
    return {
        init: init
    };
}
