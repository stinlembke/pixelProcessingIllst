const body = document.querySelector('body');
const canvas = document.querySelector("canvas");
const cxt = canvas.getContext("2d");

let bodyHeight;

let currentColor;

let pxScale = window.devicePixelRatio;

const image = document.querySelector("img");
let imageData;
let imgScale = 16;
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
  cxt.lineWidth = 1.5;
  cxt.ellipse(shapeX,shapeY, radius,radius, 0,0, Math.PI*2);
  // cxt.ellipse(shapeX+size,shapeY, radius,radius, 0,0, Math.PI*2);
  cxt.ellipse(shapeX+size,shapeY-size, radius,radius, 0,0, Math.PI*2);
  cxt.ellipse(shapeX+size,shapeY+size, radius,radius, 0,0, Math.PI*2);
  cxt.ellipse(shapeX+(size*2),shapeY, radius,radius, 0,0, Math.PI*2);
  cxt.stroke();
  cxt.closePath();
}


//imgScale changes based on how far down the user has scrolled
// const scrollingMotifTransform = (e) => {
//   console.log('scrolly is:', window.scrollY, 'full height is:', bodyHeight);
//   // if(window.scrollY>=0 && window.scrollY<=bodyHeight/6){
//   //   imgScale = 20;
//   // } else if (window.scrollY>bodyHeight/6 && window.scrollY<=bodyHeight/4){
//   //   imgScale = 15;
//   // } else if (window.scrollY>bodyHeight/4 && window.scrollY<=bodyHeight/2){
//   //   imgScale = 10;
//   // } else {
//   //   imgScale = 5;
//   // }
//   imgScale = Math.max(3, 40 - window.scrollY / 70);
//   motifSize = imgScale / 3.5;
// }

function draw() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    const scaledDownImgWidth = (window.innerHeight / imgScale) * (image.width / image.height);
  
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
  
    motifCountX = Math.floor(scaledDownImgWidth);
  
    const redrawnImgWidth = motifCountX * (motifSize * 3.5);
  
    if (window.innerHeight < 450) {
      motifSize = window.innerHeight / motifCountX / 3.5;
      motifCountX = Math.floor(window.innerHeight / (motifSize * 3.5));
    }
  
    canvas.width = redrawnImgWidth;
    canvas.width.style = redrawnImgWidth + 'px';

    const canvasRect = canvas.getBoundingClientRect();
    const canvasX = mouseX - canvasRect.left;
    const canvasY = mouseY - canvasRect.top;
  
    for (let y = 0; y < imageData.height; y++) {
      for (let x = 0; x < motifCountX; x++) {
        const index = (x + y * imageData.width) * 4;
  
        const r = imageData.data[index];
        const g = imageData.data[index + 1];
        const b = imageData.data[index + 2];
  
        currentColor = `rgb(${r},${g},${b})`;
        cxt.fillStyle = currentColor;
        const shapeX = x * imgScale + (motifSize * 2);
        const shapeY = y * imgScale;
  
        const isPermanent = permanentPixels.some(([px, py]) => px === shapeX && py === shapeY);
        if (isPermanent) {
          circlePattern(shapeX, shapeY, motifSize, motifSize);
        } else {
          const distance = Math.sqrt(Math.pow(shapeX - canvasX, 2) + Math.pow(shapeY - canvasY, 2));
          if (distance < motifSize) {
            permanentPixels.push([shapeX, shapeY]);
          }
        }
      }
    }
  }

let mouseX;
let mouseY;

window.addEventListener('pointermove', (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  draw();
  console.log('moving!');
});

window.addEventListener('touchmove', (e) => {
  if (isDrawing) {
    handleTouch(e);
  }
});

window.addEventListener('touchend', () => {
  isDrawing = false;
});

function handleTouch(e) {
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
  draw();
}

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