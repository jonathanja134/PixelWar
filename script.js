//---- 1/ Definition Secton ----//

const canvasEl = document.querySelector("canvas");
const canvas= document.getElementById("canvas");
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
  'black','white','red', 'orange', 'yellow', '#cb6e00', '#0cd78d','lightgreen', 'cyan', '#052be6', '#690be4', '#ce0ee0', '#c75884'];
let currentColorChoice = 0;

document.querySelector("html").addEventListener("wheel", function (e) {
  e.preventDefault();
}, { passive: false });
//---- 3/ creation of the color Toolbar ----//
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
    if(colorItem.style.backgroundColor === "black"|| colorItem[3]==='red'|| colorItem.style.backgroundColor === "#690be4"){
      pen.setAttribute("class"," fa-solid fa-pen whitePen");
    }
  });
});

//---- 4/ creation of the Canva Support ----//

const firstDrawCanva = () => {
  canvasEl.width = canvasWidth;
  canvasEl.height = canvasHeight;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);//Draw the whole canva 
  drawPixel(canvasWidth, canvasHeight, pixelSize);
};

//---- 5/ creation of the Grid ----//

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

// ----- 6/ PixeData Array initialisation ----- // 

//create an array
const pixelData = new Array(rowMax);
// Make the array 2D to store pixel data
for (let rowIndex = 0; rowIndex < rowMax; rowIndex++) {
  pixelData[rowIndex] = new Array(colMax).fill('null');
}
//---- 6/ creation of the Pixel Board with the real Pixel----//

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
  canvasEl.addEventListener("click", (event) => {
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
  ctx.beginPath();
  ctx.fillStyle = color; 
  ctx.fillRect(colIndex * pixelSize, rowIndex * pixelSize,pixelSize, pixelSize);
  drawGrids(ctx,canvasWidth, canvasHeight, pixelSize);
}

  //--------------- 8/ We Run all Function --------------// 

firstDrawCanva();
onClickPixel(canvasEl, pixelSize);
drawGrids(gridCtx, canvasEl.width, canvasEl.height, pixelSize, pixelSize);

  //------------ 9/ We rezise the color block -----------// 

window.addEventListener('resize', adjustDivSize);
window.addEventListener('load', adjustDivSize);

        function adjustDivSize() {
            const resizeTool = document.getElementsByClassName('resizeToolBlock');
            const windowHeight = window.innerHeight;
            const newHeight = windowHeight * 0.06; // Ajustez selon vos besoins
            for (let i = 0; i < resizeTool.length; i++) {
              resizeTool[i].style.height = newHeight + 'px';
              resizeTool[i].style.width = newHeight + 'px';
          }

          const colorChoice = document.getElementById('colorChoice');
          const newRadius = (windowHeight *0.035 ); // Ajustez selon vos besoins
          colorChoice.style.borderRadius = newRadius + 'px';
        }
// --------------------- 10/ ZOOM and SCROLL---------------------------//

    var scale = 1,
    panning = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 },
    zoom = document.getElementById("Container");

    canvasEl.addEventListener("contextmenu", function (e) {
      e.preventDefault();
  });
  
  function setTransform() {
    canvasEl.style.transform = "scale(" + scale + ") translate(" + pointX + "px, " + pointY + "px)";
  }
  
  zoom.onmousedown = function (e) {
    e.preventDefault();
    // Only start panning if the right mouse button is clicked
    if (e.button === 2) {
        start = { x: e.clientX - pointX, y: e.clientY - pointY };
        panning = true;
    }
};
  
  zoom.onmouseup = function () {
    panning = false;
  };
  
  zoom.onmousemove = function (e) {
   
    if (!panning) {
      return;
    }
    pointX = e.clientX - start.x;
    pointY = e.clientY - start.y;
    setTransform();
  };

  canvasEl.onwheel = function (e) {
    e.preventDefault();
    // Coordonnées de la souris par rapport au coin supérieur gauche du canvas
    var mouseX = e.clientX - canvasEl.getBoundingClientRect().right;
    console.log(mouseX)
    var mouseY = e.clientY - canvasEl.getBoundingClientRect().top;
    console.log(mouseY)
    var xs = (mouseX - pointX) / scale;
    var ys = (mouseY - pointY) / scale;
  
    var delta = e.wheelDelta ? e.wheelDelta : -e.deltaY;
    
    delta > 0 ? (scale *= 1.005) : (scale /= 1.005);
  
    // Ajuster les coordonnées de référence en fonction de la position de la souris
    pointX = mouseX - xs * scale;
    pointY = mouseY - ys * scale;
  
    setTransform();
  };
  
  zoom.addEventListener("mouseleave", function () {
    if (panning) {
      panning = false;
    }
  });
  
//-----------------------POP UP--------------------//

let PopupOkay = document.getElementById("Popup-Okay");
let PopupOverlay = document.getElementById("Popup-Overlay");

function OpenPopUp(){
  PopupOverlay.removeAttribute('class', 'close');
  PopupOverlay.setAttribute('class', 'open');
}

PopupOkay.addEventListener("click" , function (e) {
  PopupOverlay.removeAttribute('class', 'open');
  PopupOverlay.setAttribute('class', 'close');
});

toogle = document.getElementById("Popup-Okay");
menu = document.getElementById("Popup-Overlay");

toogle.addEventListener("click" , function () {
  menu.setAttribute('class', 'close');
});



//-------------Animation scale for the selected color--------------//

let resizeToolBlock = document.getElementsByClassName("resizeToolBlock");

// Loop through each element with the class "resizeToolBlock"
for (var i = 0; i < resizeToolBlock.length; i++) {
  // Add an event listener to each element
  resizeToolBlock[i].addEventListener("click", (function (index) {
    return function (e) {
      // Change the class for the clicked element
      resizeToolBlock[index].classList.add("color-Selected");
       for (var j = 0; j < resizeToolBlock.length; j++) {
         if (j !== index) {
           resizeToolBlock[j].classList.remove("color-Selected");
         }
       }
    };
  })(i));
}
//--------------------------------Open page function-------------------------------//

function allerAPage(nouvellePage) {
  window.location.href = nouvellePage + '.html';
}