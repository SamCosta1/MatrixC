function MatrixCellManager(onChange) {

    function getCell(row, col, val) {
        var $container = $('<div class="matrixCell">');
        var $top = $('<input class="inputCell top" type="text">').appendTo($container);
        $('<hr class="fractionLine">').appendTo($container);
        var $bottom = $('<input class="inputCell bottom" type="text">').appendTo($container);


        if (val.isZero()) {
            $container.addClass('zero');
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
        });

        $container.change(onChange);

        $container.keyup(function(e) {
            e.stopImmediatePropagation();
        });

        return $container;
    }

    function updateCell($parent, top, bottom) {
        $parent.find('.top').val(top);
        $parent.find('.bottom').val(bottom);

        if (top === '0') {
            $parent.find('.matrixCell').addClass('zero');
        } else {
            $parent.find('.matrixCell').removeClass('zero');
        }

        if (bottom !== '1') {
            $parent.find('.matrixCell').addClass('fraction');
        } else {
            $parent.find('.matrixCell').removeClass('fraction');
        }

    }

    return {
        getCell: getCell,
        updateCell: updateCell
    }
}
