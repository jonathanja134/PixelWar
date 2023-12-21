//---- 1/ Definition Secton ----//

const canvasEl = document.querySelector("canvas");
const canvas= document.getElementById("canvas");
const container=document.getElementById("Container");
const ctx = canvasEl.getContext("2d");
const gridCtx = canvasEl.getContext('2d');
// Define the dimensions of the canvas and pixel size
const canvasWidth = 1600;
const canvasHeight = 1600;
const pixelSize = 10;
const colMax = canvasWidth / pixelSize;
const rowMax = canvasHeight / pixelSize;
//Creation of the list that will be use to generate the color choice section
const colorList = [
  'black','white','red', 'orange', 'yellow', '#cb6e00', '#0cd78d',
  'lightgreen', 'cyan', '#052be6', '#690be4', '#ce0ee0', '#c75884'];

let currentColorChoice = 0;

document.querySelector("html").addEventListener("wheel", function (e) {
  e.preventDefault();
}, { passive: false });
//---- 2/ creation of the color Toolbar ----//
i=0;
colorList.forEach(color => {
  //Using the ColorList we generate the <div>
  const colorItem = document.createElement('div');
  colorItem.style.backgroundColor = color;
  colorItem.setAttribute('class', 'resizeToolBlock');
  i++;
  colorChoice.appendChild(colorItem);

  colorItem.addEventListener('click', () => {
        currentColorChoice = color;
        ctx.fillStyle = currentColorChoice; // Update the drawing color

    colorChoice.querySelectorAll('div').forEach(item => {
        item.innerHTML = ""; // Clear the innerHTML of each color item
      });
    colorItem.innerHTML = '<i id="pen" class="fa-solid fa-pen"></i>' // actve the innerHTML for the selected color
    console.log(colorItem.style.backgroundColor)
    if (colorItem.style.backgroundColor === "black" || colorItem.style.backgroundColor === "rgb(5, 43, 230)" || colorItem.style.backgroundColor === "rgb(105, 11, 228)") {
      pen.setAttribute("class"," fa-solid fa-pen whitePen");
    }
  });
});

//---- 3/ creation of the Canva Support ----//

const firstDrawCanva = () => {
  canvasEl.width = canvasWidth;
  canvasEl.height = canvasHeight;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);//Draw the whole canva 
  drawPixel(canvasWidth, canvasHeight, pixelSize);
};

//---- 4/ creation of the Grid ----//

function drawGrids(ctx,canvasWidth, canvasHeight, pixelSize){
  ctx.beginPath()
  ctx.strokeStyle ="#c9cdcf"
//loop for height grid line
  for(let i = 0;i< colMax;i++){
    ctx.moveTo(i* pixelSize,0)
    ctx.lineTo(i * pixelSize, canvasHeight)
  }
//loop for Width grid line
  for(let i = 0;i< rowMax;i++){
    ctx.moveTo(0 , i* pixelSize)
    ctx.lineTo(canvasWidth ,i * pixelSize)
  }
  ctx.stroke()
}

// ----- 5/ PixeData Array initialisation ----- // 

//create an array
const pixelData = new Array(rowMax);
// Make the array 2D to store pixel data
for (let rowIndex = 0; rowIndex < rowMax; rowIndex++) {
  pixelData[rowIndex] = new Array(colMax).fill('null');
}
//----6/ creation of the Pixel Board with the real Pixel----//

const drawPixel = ( pixelSize) => {
  for (let rowIndex = 0; rowIndex < rowMax; rowIndex++) {
    for (let colIndex = 0; colIndex < colMax; colIndex++) {
      // Generate the color background for the canvas (you can use any color representation)
      const colorCanvas = 'white';
      // Assign the color to all the pixel
      pixelData[rowIndex][colIndex] = colorCanvas;
    // Replace pixelData with the actual pixel data array
    if(pixelData[rowIndex][colIndex] !== null ) {
        ctx.fillStyle = pixelData[rowIndex][colIndex];
        ctx.fillRect(colIndex * pixelSize,rowIndex * pixelSize,pixelSize,pixelSize);
     }
    }
  }
};

//---- 7/ Creation of the OnClick function that change the pixel color ----//

const onClickPixel = (canvasEl, pixelSize,e) => {
  canvasEl.addEventListener("contextmenu", (event) => {
    panning =true
    event.preventDefault();
    const colIndex = Math.floor(event.offsetX / pixelSize);// get the Y axis index
    const rowIndex = Math.floor(event.offsetY / pixelSize);// get the X axis index

    if (pixelData[rowIndex][colIndex] !== null) {
      createPixel(rowIndex,colIndex,currentColorChoice)
      }

    const pixel = {colIndex,rowIndex, color: currentColorChoice}

    let pixelRef = db.collection('pixel').doc(`pixel :${pixel.colIndex}-${pixel.rowIndex}`)
    pixelRef.set(pixel, {merge: true})
  });
};

function createPixel(rowIndex,colIndex,color)
{
  if ( panning !=false ){
  ctx.beginPath();
  ctx.fillStyle = color; 
  ctx.fillRect(colIndex * pixelSize, rowIndex * pixelSize,pixelSize, pixelSize);
  drawGrids(ctx,canvasWidth, canvasHeight, pixelSize);}
}

//--------------- 8/ We Run all Function --------------// 

firstDrawCanva();
onClickPixel(canvasEl, pixelSize);
drawGrids(gridCtx, canvasEl.width, canvasEl.height, pixelSize, pixelSize);

// --------------------- 9/ ZOOM and SCROLL---------------------------//

const view = (() => {
  const matrix = [1, 0, 0, 1, 0, 0]; // current view transform
  var m = matrix;             // alias 
  var scale = 1;              // current scale
  const pos = { x: 0, y: 0 }; // current position of origin
  var dirty = true;
  const API = {
    applyTo(el) {
      if (dirty) { this.update() }
      el.style.transform = `matrix(${m[0]},${m[1]},${m[2]},${m[3]},${m[4]},${m[5]})`;
    },
    update() {
      dirty = false;
      m[3] = m[0] = scale;
      m[2] = m[1] = 0;
      m[4] = pos.x;
      m[5] = pos.y;
    },
    pan(amount) {
      if (dirty) { this.update() }
       pos.x += amount.x;
       pos.y += amount.y;
       dirty = true;
    },
    scaleAt(at, amount) { // at in screen coords
      if (dirty) { this.update() }
      scale *= amount;
      pos.x = at.x - (at.x - pos.x) * amount;
      pos.y = at.y - (at.y - pos.y) * amount;
      dirty = true;
    },
  };
  return API;
})();


container.addEventListener("mousemove", mouseEvent, {passive: false});
container.addEventListener("mousedown", mouseEvent, {passive: false});
container.addEventListener("mouseup", mouseEvent, {passive: false});
container.addEventListener("mouseout", mouseEvent, {passive: false});
container.addEventListener("wheel", mouseWheelEvent, {passive: false});

const mouse = {x: 0, y: 0, oldX: 0, oldY: 0, button: false};
let panning = Boolean;
let multiplicator=2.55;



function mouseEvent(event) {
   
    if (event.type === "mousedown" && event.button !== 2 && event.type !== "contextmenu") {
      mouse.button = true;
      panning = false}
    if (event.type === "contextmenu") {mouse.button = false}
    if (event.type === "mouseup" || event.type === "mouseout") { mouse.button = false ;canvasEl.style.cursor = "crosshair";}
    if (window.location.href=="http://127.0.0.1:5500/Front-end/HTML/FullSizePage.html"){multiplicator=1.1;}
    mouse.oldX = mouse.x;
    mouse.oldY = mouse.y;
    mouse.x = event.pageX*multiplicator;
    mouse.y = event.pageY*multiplicator;
    if(mouse.button) { // pan
      canvasEl.style.cursor = "grabbing";
      view.pan({x: mouse.x - mouse.oldX, y: mouse.y - mouse.oldY});
        view.applyTo(canvas);
       
    }
    
    event.preventDefault();
}
function mouseWheelEvent(event) {
    const x = event.pageX - (canvasWidth / 2);
    const y = event.pageY - (canvasHeight / 2);
    if (event.deltaY < 0) { 
        view.scaleAt({x, y}, 1.05);
        view.applyTo(canvas);
    } else { 
        view.scaleAt({x, y}, 1 / 1.05);
        view.applyTo(canvas);
    }
    event.preventDefault();
}

