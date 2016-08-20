$(document).ready(function() {


        $('#btnNewMat')
            .hover(function() {
                $('#newLabel').show();

            }, function() {
                $('#newLabel').hide();
            })
            .click(function() {
                newInputComp(getNextFreeLetter());
            });
});
