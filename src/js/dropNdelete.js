/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.matInput',
    // Require a 75% element overlap for a drop to be possible
    //overlap: 'pointer',

    ondragenter: function(event) {
        $('#bin').attr("src","img/openBin.png");

    },
    ondragleave: function(event) {
        $('#bin').attr("src","img/bin.png");

    },
    ondrop: function(event) {
        deleteMatrix(event.relatedTarget);

        // Remove from list if it was selected at time of deleation
        var index = selected.indexOf($(event.relatedTarget).attr("id"));
        if (index != -1)
            selected.splice(index,1);
    },
});
function deleteMatrix(obj) {
    variables.delete($(obj).attr("id").split('-')[1]);
    obj.remove();
    $('#bin').attr("src","img/bin.png");
}
$(document).keyup(function (e) {
    console.log(selected);
    if (e.keyCode == 46)
        for (var i in selected){
            deleteMatrix($('#' + selected[i]));
        }
        selected = [];
});
