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

        currentMatrix = null,
        currentLbl = null,
        scalarMultiple = 1,
        cellManager = new FractionalInputCellManager(onScalarChange);

    var $mainContainer = $('#quickCalcsContainer'),
        $specificFuncsContainer = $('.quickClassMatSpecific'),
        $generalFuncsContainer = $('.quickCalcsGeneral'),
        $title = $('.quickCalcsMatLabel'),
        $pinIcon = $('.quickCalcsPinIcon'),
        $errorLabel = $('.quickCalcsErrDisplay'),
        $errorContainer = $('.quickCalcsErrContainer'),
        $dropdowns = $('.quickCalcsOperatorsContainer').find('select'),
        $scalarMultiple = $('.quickCalcsScalarContainer');

    function init(_matrixManager, _variables) {
        matrixManager = _matrixManager;
        variables = _variables;
        initSpecificBtns();
        initGeneralBtns();
        bindEvents();

        $scalarMultiple.append(cellManager.getCell(null,null,new Fraction(1)));

        if (typeof(Storage) !== "undefined" && localStorage.getItem('pinned') === 'true') {
            $mainContainer.parent().addClass("quickCalcsOpen");
            onPinIconClicked();
        }

    }

    function onScalarChange(e) {
        e.stopImmediatePropagation();
        scalarMultiple = new Fraction ($(e.currentTarget).children('.top').val().trim(),
                                       $(e.currentTarget).children('.bottom').val().trim());
        cellManager.updateCell($(e.currentTarget).parent(), scalarMultiple.getTopString(), scalarMultiple.getBottomString());
    }

    function bindEvents() {
        $('.quickBtn').click(onButtonClick);
        $mainContainer.mouseleave(onMouseLeave);
        $mainContainer.mouseenter(onMouseEnter);
        $pinIcon.click(onPinIconClicked);
        $('body').bind('matrixNameChange', onNameTempChange);
        $('body').bind('matrixConfirmNameChange', onNameConfirmedChange);
        $('body').bind('matrixDelete', onMatrixDelete);
        $('body').bind('error', function(data) {
            errorHandle(data.msg);
        });
        $('body').bind('matrixChange', fillDropDowns);
    }

    var mouseEntered = false;

    function onMouseLeave(e) {
        if ($(e.relatedTarget).closest('.headerMenu').length > 0 || $mainContainer.hasClass('pinned'))
            return;

        if (mouseEntered) {
            $('body').removeClass('quickCalcsOpen');
            mouseEntered = false;
        }
    }

    function onMouseEnter() {
        mouseEntered = true;
        return false;
    }

    function onPinIconClicked() {
        $mainContainer.toggleClass('pinned');

        if (typeof(Storage) !== "undefined") {
            localStorage.setItem("pinned", $mainContainer.hasClass('pinned'));
        }

    }

    function onMatrixDelete(data) {
        if (data.lbl === currentLbl) {
            $mainContainer.addClass('quickCalcsNoMatrix');
            currentLbl = null;
            currentMatrix = null;
            changeTitle('');
        }
    }

    function onNameTempChange(data) {
        if (data.original === currentLbl) {
            changeTitle(data.new);
        }
    }

    function onNameConfirmedChange(data) {
        if (data.original === currentLbl) {
            changeTitle(data.new);
            currentLbl = data.new;
        }
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

            try {
                var start = Date.now();
                $errorLabel.hide();

                step.data.result = currentMatrix.performFunction(func, null, step)
                matrixManager.render({
                    matrix: step.data.result
                });

                var end = Date.now() - start;
                successHandle(end);
                console.log("Operation done in " + end + "ms");

                calcSteps.push(step);
                calcSteps.render($('.sidebarBody'));
            } catch (err) {
                errorHandle(err);
            }
        }
    }

    function errorHandle(err) {
        console.log(err);
        $errorContainer.removeClass('success');
        $errorLabel.text(err).show(200);
        setTimeout(function() {
            $errorLabel.hide(500);
        }, 10000);
    }

    function successHandle(msg) {
        $errorContainer.addClass('success');
        $errorLabel.text('Command Successful! (' + msg + ' ms' + ')').show(200);
        setTimeout(function() {
            $errorLabel.hide(500);
        }, 2000);
    }

    function initSpecificBtns() {
        for (var btn in matrixSpecific) {
            $specificFuncsContainer.append(newButton(matrixSpecific[btn]));
        }
    }

    function initGeneralBtns() {
        for (var btn in matrixGeneral) {
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

    function changeTitle(newVal) {
        $title.empty();
        $title.append(newVal);
    }

    function fillDropDowns() {
        if (!(currentMatrix instanceof Matrix))
            return;

        $dropdowns.empty();
        variables.iterate(addToDropDown);
    }

    function addToDropDown(matrix, lbl) {
        if (!(matrix instanceof Matrix))
            return;
        if (currentMatrix.numRows() === matrix.numCols() && currentMatrix.numCols() === matrix.numRows()) {
            $dropdowns.append('<option>' + lbl + '</option>');
        }
    }

    function onMatrixSelect() {
        $('body').addClass("quickCalcsOpen");
        $mainContainer.removeClass('quickCalcsNoMatrix');
        currentLbl = $(this).closest(".matInput").attr("id").split("-")[1];
        changeTitle(currentLbl);
        currentMatrix = variables.get(currentLbl);
        fillDropDowns();
    }
    return {
        init: init,
        onMatrixSelect: onMatrixSelect
    };
}
