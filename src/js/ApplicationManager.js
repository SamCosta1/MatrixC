function ApplicationManager() {
    var variables = null,
        commandLine = null,
        popup = null,
        matrixManager = null,
        sidebar = null,
        header = null,
        quickCalcsPanel = null,
        settings = null;

    function init() {
        variables = new Variables();
        popup = new Popup();
        sidebar = new Sidebar();
        header = new Header();
        settings = new Settings();
        quickCalcsPanel = new QuickCalculations();
        matrixManager = new MatrixInputManager(variables, popup, quickCalcsPanel);
        commandLine = new CommandLine(variables, matrixManager).init();

        header.init();
        settings.init();
        quickCalcsPanel.init(matrixManager, variables);
        variables.init();
        matrixManager.init();
        sidebar.init();
        popup.init();

        $('.settingsBtn').click(onSettingsClicked);
    }

    function onSettingsClicked() {
        popup.render({
            header: "Settings",
            body: settings.getDom()
        });
    }

    return {
        init: init
    };
}
