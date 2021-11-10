
this.el.addEventListener('collide', function(e) {
    console.log('Player has collided with ', e.detail.body.el);
    e.detail.target.el; // Original entity (camera).
    e.detail.body.el; // Other entity, which the camera touched.
    e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
    e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
 });