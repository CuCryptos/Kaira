/**
 * Kaira Theme — Main JS
 * Handles frosted glass header, scroll indicator, and fade-in animations.
 */
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var header = document.querySelector('.kaira-header');
		var scrollIndicator = document.querySelector('.kaira-scroll-indicator');
		var hero = document.querySelector('.kaira-hero');
		var isHomepage = !!document.querySelector('.kaira-hero-home');

		// --- Frosted Glass Header ---
		if (header) {
			var ticking = false;

			window.addEventListener('scroll', function () {
				if (ticking) return;
				ticking = true;

				requestAnimationFrame(function () {
					var scrollY = window.scrollY;

					if (isHomepage) {
						// Homepage: transparent until 90% of viewport, then frosted glass
						var threshold = window.innerHeight * 0.9;
						if (scrollY > threshold) {
							header.classList.add('scrolled');
						} else {
							header.classList.remove('scrolled');
						}
					} else {
						// Other pages: frosted glass after scrolling past hero or 50px
						var heroBottom = hero ? hero.offsetHeight : 50;
						if (scrollY > heroBottom) {
							header.classList.add('scrolled');
						} else {
							header.classList.remove('scrolled');
						}
					}

					// Fade out scroll indicator on any scroll
					if (scrollIndicator && scrollY > 100) {
						scrollIndicator.classList.add('hidden');
					} else if (scrollIndicator) {
						scrollIndicator.classList.remove('hidden');
					}

					ticking = false;
				});
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
