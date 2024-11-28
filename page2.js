const body = document.querySelector('body');
const canvas = document.querySelector("canvas");
const cxt = canvas.getContext("2d");

let bodyHeight;

let currentColor;

let pxScale = window.devicePixelRatio;

let image = document.querySelector("#defaultImg");
const mobileImg = document.getElementById('mobileImg');
let imgScale = 40;
let motifSize = imgScale / 3.5;
const standarddMotifSize = motifSize;

function setup() {
  // Set canvas width & height 
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if(canvas.width<=500){
    image = mobileImg;
    console.log('setup if statment working?')
  }

  cxt.scale(pxScale, pxScale);

  motifSize = standarddMotifSize;
  bodyHeight = body.offsetHeight;
}

function diamondShape(shapeX, shapeY, size) {
  // top diamond
  cxt.beginPath();
  cxt.strokeStyle = currentColor;
  cxt.lineWidth = 1.5;
  cxt.moveTo(shapeX, shapeY);
  cxt.lineTo(shapeX + size, shapeY + size);
  cxt.lineTo(shapeX, shapeY + size * 2);
  cxt.lineTo(shapeX - size, shapeY + size);
  cxt.lineTo(shapeX, shapeY);
  cxt.stroke();
  cxt.closePath();
}

function diamondPattern(shapeX, shapeY, size) {
  diamondShape(shapeX, shapeY, size);
  cxt.save();
  cxt.translate(0, size);
  diamondShape(shapeX, shapeY, size);
  cxt.restore();
  cxt.save();
  cxt.translate(size, size / 2);
  diamondShape(shapeX, shapeY, size);
  cxt.restore();
  cxt.save();
  cxt.translate(-size, size / 2);
  diamondShape(shapeX, shapeY, size);
  cxt.restore();
}

//imgScale changes based on how far down the user has scrolled
const scrollingMotifTransform = (e) => {
  console.log('scrolly is:', window.scrollY, 'full height is:', bodyHeight);
  imgScale = Math.max(3, 40 - window.scrollY / 70);
  motifSize = imgScale / 3.5;
}


function draw() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  cxt.scale(pxScale, pxScale);

  const scaledDownImgWidth = (window.innerHeight / imgScale) * (image.width / image.height);

  cxt.drawImage(
    image,
    0,
    0,
    scaledDownImgWidth,
    window.innerHeight / imgScale 
  );

  const imageData = cxt.getImageData(
    0,
    0,
    canvas.width / imgScale,
    canvas.height / imgScale
  );

  cxt.clearRect(0, 0, window.innerWidth, window.innerHeight);

  motifCountX = Math.floor(scaledDownImgWidth);
  console.log(scaledDownImgWidth, motifCountX, motifSize);
  const redrawnImgWidth = motifCountX * (motifSize * 3.5);
  // const remainingSpace = canvas.width - redrawnImgWidth;
  // const xPadding = remainingSpace / 2.8;

    if (window.innerHeight < 500) {
    motifSize = window.innerHeight / motifCountX / 3.5;
    redrawnImgWidth = window.innerHeight;
    motifCountX = Math.floor(redrawnImgWidth / (motifSize * 3.5));
    console.log('working!');
  }

  canvas.width = redrawnImgWidth;
  canvas.width.style = redrawnImgWidth + 'px';
  console.log(redrawnImgWidth);
  // const xPadding = (canvas.width/2)-(motifCountX*motifSize);
  // console.log(motifCountX*motifSize/2);


 //moving redrawn image over a bit
  // const xPadding = (canvas.width / 2) - (redrawnImgWidth);
  // REDRAWING IMAGE
  // motifSize = 5;
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
      diamondPattern(shapeX, shapeY, motifSize, motifSize);
    }
  }
}

window.addEventListener('scroll', () => {
  scrollingMotifTransform();
  draw();
  console.log('scrolling!');
});

window.addEventListener("load", () => {
  setup();
  if(window.innerHeight<=450){
    motifSize = motifSize/3;
  }
  draw();
});

window.addEventListener("resize", () => {
  setup();
  if(window.innerHeight<=450){
    motifSize = motifSize/3;
  }
  draw();
});
