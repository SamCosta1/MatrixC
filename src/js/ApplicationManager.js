function ApplicationManager() {
    var variables = null,
        commandLine = null,
        popup = null,
        matrixManager = null,
        sidebar = null,
        header = null,
        quickCalcsPanel = null;

    function init() {
        variables = new Variables();
        popup = new Popup();
        sidebar = new Sidebar();
        header = new Header();
        quickCalcsPanel = new QuickCalculations();

        header.init();
        quickCalcsPanel.init();
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
