function Popup() {
    var $container = $('<div class="popUpContainer">'),
        $header = $('<div class="popUpHeader noSelect">'),
        $headerText = $('<p class="popUpHeaderText">'),
        $close = $('<div class="closebtn icon-close">'),
        $popupBody = $('<div class="popUpBody">'),
        $window = $(window),
        $body = $('body'),

        heightScalar;

    function init() {
        $container.hide();
        $header.append($headerText);
        $header.append($close);

        $container.append($header);
        $container.append($popupBody);
        $body.append($container);
        $window.resize(resize);

        $body.on('sidebarResize quickCalcsToggle', resize);
        $body.on('closePopup', close);
        $close.on('click', close);

        resize();
    }

    function close() {
        $container.hide();
    }

    function resize() {
        $container.width($window.width() - 23 - $('.sidebar').width());
        $container.height($(window).height() * 0.98 * heightScalar);

        $popupBody.height($container.height() - $headerText.outerHeight(true));
        $container.css('top', ($(window).height() - $container.height()) / 2);

        if ($('#quickCalcsContainer').is(":visible")) {
            var quickCalcsHeight = $('#quickCalcsContainer').height();
            $container.css('top', quickCalcsHeight + 10);
            $container.height($container.height() - quickCalcsHeight);
            $popupBody.height($popupBody.height() - quickCalcsHeight);
        }
    }

    function renderContent(content, heightMultiplier = 1) {
        heightScalar = heightMultiplier;
        $headerText.empty();
        $popupBody.empty();
        $headerText.append(content.header);
        $popupBody.append(content.body);
        MathJax.Hub.Queue(["Typeset",MathJax.Hub, '.popUpBody']);

        // TODO Some kind of loading bar or spinning thing to indicate calculation
        MathJax.Hub.Queue(function() {
            $container.show();
            resize();
        });
    }


    return {
        render: renderContent,
        init: init
    };
}
