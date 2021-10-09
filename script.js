const welcomeHeader = document.querySelector('.welcomeHeader')
const scrollDown = document.querySelector('.scrollDown')


scrollDown.addEventListener('click', function () {
    welcomeHeader.scrollIntoView(true)
})
