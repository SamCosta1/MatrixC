function Sidebar() {
    var $sidebarContainer = $('.sidebar'),
        $sidebarBody = $('.sidebarBody'),
        $dragHandle = $('.handle'),
        $snapHandle = $('.snapHandle'),
        $fullScreenToggle = $('.fullScreen'),

        currentWidth = handleWidth,
        handleWidth = $dragHandle.width();

    function init() {

        $dragHandle.on('mousedown', onSnapHandleMouseDown);
        $dragHandle.dblclick(onHandleDoubleClick);
        $snapHandle.click(onSnapClick);
        $fullScreenToggle.click(toggleFullScreen);

        $(document).mouseup(function(e) {
            $(document).off('mousemove');
        });
    }

    function expandSidebar() {
        $sidebarContainer.width($(window).width() * 0.75);
        $snapHandle.removeClass('expand');
    }

    function collapseSidebar() {
        $sidebarContainer.width(handleWidth);
        $snapHandle.addClass('expand');
    }

    function toggleFullScreen() {
        if ($fullScreenToggle.hasClass('unfullScreen'))
            $sidebarContainer.css('width', currentWidth);
        else {
            currentWidth = $sidebarContainer.width();
            $sidebarContainer.width($(window).width());
        }
        $fullScreenToggle.toggleClass('unfullScreen');
    }

    function onSnapClick() {
        if ($sidebarContainer.width() == handleWidth) {
            expandSidebar();
        } else {
            collapseSidebar();
        }
        $('body').trigger('sidebarResize');
    }

    function onHandleDoubleClick() {
        if ($sidebarContainer.width() !== handleWidth)
            collapseSidebar();
        else
            expandSidebar();
        $('body').trigger('sidebarResize');
    }

    function onSnapHandleMouseDown() {
        $(document).on('mousemove', function(e) {
            e.stopImmediatePropagation();
            $('body').trigger('sidebarResize');
            var amount = $sidebarContainer.position().left - e.pageX;
            if (amount < 0 || $sidebarContainer.width() < $(window).width())
                $sidebarContainer.width($sidebarContainer.width() + $sidebarContainer.position().left - e.pageX);

            if ($sidebarContainer.width() > $(window).width())
                $sidebarContainer.width($(window).width());
            if ($sidebarContainer.width() !== handleWidth)
                $snapHandle.removeClass('expand');
            else
                $snapHandle.addClass('expand');
        });
    }
    return {
        init: init
    };
}
