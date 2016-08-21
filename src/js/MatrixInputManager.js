// Just don't look at this file, seriously, go watch netfilx, this file stinks

function MatrixInputManager(_variables) {

    var $newMatrixBtn = $('#btnNewMat'),
        selectedVariables = [],
        count = 0,
        variables = _variables;

    function init() {
        $newMatrixBtn.bind('click', function() {
            newInputComp();
        });
    }

    function render(data) {
        if (!variables.get(data.lbl))
            newInputComp(data.lbl, data.matrix);
        else {
            updateGUI(data.lbl, data.matrix);
        }

    }

    function newInputComp(matLbl, matrix) {
        if (matLbl === undefined) {
            matLbl = variables.getNextFreeLetter();
        }

        var row, col;
        if (matrix === null || matrix === undefined) {
            matrix = new Matrix();
        }
        if (matrix instanceof Matrix) {
            col = matrix.numCols();
            row = matrix.numRows();
        } else {
            row = col = 1;
        }

        variables.set(matLbl, matrix);
        var $div = $('<div id="MAT-' + matLbl + '" class="matInput draggable drag-drop" data-clicked="0">');
        var $img = $('<img class="handle noSelect" src="img/dragHandle.png">');
        var $span = $('<span class="label noSelect">');

        var $lab = $('<label class="noSelect">');
        var $labtxt = $('<input class="clickedit" type: "text">');



        $lab.append(matLbl);
        $span.append($lab);
        $span.append($labtxt);
        $span.append("     = ");
        $div.append($span);

        var $contnr = $('<div class="matContainer">');
        var $table = $("<table>", {
            class: isNaN(matrix) ? "matGui" : "",
            id: "t" + count
        });
        $table.attr("data-cols", col);
        $table.attr("data-rows", row);

        // Build up the table
        for (i = 0; i < row; i++) {
            var $tr = $("<tr>");
            for (j = 0; j < col; j++) {
                var $td = $("<td>");
                $td.append(getCell(i, j, matrix instanceof Matrix ? matrix.getCell(i, j).toString() :
                    matrix instanceof Fraction ? matrix.toString() : matrix));
                $tr.append($td);
            }
            $table.append($tr);
        }
        $contnr.append($table);

        $div.append($contnr);
        if (matrix instanceof Matrix) {
            $modifiers = $("<span>", {
                class: "guiModifiers"
            });

            var btnImg = function() {
                return $("<img>", {
                    src: "img/arrow.png"
                });
            };

            $colbtn = $("<button>", {
                class: "addCol colButton rowColModifier noSelect"
            });
            $colbtn.append(btnImg());

            $rowbtn = $('<button class="addRow rowButton rowColModifier noSelect">');
            $rowbtn.append(btnImg());

            $rmvColbtn = $('<button class="rmvCol colButton rowColModifier noSelect flip">');
            $rmvColbtn.append(btnImg());

            $rmvRowbtn = $('<button class="rmvRow rowButton rowColModifier noSelect addLeftMargin">');
            $rmvRowbtn.append(btnImg());

            $colbtn.attr("data-tableid", "t" + count);
            $rowbtn.attr("data-tableid", "t" + count);
            $rmvRowbtn.attr("data-tableid", "t" + count);
            $rmvColbtn.attr("data-tableid", "t" + count);

            $colbtn.click(onAddColumn);
            $rowbtn.click(onAddRow);
            $rmvColbtn.click(onRemoveColumn);
            $rmvRowbtn.click(onRemoveRow);

            $div.click(onMatrixSelect);

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
                e.stopImmediatePropagation();
                if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
                    endEdit(e);
                    return false;
                } else {
                    return true;
                }
            })
            .prev().click(function(e) {
                e.stopImmediatePropagation();
                $(this).hide();
                $(this).next().show().focus();
            });
    }

    function onMatrixSelect(e) {
        e.stopImmediatePropagation();
        var id = $(this).attr('id');
        if ($(this).attr("data-clicked") == 1) {
            $(this).css("background-color", "rgba(204, 204, 204, 0.2)");
            $(this).attr("data-clicked", 0);
            selectedVariables.splice(selectedVariables.indexOf(id), 1);
        } else {
            $(this).css("background-color", "rgba(99, 182, 255, 0.2)");
            $(this).attr("data-clicked", 1);
            selectedVariables.push(id);
        }
        $selectedVariablesMatrix = this;
    }

    function onRemoveColumn(e) {
        e.stopImmediatePropagation();
        var $table = $("#" + $(this).attr("data-tableid"));
        var numCols = parseInt($table.attr("data-cols"));
        var numRows = parseInt($table.attr("data-rows"));
        if (numCols > 1) {
            $("#" + $(this).attr("data-tableid") + " td:last-child").remove();
            numCols--;
            $table.attr("data-cols", numCols);
            var varName = $(this).closest(".matInput").attr("id").split("-")[1];
            variables.get(varName).resize(numRows, numCols);
        }
    }

    function onAddColumn(e) {
        e.stopImmediatePropagation();
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
        variables.get(varName).resize(parseInt(m), n + 2);
    }

    function onAddRow(e) {
        e.stopImmediatePropagation();
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
        variables.get(varName).resize(parseInt(numRows) + 1, parseInt(numCols));
    }

    function onRemoveRow(e) {
        e.stopImmediatePropagation();
        var $table = $("#" + $(this).attr("data-tableid"));
        var numRows = parseInt($table.attr("data-rows"));
        var numCols = parseInt($table.attr("data-cols"));
        if (numRows > 1) {
            $("#" + $(this).attr("data-tableid") + " tr:last-child").remove();
            numRows--;
            $table.attr("data-rows", numRows);
            var varName = $(this).closest(".matInput").attr("id").split("-")[1];
            variables.get(varName).resize(numRows, numCols);
        }
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

        $c.click(function(e) {
            e.stopImmediatePropagation();
            if ($(this).val() == "0")
                $(this).val("");
            $(this).css("color", "black");
        });
        $c.change(function(e) {
            e.stopImmediatePropagation();
            var varName = $(this).closest(".matInput").attr("id").split("-")[1];
            var row = $(this).attr("data-row");
            var col = $(this).attr("data-col");
            if ($(this).val().trim() === "") {
                $c.css("color", "gray");
                variables.get(varName).update(row, col, 0);
                $(this).val("0");
            } else {
                variables.get(varName).update(row, col, $(this).val());
            }
        });
        $c.keyup(function(e) {
            e.stopImmediatePropagation();
        });
        return $c;
    }


    function endEdit(e) {
        e.stopImmediatePropagation();

        var input = $(e.target),
            label = input && input.prev();

        //make cammel case if needed
        var inputted = makeCammelCase(input.val());
        var err = false;
        if (!variables.isValid(inputted, false)) {
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

        if (err)
            errorHandle("Invalid Variable Name :(");

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

        if (matrix instanceof Matrix) {

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

                for (i = 0; i < Math.abs(dCol); i++)
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


                $input.val(matrix instanceof Matrix ? matrix.getCell(row, col) : matrix.toString());
            });
        });
    }

    interact('.dropzone').dropzone({
        // only accept elements matching this CSS selector
        accept: '.matInput',
        // Require a 75% element overlap for a drop to be possible
        //overlap: 'pointer',

        ondragenter: function(event) {
            $('#bin').attr("src", "img/openBin.png");

        },
        ondragleave: function(event) {
            $('#bin').attr("src", "img/bin.png");

        },
        ondrop: function(event) {
            deleteMatrix(event.relatedTarget);

            // Remove from list if it was selectedVariables at time of deleation
            var index = selectedVariables.indexOf($(event.relatedTarget).attr("id"));
            if (index != -1)
                selectedVariables.splice(index, 1);
        },
    });

    function deleteMatrix(obj) {
        variables.delete($(obj).attr("id").split('-')[1]);
        obj.remove();
        $('#bin').attr("src", "img/bin.png");
    }

    $(document).keyup(function(e) {
        if (e.keyCode == 46)
            for (var i in selectedVariables) {
                deleteMatrix($('#' + selectedVariables[i]));
            }
        selectedVariables = [];
    });


    return {
        init: init,
        render: render
    };
}
