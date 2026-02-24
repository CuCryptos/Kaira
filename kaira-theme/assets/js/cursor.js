/**
 * Kaira Custom Cursor — magnetic + grow effect
 */
(function () {
	'use strict';

	if ('ontouchstart' in window) return;

	document.addEventListener('DOMContentLoaded', function () {
		var cursor = document.createElement('div');
		cursor.className = 'kaira-cursor';
		document.body.appendChild(cursor);

		var cursorX = 0, cursorY = 0;
		var targetX = 0, targetY = 0;

		document.addEventListener('mousemove', function (e) {
			targetX = e.clientX;
			targetY = e.clientY;
		});

		var interactives = 'a, button, .kaira-card, .kaira-gallery-item, .wp-block-button__link, input';

		document.addEventListener('mouseover', function (e) {
			if (e.target.closest(interactives)) {
				cursor.classList.add('is-hovering');
			}
		});

		document.addEventListener('mouseout', function (e) {
			if (e.target.closest(interactives)) {
				cursor.classList.remove('is-hovering');
			}
		});

		function tick() {
			cursorX += (targetX - cursorX) * 0.15;
			cursorY += (targetY - cursorY) * 0.15;
			cursor.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px) translate(-50%, -50%)';
			requestAnimationFrame(tick);
		}

		tick();
	});
})();
