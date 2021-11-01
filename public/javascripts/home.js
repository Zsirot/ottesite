const introContainer = document.querySelector('.intro-container')
const scrollDown = document.querySelector('.scrollDown')


scrollDown.addEventListener('click', function () {
    introContainer.scrollIntoView(true)
})
