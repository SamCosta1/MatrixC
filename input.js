// Take input from commandLine
var base = "MatCalculator >> ";
var regex = new RegExp("^" + base, "i");
$('#cmdinput')
    .on("input", function(ev) {
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
            $(this).val(base);
        }
    });

function commandInput(cmd) {

}


function newMatrixGUI(matLbl) {

    var $div = $("<div>", {
        id: matLbl,
        class: "matInput"
    });


    var $lab = $("<label>", {
        id: matLbl + "-name",
        class: "pull-left"
    });
    var $labtxt = $("<input>", {
        class: "clickedit",
        type: "text"
    });

    $lab.append(matLbl);



    $div.append($lab);
    $div.append($labtxt);
    $div.append(" =");
    $('#matDefinitions').append($div);

    $('.clickedit').hide()
        .focusout(endEdit)
        .keyup(function(e) {
            if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                endEdit(e);
                return false;
            } else {
                return true;
            }
        })
        .prev().click(function() {
            currentClickText = $(this).text();
            $(this).hide();
            $(this).next().show().focus();
        });
}

var currentClickText;

function endEdit(e) {
    var input = $(e.target),
        label = input && input.prev();

    //make cammel case if needed
    var inputted = makeCammelCase(input.val());


    // Check name isn't in use and isn't black
    if (isValid(inputted)) {
        label.text(inputted);
        $('#' + currentClickText).attr("id", inputted);
        currentClickText = inputted;
    } else
        label.text(currentClickText);



    input.hide();
    label.show();

}

function isValid(varName) {

    return !$('#' + varName).length &&
        !(varName === '')
}

function makeCammelCase(inputted) {
    inputted = inputted.replace(/\b[a-z]/g, function(f) {
        return f.toUpperCase();

    });
    inputted = inputted.replace(/ /g, '');
    if (inputted.length > 1)
        inputted = inputted.charAt(0).toLowerCase() + inputted.slice(1);
    return inputted;
}
