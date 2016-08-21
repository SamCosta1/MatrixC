function Popup() {
    var $container = $('<div class="popUpContainer">'),
        $header = $('<div class="popUpHeader noSelect">'),
        $headerText = $('<p class="popUpHeaderText">'),
        $close = $('<img class="closebtn" src="img/x.png">'),
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
        $container.width($window.width() - 17 - $('.sidebar').width());
        $container.height($window.height() * 0.95);
    }

    function renderContent(content) {
        $container.show();
        $headerText.empty();
        $popupBody.empty();
        $headerText.append(content.header);
        $popupBody.append(content.body);
    }


    return {
        render: renderContent,
        init: init
    };
}
