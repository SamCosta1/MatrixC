function QuickCalculations() {
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
    }];

    var $specificFuncsContainer = $('.quickClassMatSpecific'),
        $generalFuncsContainer = $('.quickCalcsGeneral');

    function init() {
        initSpecificBtns();
        initGeneralBtns();
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
