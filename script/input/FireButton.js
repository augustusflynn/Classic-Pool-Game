"use strict";

function drawSlider(mouseX) {
  let newX = FireButton.lastMouseX - mouseX
  const maxX = FireButton.lastMouseX - FireButton.x
  const minX = 0
  if (newX > maxX) {
    newX = maxX
  }
  if (newX < minX) {
    newX = minX
  }
  Canvas2D._stick.style.right = newX + 'px';
}

// Function to start dragging the slider
function startDrag(event) {
  // Check if the event is a touch event
  if (event.type === 'touchstart' && !GAME_STOPPED) {
    // Prevent default touch behavior
    event.preventDefault();
    // Get the touch ID
    const touch = event.touches[0];
    FireButton.identifier = touch.identifier;

    // Get the position of the touch relative to the canvas
    const touchX = touch.clientX - Canvas2D._canvas.getBoundingClientRect().x;
    // Check if the touch is within the slider bounds
    if (touchX >= FireButton.x && touchX <= FireButton.x + FireButton.sliderWidth) {
      // Start dragging
      FireButton.isDragging = true;

      if (!FireButton.lastMouseX) FireButton.lastMouseX = touchX
    }
  } else {
    // Start dragging
    FireButton.isDragging = true;
  }
}

// Function to end dragging the slider
function endDrag(event) {
  // Check if the event is a touch event
  if (event.type === 'touched') {
    // Prevent default touch behavior
    event.preventDefault();

    // Reset touch ID
    touchId = null;
  }
  // shoot
  const currentPower = parseInt(Canvas2D._stick.style.right)
  if (currentPower) {
    const power = 75 * currentPower / FireButton.sliderWidth
    Game.gameWorld.stick.power = power;
    Game.gameWorld.stick.beforeShoot();
  }
  // Redraw the slider
  drawSlider(FireButton.lastMouseX);
  // End dragging
  FireButton.isDragging = false;
  FireButton.lastMouseX = 0;

}

// Function to move the slider
function moveSlider(event) {
  // Check if dragging is in progress
  if (FireButton.isDragging) {
    // Get the position of the mouse or touch relative to the canvas
    const rect = Canvas2D._canvas.getBoundingClientRect();
    let mouseX;

    if (event.type === 'touchmove') {
      // Find the touch with the matching ID
      const touches = event.changedTouches;
      for (let i = 0; i < touches.length; i++) {
        if (touches[i].identifier === FireButton.identifier) {
          mouseX = touches[i].clientX - rect.left;
          break;
        }
      }
    } else {
      mouseX = event.clientX - rect.left;
    }

    // Check if the new x position is within the canvas bounds
    if (mouseX >= 0 && mouseX <= Canvas2D._stick.x + Canvas2D._stick.width) {
      // Redraw the slider
      drawSlider(mouseX);
    }
  }
}

function FireButton_Singleton() {
  this.isDragging = false;
  this.x = 0;
  this.lastMouseX = 0;
  this.sliderWidth = 0;
  this.identifier = null;
}


FireButton_Singleton.prototype.toggleDisplay = function () {
  if (isMobileBrowser()) {
    document.querySelector('.stickcontainer').classList.toggle('hidden')
  }
}

var FireButton = new FireButton_Singleton();
