// URL ke PDF Anda
const pdfUrl = './jenis_Jenis_komputer.pdf'; // Ganti dengan lokasi file PDF Anda

// Pengaturan
const scale = 1.5; // Skala tampilan PDF

// Element canvas
const canvas = document.getElementById('pdfRenderer');
const context = canvas.getContext('2d');

// Pengaturan untuk PDF.js
let pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null;

// Fungsi untuk memuat PDF
const renderPage = (num) => {
    pageRendering = true;

    pdfDoc.getPage(num).then((page) => {
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    // Memperbarui informasi halaman
    document.getElementById('page_num').textContent = pageNum;
};

// Fungsi untuk memuat PDF menggunakan PDF.js
pdfjsLib.getDocument(pdfUrl).promise.then((pdfDoc_) => {
    pdfDoc = pdfDoc_;
    document.getElementById('page_count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
});

// Fungsi navigasi halaman
const queueRenderPage = (num) => {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
};

const onPrevPage = () => {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
};

const onNextPage = () => {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
};

// Menambahkan event listener untuk navigasi halaman
document.getElementById('prev_page').addEventListener('click', onPrevPage);
document.getElementById('next_page').addEventListener('click', onNextPage);
