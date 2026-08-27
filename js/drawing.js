
const canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");
context.fillStyle = "white";
context.fillRect(0, 0, canvas.width, canvas.height);




let restore_array = [];
let index = 0;
let start_background_color = "white";
let draw_color = "black";
let draw_width = "2";
let is_drawing = false;

restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
index = 1;

function change_color(element) {
    draw_color = element.style.background;

}
//add pen pressure later using https://developer-docs.wacom.com/docs/icbt/web/web-api-overview/

canvas.addEventListener("pointerdown", start, false);
canvas.addEventListener("pointermove", draw, false);
canvas.addEventListener("pointerup", stop, false);
canvas.addEventListener("pointerout", stop, false);

const penSize = document.getElementById("pen-size");
const penSizeValue = document.getElementById("pen-size-value");

penSize.addEventListener("input", () => {
    penSizeValue.textContent = penSize.value;
});
canvas.addEventListener("pointerdown", start, false);
canvas.addEventListener("pointermove", draw, false);
canvas.addEventListener("pointerup", stop, false);
canvas.addEventListener("pointerout", stop, false);

let lastX = 0;
let lastY = 0;

function getPos(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function start(event) {
    is_drawing = true;
    const pos = getPos(event);
    lastX = pos.x;
    lastY = pos.y;
    event.preventDefault();
}

function draw(event) {
    if (!is_drawing) return;

    const pos = getPos(event);
    const pressure = event.pressure > 0 ? event.pressure : 0.5;

    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(pos.x, pos.y);
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width * pressure * 2; 
    context.lineCap = "round";
    context.lineJoin = "round";
    context.stroke();

    lastX = pos.x;
    lastY = pos.y;

    event.preventDefault();
}

function stop(event) {
    if (is_drawing) {
        is_drawing = false;
    }
    event.preventDefault();

    if (event.type != "pointerout") {
        restore_array = restore_array.slice(0, index + 1); 
        restore_array.push(context.getImageData(0, 0, canvas.width, canvas.height));
        index = restore_array.length - 1; 
    }
}

//clear//
function clearCanvas() {
    context.fillStyle = start_background_color;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);

    restore_array = [context.getImageData(0, 0, canvas.width, canvas.height)];
    index = 0;
}
//undo/ redo//
document.addEventListener("keydown", (event) => {
    const isUndo = (event.ctrlKey || event.metaKey) && event.key === "z" && !event.shiftKey;
    const isRedo = ((event.ctrlKey || event.metaKey) && event.key === "y") ||
                   ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === "z");

    if (isUndo) {
        event.preventDefault();
        undo();
    } else if (isRedo) {
        event.preventDefault();
        redo();
    }
});

function undo() {
    if (index > 0) {
        index -= 1;
        context.putImageData(restore_array[index], 0, 0);
    }
}

function redo() {
    if (index < restore_array.length - 1) {
        index += 1;
        context.putImageData(restore_array[index], 0, 0);
    }
}
//save
function saveImage() {
    const canvas = document.getElementById("canvas");
    const dataURL = canvas.toDataURL();
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `shawshad-${Date.now()}.png`;
    link.click();
}