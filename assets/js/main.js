/**
 * Kaira Theme v2.0 — Main JS
 *
 * Handles: frosted glass header, scroll indicator, ambient glow,
 * scroll-skew effect, back-to-top, and IntersectionObserver fallback.
 */
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var header = document.querySelector('.kaira-header');
		var scrollIndicator = document.querySelector('.kaira-scroll-indicator');
		var hero = document.querySelector('.kaira-hero');
		var isHomepage = !!document.querySelector('.kaira-hero-home');
		var ambientGlow = null;

		// --- Create ambient glow element ---
		if (!('ontouchstart' in window)) {
			ambientGlow = document.createElement('div');
			ambientGlow.className = 'kaira-ambient-glow';
			document.body.appendChild(ambientGlow);

			document.addEventListener('mousemove', function (e) {
				ambientGlow.style.left = e.clientX + 'px';
				ambientGlow.style.top = e.clientY + 'px';
			});

			var heroSection = document.querySelector('.kaira-hero');
			if (heroSection) {
				var glowObserver = new IntersectionObserver(function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							ambientGlow.classList.add('active');
						} else {
							ambientGlow.classList.remove('active');
						}
					});
				}, { threshold: 0.3 });
				glowObserver.observe(heroSection);
			}
		}

		// --- Frosted Glass Header ---
		if (header) {
			var ticking = false;
			var isScrolling = false;
			var scrollTimer = null;
			var skewElements = document.querySelectorAll('.kaira-scroll-skew');

			window.addEventListener('scroll', function () {
				if (ticking) return;
				ticking = true;

				if (!isScrolling) {
					isScrolling = true;
					skewElements.forEach(function (el) {
						el.classList.add('is-scrolling');
					});
				}
				clearTimeout(scrollTimer);
				scrollTimer = setTimeout(function () {
					isScrolling = false;
					skewElements.forEach(function (el) {
						el.classList.remove('is-scrolling');
					});
				}, 150);

				requestAnimationFrame(function () {
					var scrollY = window.scrollY;

					if (isHomepage) {
						var threshold = window.innerHeight * 0.9;
						header.classList.toggle('scrolled', scrollY > threshold);
					} else {
						var heroBottom = hero ? hero.offsetHeight : 50;
						header.classList.toggle('scrolled', scrollY > heroBottom);
					}

					if (scrollIndicator) {
						scrollIndicator.classList.toggle('hidden', scrollY > 100);
					}

					ticking = false;
				});
			}, { passive: true });
		}

		// --- Back to Top ---
		var backToTop = document.querySelector('.kaira-back-to-top');
		if (backToTop) {
			backToTop.addEventListener('click', function (e) {
				e.preventDefault();
				window.scrollTo({ top: 0, behavior: 'smooth' });
			});
		}

		// --- Fallback: IntersectionObserver for reveal animations ---
		if (!CSS.supports('animation-timeline', 'view()')) {
			var revealElements = document.querySelectorAll('.kaira-reveal');
			if (revealElements.length && 'IntersectionObserver' in window) {
				var observer = new IntersectionObserver(function (entries) {
					entries.forEach(function (entry) {
						if (entry.isIntersecting) {
							entry.target.classList.add('visible');
							observer.unobserve(entry.target);
						}
					});
				}, { threshold: 0.1 });

				revealElements.forEach(function (el) {
					observer.observe(el);
				});
			}
		}
	});
})();
