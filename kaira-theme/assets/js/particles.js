/**
 * Kaira Particle System — Canvas-based gold particles
 * Features: depth simulation, cursor repulsion, mouse trail
 */
(function () {
	'use strict';

	var canvas, ctx, particles, mouse, animFrame, isActive;
	var PARTICLE_COUNT = 35;
	var REPEL_RADIUS = 150;
	var TRAIL_LIFETIME = 600;
	var trailParticles = [];

	function Particle(x, y, size, speed, depth) {
		this.x = x;
		this.y = y;
		this.baseX = x;
		this.baseY = y;
		this.size = size;
		this.speed = speed;
		this.depth = depth;
		this.angle = Math.random() * Math.PI * 2;
		this.drift = 0.3 + Math.random() * 0.5;
	}

	function TrailParticle(x, y) {
		this.x = x;
		this.y = y;
		this.size = 2 + Math.random() * 3;
		this.life = TRAIL_LIFETIME;
		this.maxLife = TRAIL_LIFETIME;
	}

	function init() {
		var container = document.querySelector('.kaira-particles-canvas');
		if (!container) return;
		if ('ontouchstart' in window) return;

		canvas = document.createElement('canvas');
		canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none';
		container.appendChild(canvas);

		ctx = canvas.getContext('2d');
		mouse = { x: -1000, y: -1000 };
		particles = [];
		isActive = true;

		resize();
		createParticles();

		container.parentElement.addEventListener('mousemove', function (e) {
			var rect = canvas.getBoundingClientRect();
			mouse.x = e.clientX - rect.left;
			mouse.y = e.clientY - rect.top;

			if (Math.random() > 0.6) {
				trailParticles.push(new TrailParticle(mouse.x, mouse.y));
			}
		});

		container.parentElement.addEventListener('mouseleave', function () {
			mouse.x = -1000;
			mouse.y = -1000;
		});

		window.addEventListener('resize', resize);

		var observer = new IntersectionObserver(function (entries) {
			isActive = entries[0].isIntersecting;
			if (isActive && !animFrame) loop();
		}, { threshold: 0.1 });
		observer.observe(container);

		loop();
	}

	function resize() {
		if (!canvas) return;
		var rect = canvas.parentElement.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
	}

	function createParticles() {
		particles = [];
		for (var i = 0; i < PARTICLE_COUNT; i++) {
			var depth = Math.random();
			particles.push(new Particle(
				Math.random() * canvas.width,
				Math.random() * canvas.height,
				2 + depth * 5,
				0.2 + Math.random() * 0.3,
				depth
			));
		}
	}

	function loop() {
		if (!isActive) { animFrame = null; return; }
		animFrame = requestAnimationFrame(loop);

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < particles.length; i++) {
			var p = particles[i];

			p.angle += 0.005 * p.speed;
			p.x = p.baseX + Math.sin(p.angle) * 30 * p.drift;
			p.y = p.baseY + Math.cos(p.angle * 0.7) * 20 * p.drift;

			p.baseY -= 0.1 * p.speed;
			if (p.baseY < -p.size) {
				p.baseY = canvas.height + p.size;
				p.baseX = Math.random() * canvas.width;
			}

			var dx = p.x - mouse.x;
			var dy = p.y - mouse.y;
			var dist = Math.sqrt(dx * dx + dy * dy);
			if (dist < REPEL_RADIUS) {
				var force = (1 - dist / REPEL_RADIUS) * 3;
				p.x += (dx / dist) * force;
				p.y += (dy / dist) * force;
			}

			var alpha = 0.08 + p.depth * 0.15;
			ctx.beginPath();
			ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(201, 168, 76, ' + alpha + ')';
			ctx.fill();

			if (p.depth > 0.6) {
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
				ctx.fillStyle = 'rgba(201, 168, 76, ' + (alpha * 0.3) + ')';
				ctx.fill();
			}
		}

		for (var j = trailParticles.length - 1; j >= 0; j--) {
			var tp = trailParticles[j];
			tp.life -= 16;
			if (tp.life <= 0) {
				trailParticles.splice(j, 1);
				continue;
			}
			var tAlpha = (tp.life / tp.maxLife) * 0.2;
			ctx.beginPath();
			ctx.arc(tp.x, tp.y, tp.size * (tp.life / tp.maxLife), 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(201, 168, 76, ' + tAlpha + ')';
			ctx.fill();
		}
	}

	document.addEventListener('DOMContentLoaded', init);
})();
