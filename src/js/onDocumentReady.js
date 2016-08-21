// Start everything!!
$(document).ready(function() {
    new ApplicationManager().init();

    // Intialize draggableness
    interact('.draggable')
        .draggable({
            snap: {
                targets: [
                    interact.createSnapGrid({
                        x: 20,
                        y: 20
                    })
                ],
                range: Infinity,
                relativePoints: [{
                    x: 0,
                    y: 0
                }]
            },


            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            restrict: {
                restriction: "#mainBody",
                endOnly: false,
                elementRect: {
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 1
                }
            },
            // enable autoScroll
            autoScroll: true,

            // call this function on every dragmove event
            onmove: function(event) {
                var target = event.target,
                    // keep the dragged position in the data-x/data-y attributes
                    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
                    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

                // translate the element
                target.style.webkitTransform =
                    target.style.transform =
                    'translate(' + x + 'px, ' + y + 'px)';

                // update the posiion attributes
                target.setAttribute('data-x', x);
                target.setAttribute('data-y', y);
            }

        }).allowFrom('.handle');




});
