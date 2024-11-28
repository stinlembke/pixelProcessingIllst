const body = document.querySelector('body');
const canvas = document.querySelector("canvas");
const cxt = canvas.getContext("2d");

let bodyHeight;

let currentColor;

let pxScale = window.devicePixelRatio;

const image = document.querySelector("img");
let imageData;
let imgScale = 7;
let motifSize = imgScale / 3.5;
const standarddMotifSize = motifSize;

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
  cxt.lineWidth = 0.5;
  cxt.ellipse(shapeX,shapeY, radius,radius, 0,0, Math.PI*2);
  // cxt.ellipse(shapeX+size,shapeY, radius,radius, 0,0, Math.PI*2);
  cxt.ellipse(shapeX+size,shapeY-size, radius,radius, 0,0, Math.PI*2);
  cxt.ellipse(shapeX+size,shapeY+size, radius,radius, 0,0, Math.PI*2);
  cxt.ellipse(shapeX+(size*2),shapeY, radius,radius, 0,0, Math.PI*2);
  cxt.stroke();
  cxt.closePath();
}

// function diamondShape(shapeX, shapeY, size) {
//   // top diamond
//   cxt.beginPath();
//   cxt.strokeStyle = currentColor;
//   cxt.lineWidth = 1.5;
//   cxt.moveTo(shapeX, shapeY);
//   cxt.lineTo(shapeX + size, shapeY + size);
//   cxt.lineTo(shapeX, shapeY + size * 2);
//   cxt.lineTo(shapeX - size, shapeY + size);
//   cxt.lineTo(shapeX, shapeY);
//   cxt.stroke();
//   cxt.closePath();
// }

// function diamondPattern(shapeX, shapeY, size) {
//   diamondShape(shapeX, shapeY, size);
//   cxt.save();
//   cxt.translate(0, size);
//   diamondShape(shapeX, shapeY, size);
//   cxt.restore();
//   cxt.save();
//   cxt.translate(size, size / 2);
//   diamondShape(shapeX, shapeY, size);
//   cxt.restore();
//   cxt.save();
//   cxt.translate(-size, size / 2);
//   diamondShape(shapeX, shapeY, size);
//   cxt.restore();
// }

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
  // cxt.scale(pxScale, pxScale);

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

  cxt.clearRect(0, 0, window.innerWidth, window.innerHeight);

  motifCountX = Math.floor(scaledDownImgWidth);

  const redrawnImgWidth = motifCountX * (motifSize * 3.5);

  if (window.innerHeight < 450) {
    motifSize = window.innerHeight / motifCountX / 3.5;
    redrawnImgWidth = window.innerHeight;
    motifCountX = Math.floor(redrawnImgWidth / (motifSize * 3.5));
  }

  canvas.width = redrawnImgWidth;
  canvas.width.style = redrawnImgWidth + 'px';
  console.log(redrawnImgWidth);

  // REDRAWING IMAGE
  // motifSize = 5;
  for (let y = 0; y < imageData.height; y++) {
    for (let x = 0; x < motifCountX; x++) {
      const index = (x + y * imageData.width) * 4;

      const r = imageData.data[index];
      const g = imageData.data[index + 1];
      const b = imageData.data[index + 2];
      
      // motifSize-=0.001;

      currentColor = `rgb(${r},${g},${b})`;
      cxt.fillStyle = currentColor;
      const shapeX = x * imgScale + (motifSize * 2);
      const shapeY = y * imgScale;
      circlePattern(shapeX, shapeY, motifSize, motifSize);
    }
  }
  cxt.clearRect(0, 0, window.innerWidth, window.innerHeight);
  // if(redrawnImgWidth>window.innerWidth){
  //   cxt.scale(0.9,0.9);
  //  }
}

let animationRequestId;
let pixelsDrawn = 0;

function animateDraw(){
  animationRequestId = requestAnimationFrame(animateDraw);
  
  const scrollSpeed = 3;
  const startPixel = Math.floor(scrollY * scrollSpeed);
  const endPixel = Math.min(startPixel + 250, imageData.width * imageData.height); 

  for (let pixelsDrawn = startPixel; pixelsDrawn < endPixel; pixelsDrawn++){
    const y = Math.floor(pixelsDrawn / motifCountX);
    const x = pixelsDrawn % motifCountX;
    const index = (x + y * imageData.width) * 4;

    const r = imageData.data[index];
    const g = imageData.data[index + 1];
    const b = imageData.data[index + 2];

    currentColor = `rgb(${r},${g},${b})`;
    cxt.fillStyle = currentColor;
    const shapeX = x * imgScale + (motifSize * 2);
    const shapeY = y * imgScale;
    circlePattern(shapeX, shapeY, motifSize, motifSize);
  }
}

window.addEventListener('scroll', () => {
  animateDraw();
  console.log('scrolling!');
});

window.addEventListener("load", () => {
  setup();
  draw();
});

window.addEventListener("resize", () => {
  setup();
  draw();
});