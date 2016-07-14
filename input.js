function drawButton() {
    var c = document.getElementById("cvsNewBtn");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "black";
    ctx.moveTo(0, 0);
    ctx.beginPath();
    var radius = 20;
    ctx.arc(radius, radius, radius, 0, 2 * Math.PI);

    ctx.fill();
    ctx.strokeStyle = "white";
    ctx.lineWidth = 3;
    ctx.moveTo(radius,5);
    ctx.lineTo(radius,2*radius - 5);
    ctx.moveTo(5,radius);
    ctx.lineTo(2*radius - 5, radius);
    ctx.stroke();
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
        !(varName == '')
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
