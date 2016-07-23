/* The dragging code for '.draggable' from the demo above
 * applies to this demo as well so it doesn't have to be repeated. */

// enable draggables to be dropped into this
interact('.dropzone').dropzone({
    // only accept elements matching this CSS selector
    accept: '.matInput',
    // Require a 75% element overlap for a drop to be possible
    overlap: 'pointer',

    ondragenter: function(event) {
        $('#bin').attr("src","img/openBin.png");

    },
    ondragleave: function(event) {
        $('#bin').attr("src","img/bin.png");

    },
    ondrop: function(event) {
        variables.delete($(event.relatedTarget).attr("id").split('-')[1]);
        event.relatedTarget.remove();
        $('#bin').attr("src","img/bin.png");

    },

});
