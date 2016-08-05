// Take input from commandLine
var base = 'MatCalculator >> ';
var regex = new RegExp('^' + base, 'i');
var comHist = [];
comHist.add = function(toAdd) {
    if (this.indexOf(toAdd) < 0)
        this.push(toAdd);
}
var histPos = 0;

function commandInput(cmd) {
    try {
        var start = Date.now();

        $('#errDisplay').hide();
        Parser().parse(cmd);
        $('#cmdinput').val(base);

        var end = Date.now() - start;
        successHandle(end);
        console.log("Operation done in " + end + "ms");
    } catch (err) {
        errorHandle(err);
        $('#cmdinput').val($('#cmdinput').val().replace(/\n/g, ''));
    }
}
function errorHandle(err) {
    console.log(err);
    $('#errDisplay').css('color', 'red');
    $('#errDisplay').text(err).show();
}

function successHandle(msg) {
    $('#errDisplay').css('color', '#008e0d');
    $('#errDisplay').text('Command Successful! (' + msg + ' ms' + ')').show(200);
    setTimeout(function() {
        $('#errDisplay').hide(500);
    }, 2000);
}
