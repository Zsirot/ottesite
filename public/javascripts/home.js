// Smooth-scroll any element carrying a [data-scroll-to] attribute to its target.
document.querySelectorAll('[data-scroll-to]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
        const target = document.querySelector(trigger.getAttribute('data-scroll-to'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// Scroll progress bar — only needed where CSS scroll-driven animations
// (animation-timeline: scroll()) aren't supported; otherwise CSS handles it.
(function () {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return;
    const cssDriven = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()');
    if (cssDriven) return;

    const update = function () {
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        const ratio = max > 0 ? el.scrollTop / max : 0;
        bar.style.transform = 'scaleX(' + ratio + ')';
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();
