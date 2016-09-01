function MatrixCellManager(_variables) {
    var variables = _variables;
    function getCell(row, col, val) {
        var $container = $('<div class="matrixCell">');
        var $top = $('<input class="inputCell top" type="text">').appendTo($container);
        $('<hr class="fractionLine">').appendTo($container);
        var $bottom = $('<input class="inputCell bottom" type="text">').appendTo($container);


        if (val.isZero()) {
            $container.addClass('zero');;
        }
        if (!val.isInt()) {
            $container.addClass('fraction');
        }

        $top.val(val.getTopString());
        $bottom.val(val.getBottomString());

        $container.attr('data-row', row);
        $container.attr('data-col', col);

        if (val.getBottomString() === '1') {
            $container.removeClass('fraction');
        } else {
            $container.addClass('fraction');
        }

        $top.keyup(function() {
            if ($(this).val().indexOf('/') > 0) {
                $(this).parent().addClass("fraction");
                $(this).val($(this).val().split('/')[0]);
                $(this).siblings('.bottom').val('');
                $(this).siblings('.bottom').focus();
            }
        });

        $top.click(function(e) {
            e.stopImmediatePropagation();
            if ($(this).val() === "0")
                $(this).val("");
            else {
                $(this).parent().removeClass('zero');
            }
        });

        $top.on('change focusout keyup',function(e) {
            var newVal = $(this).val().trim();
            
            if (newVal === '0')
                $(this).parent().addClass('zero');
            else if (e.type !== 'keyup' && newVal.trim() === '') {
                $(this).val('0');
                $(this).parent().addClass('zero');
            } else {
                $(this).parent().removeClass('zero');
            }
        });

        $bottom.focusout(function() {
            var newVal = $(this).val().trim();

            if (newVal === '') {
                $(this).parent().removeClass('fraction');
                $(this).siblings('.top').focus();
            } else if (newVal === '1' || $(this).siblings('.top').val().trim() === '0') {
                $(this).parent().removeClass('fraction');
            }
        })

        $container.change(function(e) {
            e.stopImmediatePropagation();
            var varName = $(this).closest(".matInput").attr("id").split("-")[1];
            var row = $(this).attr("data-row");
            var col = $(this).attr("data-col");

            variables.get(varName).update(row, col, new Fraction (
                                                    $(this).children('.top').val().trim(),
                                                    $(this).children('.bottom').val().trim()));
            updateCell($(this).parent(), variables.get(varName));

        });
        $container.keyup(function(e) {
            e.stopImmediatePropagation();
        });

        return $container;
    }

    function updateCell($parent, matrix) {
        var row = $parent.children().attr("data-row");
        var col = $parent.children().attr("data-col");

        var top,
            bottom;

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

        $parent.find('.top').val(top);
        $parent.find('.bottom').val(bottom);

        if (top === '0') {
            $parent.children().addClass('zero');
        } else {
            $parent.children().removeClass('zero');
        }

        if (bottom !== '1') {
            $parent.children().addClass('fraction');
        } else {
            $parent.children().removeClass('fraction');
        }

    }

    return {
        getCell: getCell,
        updateCell: updateCell
    }
}
