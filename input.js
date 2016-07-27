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

function newInputComp(matLbl, matrix) {
    var row, col;
    if (matrix == null || matrix == undefined) {
        matrix = new Matrix();
    }
    if (isNaN(matrix)) {
        col = matrix.numCols();
        row = matrix.numRows();
    } else {
        row = col = 1;
    }

    variables.set(matLbl, matrix);
    var $div = $("<div>", {
        id: "MAT-" + matLbl,
        class: "matInput draggable drag-drop",
        'data-clicked': 0
    });
    var $img = $("<img>", {
        class: "handle noSelect",
        src: "img/dragHandle.png"
    });
    var $span = $("<span>", {
        class: "label noSelect"
    });
    //$span.css("top", col * 35 - 5);
    var $lab = $("<label>", {
        class: "pull-left noSelect"
    });
    var $labtxt = $("<input>", {
        class: "clickedit",
        type: "text"
    });

    // target elements with the "draggable" class
    interact('.draggable')
        .draggable({
            snap: {
                targets: [
                    interact.createSnapGrid({
                        x: 20,
                        y: 20
                    })
                ],
                range: Infinity,
                relativePoints: [{
                    x: 0,
                    y: 0
                }]
            },


            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
                restriction: "#mainBody",
                endOnly: false,
                elementRect: {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 1
                }
            },
            // enable autoScroll
            autoScroll: true,

            // call this function on every dragmove event
            onmove: dragMoveListener,

        }).allowFrom('.handle');


    // this is used later in the resizing and gesture demos
    window.dragMoveListener = dragMoveListener;

    $lab.append(matLbl);
    $span.append($lab);
    $span.append($labtxt);
    $span.append("     = ");
    $div.append($span);

    var $contnr = $("<div>", {
        class: "matContainer"
    });
    var $table = $("<table>", {
        class: isNaN(matrix) ? "matGui" : "",
        id: "t" + count
    });
    $table.attr("data-cols", col);
    $table.attr("data-rows", row);
    for (i = 0; i < row; i++) {
        var $tr = $("<tr>");
        for (j = 0; j < col; j++) {
            var $td = $("<td>");
            $td.append(getCell(i, j, isNaN(matrix) ? matrix.getCell(i, j) : matrix));
            $tr.append($td);
        }
        $table.append($tr);
    }
    $contnr.append($table);

    $div.append($contnr);
    if (isNaN(matrix)) {
        $modifiers = $("<span>", {
            class: "guiModifiers"
        });

        var btnImg = function() {
            return $("<img>", {
                src: "img/arrow.png"
            });
        }

        $colbtn = $("<button>", {
            class: "addCol colButton rowColModifier noSelect"
        });
        $colbtn.append(btnImg());
        $rowbtn = $("<button>", {
            class: "addRow rowButton rowColModifier noSelect flipY"
        });
        $rowbtn.append(btnImg());

        $rmvColbtn = $("<button>", {
            class: "rmvCol colButton rowColModifier noSelect flip"
        });
        $rmvColbtn.append(btnImg());
        $rmvRowbtn = $("<button>", {
            class: "rmvRow rowButton rowColModifier noSelect addLeftMargin"
        });
        $rmvRowbtn.append(btnImg());

        $colbtn.attr("data-tableid", "t" + count);
        $rowbtn.attr("data-tableid", "t" + count);
        $rmvRowbtn.attr("data-tableid", "t" + count);
        $rmvColbtn.attr("data-tableid", "t" + count);





        $colbtn.click(
            function() {
                var rowCount = 0;
                $table = $("#" + $(this).attr("data-tableid"));
                var n = $table.attr("data-cols") - 1;
                var m = $table.attr("data-rows");
                $table.attr("data-cols", n + 2);
                $table.find('tr').each(function() {
                    var $td = $("<td>");
                    $td.append(getCell(rowCount, n + 1, "0"));
                    rowCount++;
                    $(this).find('td').eq(n).after($td);
                });
                var varName = $(this).closest(".matInput").attr("id").split("-")[1];
                variables.get(varName).matrix.resize([parseInt(m), n + 2]);
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
                var varName = $(this).closest(".matInput").attr("id").split("-")[1];
                variables.get(varName).matrix.resize(
                    [parseInt(numRows) + 1, parseInt(numCols)]);
            });

        $rmvColbtn.click(function() {
            var $table = $("#" + $(this).attr("data-tableid"));
            var numCols = parseInt($table.attr("data-cols"));
            var numRows = parseInt($table.attr("data-rows"));
            if (numCols > 1) {
                $("#" + $(this).attr("data-tableid") + " td:last-child").remove();
                numCols--;
                $table.attr("data-cols", numCols);
                var varName = $(this).closest(".matInput").attr("id").split("-")[1];
                variables.get(varName).matrix.resize([numRows, numCols]);
            }
        });
        $rmvRowbtn.click(function() {
            var $table = $("#" + $(this).attr("data-tableid"));
            var numRows = parseInt($table.attr("data-rows"));
            var numCols = parseInt($table.attr("data-cols"));
            if (numRows > 1) {
                $("#" + $(this).attr("data-tableid") + " tr:last-child").remove();
                numRows--;
                $table.attr("data-rows", numRows);
                var varName = $(this).closest(".matInput").attr("id").split("-")[1];
                variables.get(varName).matrix.resize([numRows, numCols]);
            }
        });

        $div.click(function(e) {
            e.stopImmediatePropagation();
            if ($(this).attr("data-clicked") == 1) {
                $(this).css("background-color", "rgba(204, 204, 204, 0.2)");
                $(this).attr("data-clicked", 0);
            } else {
                $(this).css("background-color", "rgba(99, 182, 255, 0.2)");
                $(this).attr("data-clicked", 1)
            }
            $selectedMatrix = this;
        });

        count++;
        $modifiers.append($rmvRowbtn);
        $modifiers.append($rowbtn);
        $modifiers.append($rmvColbtn);
        $modifiers.append($colbtn);
        $div.append($modifiers);
    }
    $div.append($img);

    $('#matDefinitions').append($div);
    //$('#matDefinitions').append($("<br>"));
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
        if ($(this).val().trim() === "") {
            $c.css("color", "gray");
            variables.get(varName).update(row, col, 0);
            $(this).val("0");
        } else
            variables.get(varName).update(row, col, $(this).val());

    });
    return $c;
}

function dragMoveListener(event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function endEdit(e) {
    var input = $(e.target),
        label = input && input.prev();

    //make cammel case if needed
    var inputted = makeCammelCase(input.val());
    var err = false;
    if (!isValid(inputted, false)) {
        label.text(label.closest("div").attr('id').split("-")[1]);
        err = true;
    } else {
        label.text(inputted);
        var mat = variables.get(label.closest("div").attr('id').split("-")[1]);
        variables.delete(label.closest("div").attr('id').split("-")[1]);
        variables.set(inputted, mat);
        label.closest("div").attr('id', "MAT-" + inputted);
    }
    input.hide();
    label.show();
    input.val("");

    if(err)
      errorHandle("Invalid Variable Name :(");

}

function isValid(inputted, allowDuplicate) {
    return /^[a-z0-9]+$/i.test(inputted) && (allowDuplicate ? true :
        variables.get(inputted) === undefined) &&
        getEnum(inputted) === funcENUM.NONE;

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

function updateGUI(lbl, matrix) {
    variables.set(lbl, matrix);

    if (isNaN(matrix)) {
        var dRow = parseInt(matrix.numRows() - $('#MAT-' + lbl).find('table').attr('data-rows'));
        var dCol = parseInt(matrix.numCols() - $('#MAT-' + lbl).find('table').attr('data-cols'));
        if (dRow !== 0 || dCol !== 0) {

            var $guiMods = $('#MAT-' + lbl).find('.guiModifiers');
            var $addCol = $guiMods.find('.addCol');
            var $rmvCol = $guiMods.find('.rmvCol');
            var $addRow = $guiMods.find('.addRow');
            var $rmvRow = $guiMods.find('.rmvRow');


            for (var i = 0; i < Math.abs(dRow); i++)
                if (dRow < 0)
                    $rmvRow.trigger('click');
                else
                    $addRow.trigger('click');

            for (var i = 0; i < Math.abs(dCol); i++)
                if (dCol < 0)
                    $rmvCol.trigger('click');
                else
                    $addCol.trigger('click');

        }

    }
    $('#MAT-' + lbl).find('table tr').each(function() {
        $(this).find('td').each(function() {
            var $input = $(this).find('input');
            var row = $input.attr("data-row");
            var col = $input.attr("data-col");

            $input.val(isNaN(matrix) ?  matrix.getCell(row, col) : matrix);
        });
    });


}
