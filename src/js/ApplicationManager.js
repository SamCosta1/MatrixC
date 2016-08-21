function ApplicationManager() {
    var variables = null,
        commandLine = null,
        popup = null,
        matrixManager = null,
        sidebar = null;

    function init() {
        variables = new Variables(),
        popup = new Popup(),
        sidebar = new Sidebar();

        matrixManager = new MatrixInputManager(variables, popup);
        commandLine = new CommandLine(variables, matrixManager).init();

        matrixManager.init();
        sidebar.init();
        popup.init();
    }

    return {
        init: init
    };
}
