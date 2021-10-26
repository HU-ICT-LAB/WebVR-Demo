AFRAME.registerComponent('query-selector-example', {
    init: function () {
      this.entities = document.querySelectorAll('.box');
    },
    
    tick: function () {
      // Don't call query selector in here, query beforehand.
      for (let i = 0; i < this.entities.length; i++) {
        // Do something with entities.
      }
    }
  });