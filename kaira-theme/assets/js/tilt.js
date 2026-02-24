/**
 * Kaira 3D Tilt Effect — perspective + light reflection
 */
(function () {
	'use strict';

	if ('ontouchstart' in window) return;

	document.addEventListener('DOMContentLoaded', function () {
		var tiltElements = document.querySelectorAll('.kaira-tilt');
		var MAX_TILT = 5;

		tiltElements.forEach(function (el) {
			var inner = el.querySelector('.kaira-tilt-inner') || el;
			var reflection = el.querySelector('.kaira-tilt-reflection');

			el.addEventListener('mousemove', function (e) {
				var rect = el.getBoundingClientRect();
				var x = (e.clientX - rect.left) / rect.width;
				var y = (e.clientY - rect.top) / rect.height;

				var rotateX = (0.5 - y) * MAX_TILT;
				var rotateY = (x - 0.5) * MAX_TILT;

				inner.style.transform = 'rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';

				if (reflection) {
					reflection.style.background = 'linear-gradient(' +
						(105 + rotateY * 10) + 'deg, ' +
						'transparent 40%, rgba(255,255,255,0.04) 45%, transparent 50%)';
				}
			});

			el.addEventListener('mouseleave', function () {
				inner.style.transform = 'rotateX(0) rotateY(0)';
			});
		});
	});
})();
