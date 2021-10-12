const john = document.querySelector('.john')
const scrollDown = document.querySelector('.scrollDown')


scrollDown.addEventListener('click', function () {
    john.scrollIntoView(true)
})
