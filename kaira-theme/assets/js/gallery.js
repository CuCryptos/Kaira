document.addEventListener('DOMContentLoaded', function () {
    // Filter buttons (gallery page)
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
    var lightboxPrev = lightbox.querySelector('.kaira-lightbox-prev');
    var lightboxNext = lightbox.querySelector('.kaira-lightbox-next');
    var lightboxCounter = lightbox.querySelector('.kaira-lightbox-counter');
    var lastFocusedItem = null;

    // Active grid state for navigation
    var activeGridFigures = [];
    var activeGridIndex = 0;

    function openLightbox(img, figures, index) {
        if (!img) return;
        lightboxImg.src = img.dataset.full || img.src;
        lightboxImg.alt = img.alt;
        activeGridFigures = figures || [];
        activeGridIndex = index || 0;
        updateNav();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    }

    function updateNav() {
        var hasNav = activeGridFigures.length > 1;
        if (lightboxPrev) lightboxPrev.style.display = hasNav ? '' : 'none';
        if (lightboxNext) lightboxNext.style.display = hasNav ? '' : 'none';
        if (lightboxCounter) {
            lightboxCounter.style.display = hasNav ? '' : 'none';
            lightboxCounter.textContent = (activeGridIndex + 1) + ' / ' + activeGridFigures.length;
        }
    }

    function showImage(index) {
        if (!activeGridFigures.length) return;
        activeGridIndex = (index + activeGridFigures.length) % activeGridFigures.length;
        var img = activeGridFigures[activeGridIndex].querySelector('img');
        if (img) {
            lightboxImg.src = img.dataset.full || img.src;
            lightboxImg.alt = img.alt;
        }
        updateNav();
    }

    // Gallery page items (single image, no nav)
    galleryItems.forEach(function (item) {
        item.addEventListener('click', function () {
            var img = this.querySelector('img');
            lastFocusedItem = this;
            openLightbox(img, [], 0);
        });
    });

    // Post image grids (multi-image with nav)
    var gridContainers = document.querySelectorAll('.kaira-image-grid[data-lightbox]');
    gridContainers.forEach(function (grid) {
        var figures = Array.from(grid.querySelectorAll('figure'));
        figures.forEach(function (fig, index) {
            fig.addEventListener('click', function () {
                var img = this.querySelector('img');
                lastFocusedItem = this;
                openLightbox(img, figures, index);
            });
        });
    });

    // Navigation
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function (e) {
            e.stopPropagation();
            showImage(activeGridIndex - 1);
        });
    }
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function (e) {
            e.stopPropagation();
            showImage(activeGridIndex + 1);
        });
    }

    // Close
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
        if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) showImage(activeGridIndex - 1);
        if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) showImage(activeGridIndex + 1);
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        activeGridFigures = [];
        if (lastFocusedItem) {
            lastFocusedItem.focus();
            lastFocusedItem = null;
        }
    }
});
