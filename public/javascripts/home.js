const introContainer = document.querySelector('.intro-container');
const greenContainer = document.querySelector('.green-container');
const whiteContainer = document.querySelector('.white-container');
const scrollDown = document.querySelector('#scroll-1');
const scrollDown2 = document.querySelector('#scroll-2');
const scrollDown3 = document.querySelector('#scroll-3');


scrollDown.addEventListener('click', function () {
    introContainer.scrollIntoView(true)
})
scrollDown2.addEventListener('click', function () {
    greenContainer.scrollIntoView(true)
})
scrollDown3.addEventListener('click', function () {
    whiteContainer.scrollIntoView(true)
})
