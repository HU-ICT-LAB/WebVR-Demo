AFRAME.registerComponent('add-object', {
    events: {
        click: function (e) {
            var sceneEl = document.querySelector('a-scene');
            var newEl = document.createElement("a-box");

            newEl.setAttribute('color', 'red');
            sceneEl.appendChild(newEl);

            var position = e.detail.intersection.point;
            position.y = 0.5;
            newEl.setAttribute('position', position);
        }
    }
});