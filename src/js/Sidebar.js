$('.sidebar').ready(function() {
    var oldX = 0;
    $('.handle').mousedown(function() {
        $(document).bind('mousemove', function(e) {
            e.stopImmediatePropagation();
            $('.sidebar').width($('.sidebar').width() + $('.sidebar').position().left - e.pageX);
        });
    });
    $(document).mouseup(function(e) {
        $(document).unbind('mousemove');
    });
});
$(window).resize(function () {
    console.log("resize");
});
