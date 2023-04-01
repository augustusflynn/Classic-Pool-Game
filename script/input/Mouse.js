"use strict";

function handleMouseMove(evt) {
    var canvasScale = Canvas2D.scale;
    var canvasOffset = Canvas2D.offset;
    var mx = (evt.pageX - canvasOffset.x) / canvasScale.x;
    var my = (evt.pageY - canvasOffset.y) / canvasScale.y;
    if (0 < my && my < 820) {
        // if mouse is on the board => moving stick 
        Mouse._position = new Vector2(mx, my);
    }
}

function handleTouchMove(evt) {
    evt.pageX = evt.touches[0].clientX
    evt.pageY = evt.touches[0].clientY
    handleMouseMove(evt)
}

function handleMouseDown(evt) {
    handleMouseMove(evt);

    if (evt.which === 1) {
        if (!Mouse._left.down)
            Mouse._left.pressed = true;
        Mouse._left.down = true;
    } else if (evt.which === 2) {
        if (!Mouse._middle.down)
            Mouse._middle.pressed = true;
        Mouse._middle.down = true;
    } else if (evt.which === 3) {
        if (!Mouse._right.down)
            Mouse._right.pressed = true;
        Mouse._right.down = true;
    }
}

function handleMouseUp(evt) {
    handleMouseMove(evt);

    if (evt.which === 1)
        Mouse._left.down = false;
    else if (evt.which === 2)
        Mouse._middle.down = false;
    else if (evt.which === 3)
        Mouse._right.down = false;
}

function handleTouchStart(evt) {
    Mouse._left.down = true
    handleMouseMove(evt.touches[0])
}

function handleTouchEnd() {
    Mouse._left.down = false
}


function Mouse_Singleton() {
    this._position = Vector2.zero;
    this._left = new ButtonState();
    this._middle = new ButtonState();
    this._right = new ButtonState();
    if (isMobileBrowser()) {
        document.ontouchmove = handleTouchMove;
    } else {
        document.onmousemove = handleMouseMove;
    }
    document.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.ontouchstart = handleTouchStart;
    document.ontouchend = handleTouchEnd;
}

Object.defineProperty(Mouse_Singleton.prototype, "left",
    {
        get: function () {
            return this._left;
        }
    });

Object.defineProperty(Mouse_Singleton.prototype, "middle",
    {
        get: function () {
            return this._middle;
        }
    });

Object.defineProperty(Mouse_Singleton.prototype, "right",
    {
        get: function () {
            return this._right;
        }
    });

Object.defineProperty(Mouse_Singleton.prototype, "position",
    {
        get: function () {
            return this._position;
        }
    });

Mouse_Singleton.prototype.reset = function () {
    this._left.pressed = false;
    this._middle.pressed = false;
    this._right.pressed = false;
};

Mouse_Singleton.prototype.containsMouseDown = function (rect) {
    return this._left.down && rect.contains(this._position);
};

Mouse_Singleton.prototype.containsMousePress = function (rect) {
    return this._left.pressed && rect.contains(this._position);
};

var Mouse = new Mouse_Singleton();
