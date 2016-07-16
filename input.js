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
var count = 0;

function newMatrixGUI(matLbl, row, col) {
    var $div = $("<div>", {
        id: "MAT-" + matLbl,
        class: "matInput"
    });
    var $span = $("<span>", {
        class: "label"
    });
    $span.css("top", col * 35 - 5);
    var $lab = $("<label>", {
        class: "pull-left"
    });
    var $labtxt = $("<input>", {
        class: "clickedit",
        type: "text"
    });

    $lab.append(matLbl);
    $span.append($lab);
    $span.append($labtxt);
    $span.append("     = ");
    $div.append($span);

    var $contnr = $("<div>", {
        class: "matContainer"
    });
    var $table = $("<table>", {
        class: "matGui",
        id: "t" + count
    });
    $table.attr("data-cols", col);
    $table.attr("data-rows", row);
    for (i = 0; i < row; i++) {
        var $tr = $("<tr>");
        for (j = 0; j < col; j++) {
            var $td = $("<td>");
            $td.append(getCell(i, j));
            $tr.append($td);
        }
        $table.append($tr);
    }
    $contnr.append($table);

    $div.append($contnr);

    $colbtn = $("<button>", {
        text: ">",
        class: "colButton rowColModifier"
    });
    $colbtn.attr("data-tableid", "t" + count);
    $rowbtn = $("<button>", {
        text: "<",
        class: "rowButton rowColModifier"
    });
    $rowbtn.attr("data-tableid", "t" + count);
    $colbtn.css("top", col * 35 - 5);
    $rowbtn.css("top", col * 35 - 5);

    $colbtn.click(
        function() {
            var rowCount = 0;
            $table = $("#" + $(this).attr("data-tableid"));
            var n = $table.attr("data-cols") - 1;
            $table.attr("data-cols", n + 2)
            console.log($table.attr("cols"));
            $table.find('tr').each(function() {
                var $td = $("<td>");
                $td.append(getCell(rowCount, n + 1));
                rowCount++;
                $(this).find('td').eq(n).after($td);
            })
        });
    $rowbtn.click(
        function() {
            $table = $("#" + $(this).attr("data-tableid"));
            var numCols = $table.attr("data-cols");
            var numRows = $table.attr("data-rows");
            $table.attr("data-rows", parseInt(numRows)+1);

            $tr = $("<tr>");
            for (i = 0; i < numCols; i++) {
                $td = $("<td>");
                $td.append(getCell(numRows, i));
                $tr.append($td);
            }

            $table.append($tr);


        });

    count++;
    $div.append($colbtn);
    $div.append($rowbtn);
    $('#matDefinitions').append($div);
    $('#matDefinitions').append($("<br>"));
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

function getCell(row, col) {
    var $c = $("<input>", {
        class: "matrixCell",
        type: "text"
    });
    $c.attr('data-row', row);
    $c.attr('data-col', col);
    return $c;
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
