/**
 * Kaira Split Text — character stagger animation
 */
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var splitElements = document.querySelectorAll('.kaira-split-text');

		splitElements.forEach(function (el) {
			var text = el.textContent;
			el.innerHTML = '';
			el.setAttribute('aria-label', text);

			for (var i = 0; i < text.length; i++) {
				var span = document.createElement('span');
				span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
				span.style.display = 'inline-block';
				span.style.opacity = '0';
				span.style.transform = 'translateY(20px)';
				span.style.animation = 'kaira-char-in 0.4s ease forwards';
				span.style.animationDelay = (i * 30) + 'ms';
				span.setAttribute('aria-hidden', 'true');
				el.appendChild(span);
			}
		});
	});
})();
