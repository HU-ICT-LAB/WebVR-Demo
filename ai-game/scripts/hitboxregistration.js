AFRAME.registerComponent("hitbox", {
    init: function() {
        let body = document.createElement("a-box");
        let head = document.createElement("a-box");

        body.setAttribute("position", "0 110 0");
        body.setAttribute("mixin", "body");
        head.setAttribute("position", "0 70 0");
        head.setAttribute("mixin", "head");
        body.appendChild(head)
        this.el.appendChild(body);}})

AFRAME.registerPrimitive("a-hitbox", {
    defaultComponents: {hitbox: {}}})