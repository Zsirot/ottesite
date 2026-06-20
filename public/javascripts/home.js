// Smooth-scroll any element carrying a [data-scroll-to] attribute to its target.
document.querySelectorAll('[data-scroll-to]').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
        const target = document.querySelector(trigger.getAttribute('data-scroll-to'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
