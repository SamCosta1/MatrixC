function MatrixCellManager() {
    function getCell(row, col, val) {
        var $container = $('<div class="matrixCell">');
        var $top = $('<input class="inputCell top" type="text">').appendTo($container);
        var $bottom = $('<input class="inputCell bottom" type="text">').appendTo($container);
        /*
        $container.val(val);
        if (val == "0")
            $container.css("color", "gray");
        $container.attr('data-row', row);
        $container.attr('data-col', col);

        $container.click(function(e) {
            e.stopImmediatePropagation();
            if ($(this).val() == "0")
                $(this).val("");
            $(this).css("color", "black");
        });
        $container.change(function(e) {
            e.stopImmediatePropagation();
            var varName = $(this).closest(".matInput").attr("id").split("-")[1];
            var row = $(this).attr("data-row");
            var col = $(this).attr("data-col");
            if ($(this).val().trim() === "") {
                $container.css("color", "gray");
                variables.get(varName).update(row, col, 0);
                $(this).val("0");
            } else {
                variables.get(varName).update(row, col, $(this).val());
            }
        });
        $container.keyup(function(e) {
            e.stopImmediatePropagation();
        });*/
        return $container;
    }

    return {
        getCell: getCell
    }
}
