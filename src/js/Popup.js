function Popup() {
    var $container = $('<div class="popUpContainer">'),
        $header = $('<div class="popUpHeader noSelect">'),
        $headerText = $('<p class="popUpHeaderText">'),
        $close = $('<div class="closebtn icon-close">'),
        $popupBody = $('<div class="popUpBody">'),
        $window = $(window),
        $body = $('body'),

        isFullScreen;

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
        $popupBody.css("height", "");
        $container.css("height", "");
        $container.hide();
    }

    function resize() {
        $container.width($window.width() - 23 - $('.sidebar').width());
        if (isFullScreen) {
            $container.height(window.innerHeight * 0.98);
            $popupBody.height($container.height() - $headerText.height() - (parseInt($popupBody.css('padding-top')) * 2));
        }

        $container.css('top', (window.innerHeight - $container.height()) / 2);

        if ($('#quickCalcsContainer').is(":visible")) {
            var quickCalcsHeight = $('#quickCalcsContainer').height();
            $container.css('top', quickCalcsHeight + 10);

            if (isFullScreen) {
                $container.height($container.height() - quickCalcsHeight);
                $popupBody.height($popupBody.height() - quickCalcsHeight);
            }
        }
    }

    function renderContent(content, fullScreen = true) {
        isFullScreen = fullScreen;
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
