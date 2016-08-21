function Popup() {
    var $container = $('<div class="popUpContainer">'),
        $header = $('<div class="popUpHeader">'),
        $popupBody = $('<div class="popUpBody">'),
        $window = $(window),
        $body = $('body');

    function init() {
        $container.hide();
        $container.append($header);
        $container.append($popupBody);
        $body.append($container);
        $window.resize(resize);
        $body.bind('sidebarResize', resize);
        $body.bind('closePopup', close);

        resize();
    }

    function close() {
        $container.hide();
    }

    function resize() {
        $container.width($window.width() - 17 - $('.sidebar').width());
        $container.height($window.height() * 0.95);
    }

    function renderContent(content) {
        $container.show();
        $header.empty();
        $popupBody.empty();
        $header.append(content.header);
        $popupBody.append(content.body);
    }


    return {
        render: renderContent,
        init: init
    };
}
