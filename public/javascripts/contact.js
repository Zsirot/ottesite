const contactForm = document.querySelector('.contact-form');
const hiddenSubmit = document.querySelector('.hidden-submit')
const shownSubmit = document.querySelector('.shown-submit')

shownSubmit.addEventListener('click', function () {
    hiddenSubmit.click()
})

function persistInput(input) {
    let key = "input-" + input.id;
    let storedValue = localStorage.getItem(key);
    if (storedValue)
        input.value = storedValue;

    input.addEventListener('input', function () {
        localStorage.setItem(key, input.value);
    });
}
const successFlash = document.getElementById('success-present')
if (successFlash === null) { //if flash success message is not present, refill the fields
    persistInput(document.getElementById("name"));
    persistInput(document.getElementById("email"));
    persistInput(document.getElementById("phone"));
    persistInput(document.getElementById("subject"));
    persistInput(document.getElementById("message"));
}


let lastTop = sessionStorage.getItem("sidebar-scroll");
var scrollOptions = {
    left: 0,
    top: lastTop,
    behavior: 'auto'
}

if (lastTop !== null) {
    window.scroll(scrollOptions)
}

let scrollPosition = null
window.addEventListener('beforeunload', () => {
    scrollPosition = document.documentElement.scrollTop //on submit, define scroll position as current
    sessionStorage.setItem("sidebar-scroll", scrollPosition); ///place that postion in the localstorage

})




