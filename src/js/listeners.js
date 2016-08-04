$(document).ready(function() {

    $('#cmdinput')
        .on('input', function(ev) {
            var query = $(this).val();
            if (!regex.test(query)) {
                //ev.preventDefault();
                $(this).val(base);
            }
        })
        .keyup(function(e) {
            e.stopImmediatePropagation();
            var code = e.keyCode ? e.keyCode : e.which;
            if (code == 13) {
                // Enter key pressed
                var input = $(this).val().slice(base.length);
                comHist.add(input.replace(/\n/g, ''));
                histPos++;
                commandInput(input);
            } else if (code == 38 && comHist.length > 0) {
                if (histPos > 0) histPos--;
                $(this).val(base + comHist[histPos]);
            } else if (code == 40 && comHist.length > 0) {
                if (histPos < comHist.length - 1) histPos++;
                $(this).val(base + comHist[histPos]);
            } else {
                histPos = comHist.length;
            }
        });

        $('#btnNewMat')
            .hover(function() {
                $('#newLabel').show();

            }, function() {
                $('#newLabel').hide();
            })
            .click(function() {
                newInputComp(getNextFreeLetter());
            });
})
