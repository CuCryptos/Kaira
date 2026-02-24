document.addEventListener('DOMContentLoaded', function () {
    // Filter buttons
    var filterBtns = document.querySelectorAll('.kaira-filter-btn');
    var galleryItems = document.querySelectorAll('.kaira-gallery-item');

    filterBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var filter = this.getAttribute('data-filter');
            filterBtns.forEach(function (b) { b.classList.remove('active'); });
            this.classList.add('active');
            galleryItems.forEach(function (item) {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Lightbox
    var lightbox = document.getElementById('kaira-lightbox');
    if (!lightbox) return;
    var lightboxImg = lightbox.querySelector('img');
    var lightboxClose = lightbox.querySelector('.kaira-lightbox-close');

    galleryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var img = this.querySelector('img');
            if (!img) return;
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
});
