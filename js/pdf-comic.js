

pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";


let pdfDoc = null;
let currentPage = 1;
let scale = 1.5;


//------html elements
const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d");
const pageNumDisplay = document.getElementById("pageNum");
const pageCountDisplay = document.getElementById("pageCount");
const reader = document.getElementById("comicReader");
const controls = document.getElementById("pdfControls");
//------

async function loadPDF(pdfPath) {
    pdfDoc = await pdfjsLib.getDocument(pdfPath).promise;
    controls.style.display = "flex";
    pageCountDisplay.textContent = pdfDoc.numPages;
    currentPage = 1;
    renderPage(currentPage);
}

async function renderPage(num) {
    const page = await pdfDoc.getPage(num);
    const viewport = page.getViewport({
        scale: scale
    });
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({
        canvasContext: ctx,
        viewport: viewport
    }).promise;
    pageNumDisplay.textContent = num;
}


document.getElementById("prevPage").onclick = () => {
    if (currentPage <= 1) return;
    currentPage--;
    renderPage(currentPage);
};

document.getElementById("nextPage").onclick = () => {
    if (currentPage >= pdfDoc.numPages) return;
    currentPage++;
    renderPage(currentPage);
};

document.getElementById("zoomIn").onclick = () => {
    scale += 0.2;
    renderPage(currentPage);
};


document.getElementById("zoomOut").onclick = () => {
    if (scale <= 0.5) return;
    scale -= 0.2;
    renderPage(currentPage);
};

//thumbnails
document.querySelectorAll(".chapter").forEach(chapter => {
    chapter.onclick = () => {
        reader.style.display = "block";
        loadPDF(chapter.dataset.pdf);
    };
});

document.getElementById("closeReader").onclick = () => {
    reader.style.display = "none";
};

loadPDF("comic_pdf/TESTING_PDF.pdf");

// fuckin hell... that took FOREVER to get working