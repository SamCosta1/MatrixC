function Header() {
    var $mainHeader = $('#header'),
        $title = $('.middleTitle'),
        $menu = $('.headerMenu'),
        $toggle = $('.headerToggleBar'),

        collapsed = false;

    function init() {
        $toggle.click(onToggleClick);
        $mainHeader.dblclick(onToggleClick);
    }

    function onToggleClick() {
        collapsed = !collapsed;

        if (collapsed) {
            $mainHeader.addClass('collapsed');

            $toggle.removeClass('icon-double-up-arrows');
            $toggle.addClass('icon-double-down-arrows');
        } else {
            $mainHeader.removeClass('collapsed');
            $toggle.addClass('icon-double-up-arrows');
            $toggle.removeClass('icon-double-down-arrows');
        }


    }

    return {
        init: init
    }
}
