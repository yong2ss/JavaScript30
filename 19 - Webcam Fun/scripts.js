const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video:true, audio:false})
            .then(localMediaStream => {
                console.log(localMediaStream);
                //video.src = window.URL.createObjectURL(localMediaStream);
                //아래로 문법이 바뀜
                video.srcObject = localMediaStream;
                video.play();
            })
            .catch(err => {
                console.error('OH NO!!!', err);
            });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        // take the pixels out
        let pixels = ctx.getImageData(0,0, width, height);
        // mess with them        
        //1. pixels = redEffect(pixels);
        /* 2.
        pixels = rgbSplit(pixels);
        ctx.globalAlpha = 0.1;
        */
        //3
        pixels = greenScreen(pixels);
        
        //put them back
        ctx.putImageData(pixels, 0, 0)
        
    }, 16);
    //console.log(width, heigth);
}

function takePhoto() {
    // played the sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    //console.log(data);
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="handsome man"/>`
    strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i+0] = pixels.data[i+0] + 100; //red
        pixels.data[i+1] = pixels.data[i+1] - 50; //greend
        pixels.data[i+2] = pixels.data[i+2] * 0.5;//blue

        //rgba로 데이터 4개당 한 픽셀로 보면된다
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i-150] = pixels.data[i+0] //red
        pixels.data[i+100] = pixels.data[i+1] //greend
        pixels.data[i-150] = pixels.data[i+2] //blue

        //rgba로 데이터 4개당 한 픽셀로 보면된다
    }
    return pixels;
}
n
function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }

    return pixels;
}


getVideo();

video.addEventListener('canplay', paintToCanvas);