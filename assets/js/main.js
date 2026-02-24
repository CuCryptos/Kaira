/**
 * Kaira Theme — Main JS
 * Handles scroll animations and sticky header.
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        // --- Sticky Header ---
        var header = document.querySelector('.kaira-header');
        if (header) {
            window.addEventListener('scroll', function () {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }, { passive: true });
        }

        // --- Scroll Fade-In Animations ---
        var fadeElements = document.querySelectorAll('.kaira-fade-in');
        if (fadeElements.length && 'IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            fadeElements.forEach(function (el) {
                observer.observe(el);
            });
        }
    });
})();
