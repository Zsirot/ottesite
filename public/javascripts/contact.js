const contactForm = document.querySelector('.contact-form');
const hiddenSubmit = document.querySelector('.hidden-submit')
const shownSubmit = document.querySelector('.shown-submit')

shownSubmit.addEventListener('click', function () {
    hiddenSubmit.click()
})

function persistInput(input) {
    let key = "input-" + input.id;
    let storedValue = localStorage.getItem(key);
    console.log(storedValue)
    if (storedValue)
        input.value = storedValue;

    input.addEventListener('input', function () {
        localStorage.setItem(key, input.value);
    });
}

persistInput(document.getElementById("name"));
persistInput(document.getElementById("email"));
persistInput(document.getElementById("phone"));
persistInput(document.getElementById("subject"));
persistInput(document.getElementById("message"));



