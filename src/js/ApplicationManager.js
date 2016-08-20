function ApplicationManager() {
    var variables = new Variables(),
        matrixManager = new MatrixInputManager(variables),
        sidebar = new Sidebar();

    function init() {
        new CommandLine(variables, matrixManager).init();
        matrixManager.init();
        sidebar.init();
    }

    return {
        init: init
    };
}
