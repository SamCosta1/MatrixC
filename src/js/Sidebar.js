function Sidebar() {
    var $sidebarContainer = $('.sidebar'),
        $dragHandle = $('.handle'),
        $snapHandle = $('.snapHandle'),
        $fullScreenToggle = $('.fullScreen'),

        currentWidth = 16;

    function init() {
        $sidebarContainer.css('max-width', $(window).width());
        $dragHandle.bind('mousedown', onSnapHandleMouseDown);
        $dragHandle.dblclick(onHandleDoubleClick);
        $snapHandle.click(onSnapClick);
        $fullScreenToggle.click(toggleFullScreen);
        $(window).resize(onWindowResize);

        $(document).mouseup(function(e) {
            $(document).unbind('mousemove');
        });
    }

    function expandSidebar() {
        $sidebarContainer.width($(window).width() * 0.75);
        $snapHandle.removeClass('expand');
    }

    function collapseSidebar() {
        $sidebarContainer.width(16);
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
        if ($sidebarContainer.width() == 16) {
            expandSidebar();
        } else {
            collapseSidebar();
        }
    }

    function onWindowResize() {
        $sidebarContainer.css('max-width', $(window).width());
    }

    function onHandleDoubleClick() {
        if ($sidebarContainer.width() !== 16)
            collapseSidebar();
        else
            expandSidebar();
    }

    function onSnapHandleMouseDown() {
        $(document).bind('mousemove', function(e) {
            e.stopImmediatePropagation();
            $('body').trigger('sidebarResize');
            $sidebarContainer.width($sidebarContainer.width() + $sidebarContainer.position().left - e.pageX);
            if ($sidebarContainer.width() !== 16)
                $snapHandle.removeClass('expand');
            else
                $snapHandle.addClass('expand');
        });
    }
    return {
        init: init
    };
}
