function Settings() {
    var template = `
    <div class="settingsContainer">
        <p>Colours</p>
        <div class="settingsColours">
        </div>

        <p>Themes</p>
        <div class="settingsThemes">
        </div>
    </div>
    `;

    // GULP-INCLUDE(THEME&COLOURS)
    /*
    -- Gulp will include the following lines here
        var colours = ['green', 'blue'];
        var themes = ['light','dark'];
    */
    var $settingsDom = $(template);
    function init() {
        appendColours($settingsDom.find('.settingsColours'));
        appendThemes($settingsDom.find('.settingsThemes'));
        $('.settingsOption').click(onSettingsChanged);
    }

    function onSettingsChanged() {

    }

    function appendColours($parent) {
        colours.forEach(function(col) {
            $parent.append(getOptionDom(`COLOUR-${col}`, `data-col=${col}`));
        });
    }

    function appendThemes($parent) {
        themes.forEach(function(base) {
            $parent.append(getOptionDom(`BASE-${base}`, `data-theme=${base}` ));
        });
    }

    function getOptionDom(xtraClass, data) {
        return `
            <div class=\"settingsOption ${xtraClass}\" ${data}>
            </div>
        `;
    }

    function getDom() {
        return $settingsDom;
    }

    return {
        init: init,
        getDom: getDom
    };
}
