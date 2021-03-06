// Just don't look at this file, seriously, go watch netfilx, this file stinks

function MatrixInputManager(_variables, _popup, _quickCalcsPanel) {

    var $newMatrixBtn = $('#btnNewMat'),
        cellManager = new FractionalInputCellManager(onCellChanged),
        selectedVariables = [],
        count = 0,
        variables = _variables,
        popup = _popup,
        quickCalcsPanel = _quickCalcsPanel;

    function init() {
        $newMatrixBtn.on('click', function() {
            newInputComp();
        });
        variables.iterate(function(matrix, matLbl) { newInputComp(matLbl, matrix);});
        $('#bin').click(removeAllMatricies);
    }

    function removeAllMatricies() {
        $('.matInput').each(function() {
            deleteMatrix($(this));
        });
        variables.reset();
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
        for (var i = 0; i < row; i++) {
            var $tr = $("<tr>");
            for (var j = 0; j < col; j++) {
                var $td = $("<td>");
                $td.append(cellManager.getCell(i, j, matrix instanceof Matrix ? matrix.getCell(i, j) :
                    matrix instanceof Fraction ? matrix : new Fraction(matrix)));
                $tr.append($td);
            }
            $table.append($tr);
        }
        $contnr.append($table);

        $div.append($contnr);
        if (matrix instanceof Matrix) {
            var $buttons = $('<div class="matrixButtons">'),
            $hiddenBtns = $('<div class="MatrixOpButtons noSelect">').appendTo($buttons),
            $modifiers = $('<div class="guiModifiers">').appendTo($buttons),

            $dragHandle = $('<div class="dragHandle icon-drag-handle">').appendTo($hiddenBtns),
            $allCalcButton = $('<div class="allCalcButton icon-info">').appendTo($hiddenBtns),
            $quickCalcsBtn = $('<div class="quickCalcsButton icon-quickCalcs">').appendTo($hiddenBtns);

            $allCalcButton.click(onAllCalcClicked);
            $quickCalcsBtn.click(quickCalcsPanel.onMatrixSelect);

            var btnImg = function(direction) {
                return $('<div class="icon-'+direction+'-arrow">');
            };

            var $colbtn = $('<button class="addCol colButton rowColModifier noSelect">');
            $colbtn.append(btnImg('right'));

            var $rowbtn = $('<button class="addRow rowButton rowColModifier noSelect">');
            $rowbtn.append(btnImg('down'));

            var $rmvColbtn = $('<button class="rmvCol colButton rowColModifier noSelect">');
            $rmvColbtn.append(btnImg('left'));

            var $rmvRowbtn = $('<button class="rmvRow rowButton rowColModifier noSelect">');
            $rmvRowbtn.append(btnImg('up'));

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
            $div.append($buttons);
        }

        $('.matDefinitions').prepend($div);

        $('.clickedit').hide()
            .focusout(endEdit)
            .keyup(function(e) {
                $('body').trigger({
                    type: 'matrixNameChange',
                    original: $(this).closest(".matInput").attr('id').split("-")[1],
                    new: $(this).val()
                });
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
            // De-select
            $(this).attr("data-clicked", 0);
            selectedVariables.splice(selectedVariables.indexOf(id), 1);
        } else {
            // Select
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
        $('body').trigger('matrixChange');
    }

    function onAddColumn(e) {
        e.stopImmediatePropagation();
        var rowCount = 0;
        var $table = $("#" + $(this).attr("data-tableid"));
        var n = $table.attr("data-cols") - 1;
        var m = $table.attr("data-rows");
        $table.attr("data-cols", n + 2);
        $table.find('tr').each(function() {
            var $td = $("<td>");
            $td.append(cellManager.getCell(rowCount, n + 1, new Fraction("0")));
            rowCount++;
            $(this).find('td').eq(n).after($td);
        });
        var varName = $(this).closest(".matInput").attr("id").split("-")[1];
        variables.get(varName).resize(parseInt(m), n + 2);
        $('body').trigger('matrixChange');
    }

    function onAddRow(e) {
        e.stopImmediatePropagation();
        var $table = $("#" + $(this).attr("data-tableid"));
        var numCols = $table.attr("data-cols");
        var numRows = $table.attr("data-rows");
        $table.attr("data-rows", parseInt(numRows) + 1);

        var $tr = $("<tr>");
        for (var i = 0; i < numCols; i++) {
            var $td = $("<td>");
            $td.append(cellManager.getCell(numRows, i, new Fraction('0')));
            $tr.append($td);
        }

        $table.append($tr);
        var varName = $(this).closest(".matInput").attr("id").split("-")[1];
        variables.get(varName).resize(parseInt(numRows) + 1, parseInt(numCols));
        $('body').trigger('matrixChange');
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
        $('body').trigger('matrixChange');
    }

    function onAllCalcClicked(e) {
        e.stopImmediatePropagation();
        var clickedLbl = $(this).closest(".matInput").attr("id").split("-")[1];
        popup.render({
            header: "Stuff about " + clickedLbl + "!!",
            body: new AllCalculations(clickedLbl, variables.get(clickedLbl)).getTex()
        });
    }

    function endEdit(e) {
        e.stopImmediatePropagation();

        var input = $(e.currentTarget),
            label = input && input.prev(),
            oldName;

        //make cammel case if needed
        var inputted = makeCammelCase(input.val());
        var err = false;
        if (!variables.isValid(inputted, false)) {
            oldName = label.closest("div").attr('id').split("-")[1];
            label.text(oldName);
            err = true;

            $('body').trigger({
                type: "matrixConfirmNameChange",
                original: oldName,
                new: oldName
            });
        } else {
            label.text(inputted);
            oldName = label.closest("div").attr('id').split("-")[1];
            var mat = variables.get(oldName);
            variables.delete(oldName);
            variables.set(inputted, mat);
            label.closest("div").attr('id', "MAT-" + inputted);
            $('body').trigger({
                type: "matrixConfirmNameChange",
                original: oldName,
                new: inputted
            });
        }
        input.hide();
        label.show();
        input.val("");

        if (err)
            $('body').trigger({
                type: 'error',
                msg: 'Invalid Variable Name :('
            });
    }

    function onCellChanged(e) {
        e.stopImmediatePropagation();
        if (variables === undefined)
            return;

        var varName = $(e.currentTarget).closest(".matInput").attr("id").split("-")[1];
        var row =  $(e.currentTarget).attr("data-row");
        var col =  $(e.currentTarget).attr("data-col");

        var newFrac = new Fraction ($(e.currentTarget).children('.top').val().trim(),
                                                $(e.currentTarget).children('.bottom').val().trim());

        variables.get(varName).update(row, col, newFrac);
        $('body').trigger({
            type: 'matrixCellChange',
            key: varName
        });
        cellManager.updateCell($(e.currentTarget).parent(), newFrac.getTopString(), newFrac.getBottomString());
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
        variables.set(lbl, matrix);
        $('#MAT-' + lbl).find('table tr').each(function() {
            $(this).find('td').each(function() {
                var row = $(this).children().attr("data-row"),
                    col = $(this).children().attr("data-col"),
                    top,bottom;

                if (matrix instanceof Matrix) {
                    var frac = matrix.getCell(row, col);
                    top = frac.getTopString();
                    bottom = frac.getBottomString();
                } else if (matrix instanceof Fraction) {
                    top = matrix.getTopString();
                    bottom = matrix.getBottomString();
                }   else {
                    top = matrix;
                }
                cellManager.updateCell($(this), top, bottom);
            });
        });
    }

    interact('.dropzone').dropzone({
        // only accept elements matching this CSS selector
        accept: '.matInput',
        // Require a 75% element overlap for a drop to be possible
        //overlap: 'pointer',

        ondragenter: function(event) {
            $(event.relatedTarget).addClass('deleting');
            $('#bin').addClass("binOpen");

        },
        ondragleave: function(event) {
            $(event.relatedTarget).removeClass('deleting');
            $('#bin').removeClass("binOpen");
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
        var id = $(obj).attr("id").split('-')[1];
        variables.delete(id);
        $(obj).remove();
        $('#bin').removeClass("binOpen");

        $('body').trigger({
            type: 'matrixDelete',
            lbl: id
        });
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
