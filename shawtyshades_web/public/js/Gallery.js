const btn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

console.log(btn);
console.log(menu);

btn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("clicked");
    menu.classList.toggle("show");

    console.log(menu.className);

}
);

//--------
const images = [...document.querySelectorAll(".thumb")];
const viewer = document.getElementById("galleryViewer");
const focused = document.getElementById("focusedImage");
focused.ondragstart = (e) => {
    e.preventDefault();
};
const viewport = document.getElementById("viewport");

focused.onload = () => {
    updateTransform();
};

//stating varibles
let current = 0;
let scale = 1;
let x = 0;
let y = 0;
let dragging = false;
//---------

//functions
function openImage(index) {
    current = index;
    focused.src = images[index].src;
    scale = 1;
    x = 0;
    y = 0;
    updateTransform();
    viewer.classList.remove("hidden");
}

function updateTransform(){
    clampPan();

    focused.style.transform =
    `translate(${x}px, ${y}px) scale(${scale})`;
}

document.getElementById("zoomIn").onclick=()=>{
    scale = Math.min(8, scale * 1.2);
    updateTransform();

};

document.getElementById("zoomOut").onclick=()=>{
    scale = Math.max(1, scale / 1.2);
    if (scale === 1) {
    x = 0;
    y = 0;
    }
    updateTransform();
};

document.getElementById("reset").onclick = () => {
    scale = 1;
    x = 0;
    y = 0;
    updateTransform();
};

function clampPan() {
    const viewportRect = viewport.getBoundingClientRect();

    const imgWidth = focused.naturalWidth * scale;
    const imgHeight = focused.naturalHeight * scale;

    const maxX = Math.max(0, (imgWidth - viewportRect.width) / 2);
    const maxY = Math.max(0, (imgHeight - viewportRect.height) / 2);

    x = Math.min(maxX, Math.max(-maxX, x));
    y = Math.min(maxY, Math.max(-maxY, y));
}


//----------

images.forEach((img, index) => {
    img.addEventListener("click", () => {
        openImage(index);
    });
});

viewport.addEventListener("wheel", (e) => {
    e.preventDefault();
    const rect = viewport.getBoundingClientRect();
    // mouse position reletive to viewport
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;
    const oldScale = scale;
    if (e.deltaY < 0)
        scale *= 1.1;
    else
        scale /= 1.1;

    scale = Math.max(1, Math.min(scale, 8));
    const scaleFactor = scale / oldScale;
    x = mouseX - (mouseX - x) * scaleFactor;
    y = mouseY - (mouseY - y) * scaleFactor;
    updateTransform();
});

let lastX,lastY;

viewport.addEventListener("mousedown",(e)=>{
    e.preventDefault();
    if(scale===1) return;
    dragging = true;
    lastX=e.clientX;
    lastY=e.clientY;
    viewport.style.cursor = "grabbing";
    focused.style.transition = "none";
});

window.addEventListener("mouseup",()=>{
    dragging=false
    viewport.style.cursor = "grab";
    focused.style.transition = "transform 0.12s ease"
    });

window.addEventListener("mousemove",(e)=>{
    if(!dragging) return;
    x+=e.clientX-lastX;
    y+=e.clientY-lastY;

    lastX=e.clientX;
    lastY=e.clientY;

    updateTransform();
});

function show(index){
    current=(index+images.length)%images.length;
    focused.src = images[current].src;
    scale=1;
    x=0;
    y=0;
    focused.onload = () => {
        updateTransform();
    };
    viewer.classList.remove("hidden");
}

document.getElementById("next").onclick=()=>show(current+1);
document.getElementById("prev").onclick=()=>show(current-1);

document.getElementById("close").onclick=()=>{
    viewer.classList.add("hidden");
}

document.addEventListener("keydown",(e)=>{
    if(viewer.classList.contains("hidden")) return;

    if(e.key==="ArrowRight")
        show(current+1);
    if(e.key==="ArrowLeft")
        show(current-1);
    if(e.key==="Escape")
        viewer.classList.add("hidden");
    if(e.key==="+" || e.key==="="){
        scale = Math.min(8, scale * 1.2);
        updateTransform();
    }
    if(e.key==="-"){
        scale=Math.max(1,scale/1.2);
        updateTransform();
    }
});

viewer.addEventListener("click", (e) => {
    if (e.target === viewer) {
        viewer.classList.add("hidden");
    }
});
