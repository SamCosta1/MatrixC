function Popup() {
    var $container = $('<div class="popUpContainer">'),
        $header = $('<div class="popUpHeader noSelect">'),
        $headerText = $('<p class="popUpHeaderText">'),
        $close = $('<div class="closebtn icon-close">'),
        $popupBody = $('<div class="popUpBody">'),
        $window = $(window),
        $body = $('body');

    function init() {
        $container.hide();
        $header.append($headerText);
        $header.append($close);

        $container.append($header);
        $container.append($popupBody);
        $body.append($container);
        $window.resize(resize);

        $body.bind('sidebarResize', resize);
        $body.bind('closePopup', close);
        $close.bind('click', close);

        resize();
    }

    function close() {
        $container.hide();
    }

    function resize() {
        console.log('resize', $headerText.outerHeight(true));
        $container.width($window.width() - 23 - $('.sidebar').width());
        $popupBody.height($container.height() - $headerText.outerHeight(true));
    }

    function renderContent(content) {
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
