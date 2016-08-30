function QuickCalculations() {
    var supportedButtons = [{
        func: funcENUM.TRANSPOSE,
        text: "Transpose"
    }, {
        func: funcENUM.INVERSE,
        text: "Inverse"
    }, {
        func: funcENUM.DET,
        text: "Determinant"
    }];
    var nonMatrixSpecific = [{
        func: funcENUM.ID,
        text: "New Identity Matrix"
    }, {
        func: funcENUM.ZEROS,
        text: "New Zero Matrix"
    }];

    function init() {

    }

    function newButton(func, text) {
        return '<div class="quickBtn" data-func="' + func + '"> \
                    <div class="icon-left-bracket"></div>  \
                    <div class="quickCalcBtnText">' + text + '</div> \
                    <div class="icon-right-bracket"></div>  \
                </div>';
    }
    return {
        init: init
    };
}
