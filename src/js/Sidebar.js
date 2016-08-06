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

    $(document).mouseup(function(e) {
        $(document).unbind('mousemove');
    });

    $('.snapHandle').click(function() {
        if ($('.sidebar').width() == 16) {
            $('.sidebar').width($(window).width() * 0.75);
            $('.snapHandle').removeClass('expand')
        } else {
            $('.sidebar').width(16);
            $('.snapHandle').addClass('expand');
        }
    });
});
$(window).resize(function() {
    $('.sidebar').css('max-width', $(window).width());
});
