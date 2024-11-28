const body = document.querySelector('body');
const canvas = document.querySelector("canvas");
const cxt = canvas.getContext("2d");

let bodyHeight;

let currentColor;

let pxScale = window.devicePixelRatio;

const image = document.querySelector("img");
let imageData;
let imgScale = 20;
let motifSize = imgScale / 3.5;
const standarddMotifSize = motifSize;
let permanentPixels = [];

function setup() {
  // Set canvas width & height 
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  cxt.scale(pxScale, pxScale);

  motifSize = standarddMotifSize;
  bodyHeight = body.offsetHeight;
}

function circlePattern(shapeX,shapeY, radius, size){
  cxt.beginPath();
  cxt.strokeStyle = currentColor;
  cxt.lineWidth = 2;
  cxt.ellipse(shapeX,shapeY, radius,radius, 0,0, Math.PI*2);
  // cxt.ellipse(shapeX+size,shapeY, radius,radius, 0,0, Math.PI*2);
  cxt.ellipse(shapeX+size,shapeY-size, radius,radius, 0,0, Math.PI*2);
  cxt.ellipse(shapeX+size,shapeY+size, radius,radius, 0,0, Math.PI*2);
  cxt.ellipse(shapeX+(size*2),shapeY, radius,radius, 0,0, Math.PI*2);
  cxt.stroke();
  cxt.closePath();
}

function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    const scaledDownImgWidth = (window.innerHeight / imgScale) * (image.width / image.height);
  
    motifCountX = Math.floor(scaledDownImgWidth);
  
    const redrawnImgWidth = motifCountX * (motifSize * 3.5);

    const redrawnImgOriginX = (canvas.width/2) - (redrawnImgWidth/2);
    console.log('origin x is:', redrawnImgOriginX);

    cxt.drawImage(
      image,
      0,
      0,
      scaledDownImgWidth,
      window.innerHeight / imgScale
    );
  
    imageData = cxt.getImageData(
      0,
      0,
      canvas.width / imgScale,
      canvas.height / imgScale
    );
  
    if (window.innerHeight < 450) {
      motifSize = window.innerHeight / motifCountX / 3.5;
      motifCountX = Math.floor(window.innerHeight / (motifSize * 3.5));
    }

    console.log('motifCountX', motifCountX);
  
    canvas.width = redrawnImgWidth;
    canvas.width.style = redrawnImgWidth + 'px';
  
    for (let y = 0; y < imageData.height; y++) {
      for (let x = redrawnImgOriginX; x <= redrawnImgOriginX+motifCountX; x++) {
        const index = (x + y * imageData.width) * 4;
  
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
  
        currentColor = `rgb(${r},${g},${b})`;
        cxt.fillStyle = currentColor;
        const shapeX = x * imgScale + (motifSize * 2);
        const shapeY = y * imgScale;
        console.log(shapeX, shapeY);
  
        const isPermanent = permanentPixels.some(([px, py]) => px === x && py === y);
        if (isPermanent) {
          circlePattern(shapeX, shapeY, motifSize, motifSize);
        } else {
          const distance = Math.sqrt(Math.pow(shapeX - mouseX, 2) + Math.pow(shapeY - mouseY, 2));
          if (distance < motifSize) {
            circlePattern(shapeX, shapeY, motifSize, motifSize);
            permanentPixels.push([shapeX, shapeY]);
          }
        }
      }
    }
  }

// let animationRequestId;
// let pixelsDrawn = 0;

// function animateDraw(){
//   animationRequestId = requestAnimationFrame(animateDraw);
  
//   const scrollSpeed = 3;
//   const startPixel = Math.floor(scrollY * scrollSpeed);
//   const endPixel = Math.min(startPixel + 250, imageData.width * imageData.height); 

//   for (let pixelsDrawn = startPixel; pixelsDrawn < endPixel; pixelsDrawn++){
//     const y = Math.floor(pixelsDrawn / motifCountX);
//     const x = pixelsDrawn % motifCountX;
//     const index = (x + y * imageData.width) * 4;

//     const r = imageData.data[index];
//     const g = imageData.data[index + 1];
//     const b = imageData.data[index + 2];

//     currentColor = `rgb(${r},${g},${b})`;
//     cxt.fillStyle = currentColor;
//     const shapeX = x * imgScale + (motifSize * 2);
//     const shapeY = y * imgScale;
//     circlePattern(shapeX, shapeY, motifSize, motifSize);
//   }
// }

let mouseX = 0;
let mouseY = 0;

window.addEventListener('pointermove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  draw();
  console.log('moving!');
});

function markPixelPermanently(x, y) {
    permanentPixels.push([x, y]);
  }

window.addEventListener("load", () => {
  setup();
  draw();
});

window.addEventListener("resize", () => {
  setup();
  draw();
});