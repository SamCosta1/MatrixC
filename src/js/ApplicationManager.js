function ApplicationManager() {
    var variables = new Variables(),
        popup = new Popup(),
        matrixManager = new MatrixInputManager(variables, popup),
        sidebar = new Sidebar();

    function init() {
        new CommandLine(variables, matrixManager).init();
        matrixManager.init();
        sidebar.init();
        popup.init();
    }

    return {
        init: init
    };
}
