function QuickCalculations() {
    var matrixManager,
        variables,
        matrixSpecific = [{
            func: funcENUM.TRANSPOSE,
            text: "Transpose"
        }, {
            func: funcENUM.INVERSE,
            text: "Inverse"
        }, {
            func: funcENUM.DET,
            text: "Determinant"
        }],
        matrixGeneral = [{
            func: funcENUM.ID,
            text: "New Identity Matrix"
        }, {
            func: funcENUM.ZEROS,
            text: "New Zero Matrix"
        }],

        currentMatrix = null;

    var $mainContainer = $('#quickCalcsContainer'),
        $specificFuncsContainer = $('.quickClassMatSpecific'),
        $generalFuncsContainer = $('.quickCalcsGeneral'),
        $title = $('.quickCalcsTitle');

    function init(_matrixManager, _variables) {
        matrixManager = _matrixManager;
        variables = _variables;
        initSpecificBtns();
        initGeneralBtns();

        $('.quickBtn').click(onButtonClick);
        $mainContainer.mouseleave(onMouseLeave);
        $mainContainer.mouseenter(onMouseEnter);
    }

    var mouseEntered = false;
    function onMouseLeave(e) {
        if ($(e.relatedTarget).closest('.headerMenu').length > 0)
            return;

        if (mouseEntered) {
            $mainContainer.hide();
            mouseEntered = false;
        }
    }

    function onMouseEnter() {
        mouseEntered = true;
        return false;
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
            step.data.result = currentMatrix.performFunction(func, null, step)
            matrixManager.render({
                matrix: step.data.result
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

    function onMatrixSelect() {
        $mainContainer.css('display', 'flex');
        $mainContainer.removeClass('quickCalcsNoMatrix');
        var clickedLbl = $(this).closest(".matInput").attr("id").split("-")[1];
        $title.empty();
        $title.append(clickedLbl);
        currentMatrix = variables.get(clickedLbl);
    }
    return {
        init: init,
        onMatrixSelect: onMatrixSelect
    };
}
