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

function newMatrix(matLbl, row, col, matrix) {
    if (matrix == null)
        matrix = new Matrix();
    variables.set(matLbl, matrix);
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
            $td.append(getCell(i, j, matrix.getCell(i, j)));
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
    $rowbtn = $("<button>", {
        text: "<",
        class: "rowButton rowColModifier"
    });
    $rmvColbtn = $("<button>", {
        text: "<",
        class: "colButton rowColModifier"
    });
    $rmvRowbtn = $("<button>", {
        text: ">",
        class: "rowButton rowColModifier"
    });
    $colbtn.attr("data-tableid", "t" + count);
    $rowbtn.attr("data-tableid", "t" + count);
    $rmvRowbtn.attr("data-tableid", "t" + count);
    $rmvColbtn.attr("data-tableid", "t" + count);

    $colbtn.css("top", col * 35 - 5);
    $rowbtn.css("top", col * 35 - 5);
    $rmvColbtn.css("top", col * 35 - 5);
    $rmvRowbtn.css("top", col * 35 - 5);
    $colbtn.click(
        function() {
            var rowCount = 0;
            $table = $("#" + $(this).attr("data-tableid"));
            var n = $table.attr("data-cols") - 1;
            $table.attr("data-cols", n + 2)
            $table.find('tr').each(function() {
                var $td = $("<td>");
                $td.append(getCell(rowCount, n + 1, "0"));
                rowCount++;
                $(this).find('td').eq(n).after($td);
            })

        });
    $rowbtn.click(
        function() {
            $table = $("#" + $(this).attr("data-tableid"));
            var numCols = $table.attr("data-cols");
            var numRows = $table.attr("data-rows");
            $table.attr("data-rows", parseInt(numRows) + 1);

            $tr = $("<tr>");
            for (i = 0; i < numCols; i++) {
                $td = $("<td>");
                $td.append(getCell(numRows, i, "0"));
                $tr.append($td);
            }
            $table.append($tr);
        });

    $rmvColbtn.click(function() {
        var $table = $("#" + $(this).attr("data-tableid"));
        var numCols = parseInt($table.attr("data-cols"));
        if (numCols > 1) {
            $("#" + $(this).attr("data-tableid") + " td:last-child").remove();
            $table.attr("data-cols", numCols - 1);
        }
    });
    $rmvRowbtn.click(function() {
        var $table = $("#" + $(this).attr("data-tableid"));
        var numRows = parseInt($table.attr("data-rows"));
        if (numRows > 1) {
            $("#" + $(this).attr("data-tableid") + " tr:last-child").remove();
            $table.attr("data-rows", numRows - 1);
        }
    });


    count++;
    $div.append($rowbtn);
    $div.append($rmvRowbtn);
    $div.append($rmvColbtn);
    $div.append($colbtn);

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

function getCell(row, col, val) {
    var $c = $("<input>", {
        class: "matrixCell",
        type: "text",
    });
    $c.val(val);
    if (val == "0")
        $c.css("color", "gray");
    $c.attr('data-row', row);
    $c.attr('data-col', col);

    $c.click(function() {
        if ($(this).val() == "0")
            $(this).val("");
        $(this).css("color", "black");
    });
    $c.change(function() {
        var varName = $(this).closest(".matInput").attr("id").split("-")[1];
        var row = $(this).attr("data-row");
        var col = $(this).attr("data-col");
        variables.get(varName).update(row, col, $(this).val());
        console.log("|" + variables.get(varName).matrix);
    });
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
