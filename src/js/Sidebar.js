$('.sidebar').ready(function() {
    $('.sidebar').css('max-width', $(window).width());
    var oldX = 0;
    $('.handle').mousedown(function() {
        $(document).bind('mousemove', function(e) {
            e.stopImmediatePropagation();
            $('.sidebar').width($('.sidebar').width() + $('.sidebar').position().left - e.pageX);
            if ($('.sidebar').width() !== 16)
                $('.snapHandle').removeClass('expand');
            else
                $('.snapHandle').addClass('expand');
        });
    });

    $('.handle').dblclick(function() {
        if ($('.sidebar').width() !== 16)
            collapseSidebar();
        else
            expandSidebar();
    });

    $(document).mouseup(function(e) {
        $(document).unbind('mousemove');
    });

    $('.snapHandle').click(function() {
        if ($('.sidebar').width() == 16) {
            expandSidebar();
        } else {
            collapseSidebar();
        }
    });
    var prevSize = 16;
    $('.fullScreen').click(function() {
        if ($('.fullScreen').hasClass('unfullScreen'))
            $('.sidebar').css('width', prevSize);
        else {
            prevSize = $('.sidebar').width();
            $('.sidebar').width($(window).width());
        }
        $('.fullScreen').toggleClass('unfullScreen');
    });
});
$(window).resize(function() {
    $('.sidebar').css('max-width', $(window).width());
});

function expandSidebar() {
    $('.sidebar').width($(window).width() * 0.75);
    $('.snapHandle').removeClass('expand')
}

function collapseSidebar() {
    $('.sidebar').width(16);
    $('.snapHandle').addClass('expand');
}
