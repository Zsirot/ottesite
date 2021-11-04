const iframes = document.querySelectorAll('iframe');
const closeVideos = document.querySelectorAll('.close-video');
const thumbs = document.querySelectorAll('.thumb');



// for (let closeVideo of closeVideos) {
//     closeVideo.addEventListener('click', function () {
//         for (let iframe of iframes) {
//             iframe.src = iframe.src
//         }
//     })
// }

// const stopAllYouTubeVideos = () => {
//     const iframes = document.querySelectorAll('iframe');
//     Array.prototype.forEach.call(iframes, iframe => {
//         iframe.contentWindow.postMessage(JSON.stringify({
//             event: 'command',
//             func: 'stopVideo'
//         }), '*');
//     });
// }
// stopAllYouTubeVideos();