const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closePopup');

window.addEventListener('DOMContentLoaded', () => {
    overlay.classList.add('show');
});

closeBtn.addEventListener('click', () => {
    overlay.classList.remove('show');
});

overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
        overlay.classList.remove('show');
    }
});
