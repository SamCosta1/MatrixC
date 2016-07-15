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
    ctx.moveTo(radius, 5);
    ctx.lineTo(radius, 2 * radius - 5);
    ctx.moveTo(5, radius);
    ctx.lineTo(2 * radius - 5, radius);
    ctx.stroke();
}

function newMatrixGUI(matLbl, rows, cols) {
    var $div = $("<div>", {
        id: "MAT-" + matLbl,
        class: "matInput"
    });
    var $lab = $("<label>", {
        class: "pull-left"
    });
    var $labtxt = $("<input>", {
        class: "clickedit",
        type: "text"
    });
    var $LBrac = $("<img>", {
        src: "img/bracketBlack.png",
        class: "matBracket"
    });
    var $RBrac = $("<img>", {
        src: "img/bracketBlack.png",
        class: "matBracket flip"
    });



    $lab.append(matLbl);
    $div.append($lab);
    $div.append($labtxt);
    $div.append(" = ");

    var $inputs = $("<span>", {
        id: matLbl + "-cells",
        class: "grid"
    });
    $inputs.append($LBrac);
    // Cells
    for (i = 0; i < rows; i++) {
        for (j = 0; j < cols; j++) {
            var $txt = $("<input>", {
                class: "matrixCell",
                type: "text"
            });
            $inputs.append($txt);
        }
    }
    $inputs.append($RBrac);
    $inputs.append($("<br>"));
    $div.append($inputs);
    $('#matDefinitions').append($div);
    //$('#matDefinitions').append($inputs);


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
            $(this).hide();
            $(this).next().show().focus();
        });

}

function endEdit(e) {
    var input = $(e.target),
        label = input && input.prev();

    //make cammel case if needed
    var inputted = makeCammelCase(input.val());
    console.log(variables.get(inputted) == undefined);
    if (!isValid(inputted))
        label.text(label.closest("div").attr('id').split("-")[1]);

    else {
        label.text(inputted);
        label.closest("div").attr('id', "MAT-" + inputted);

    }
    input.hide();
    label.show();
    input.val("");

}

function isValid(inputted) {
    return inputted != '' && variables.get(inputted) == undefined;
}


function makeCammelCase(inputted) {
    inputted = inputted.replace(/\b[a-z]/g, function(f) {
        return f.toUpperCase();

    });
    inputted = inputted.replace(/ /g, '').replace(/-/g, '');
    if (inputted.length > 1)
        inputted = inputted.charAt(0).toLowerCase() + inputted.slice(1);
    return inputted;
}
