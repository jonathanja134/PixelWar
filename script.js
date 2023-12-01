//---- 1/ Definition Secton ----//

const canvasEl = document.querySelector("canvas");
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
  'red', 'orange', 'yellow', '#cb6e00', '#0cd78d', 'cyan', '#052be6', '#690be4', '#ce0ee0', '#c75884'];
let currentColorChoice = 0;

//---- 2/ Firebase configuration (to control the dataBase of pixel) ----//

const firebaseConfig = {
  apiKey: "AIzaSyCqcbO3hjGurUTvCiNDMWflF_KpAtobPuQ",
  authDomain: "pixelwars-19396.firebaseapp.com",
  projectId: "pixelwars-19396",
  storageBucket: "pixelwars-19396.appspot.com",
  messagingSenderId: "343637153226",
  appId: "1:343637153226:web:d316bd6ca67bd6ffb2ab33"
};

// Initialize Firebase and dataBase
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

//---- 3/ creation of the color Toolbar ----//

colorList.forEach(color => {
  //Using the ColorList we generate the <div>
  const colorItem = document.createElement('div');
  colorItem.style.backgroundColor = color;
  colorItem.setAttribute('class', 'resizeTool');
  colorChoice.appendChild(colorItem);
  
  colorItem.addEventListener('click', () => {
        currentColorChoice = color;
        ctx.fillStyle = currentColorChoice; // Update the drawing color

    colorChoice.querySelectorAll('div').forEach(item => {
        item.innerHTML = ""; // Clear the innerHTML of each color item
      });
    colorItem.innerHTML = '<i class="fa-solid fa-pen"></i>' // actve the innerHTML for the selected color
  });
});

// Create the ColorSelector for the Toolbar
/*
colorSelector.addEventListener('input', () => { // Use 'input' event for color inputs
    currentColorChoice = colorSelector.value;
    ctx.fillStyle = currentColorChoice;

    colorSelector.style.backgroundColor = currentColorChoice;

    colorChoice.querySelectorAll('div').forEach(item => {
        item.innerHTML = ''; // Clear the innerHTML of each color item
        });
        colorSelector.innerHTML = '<i class="fa-solid fa-pen"></i>'
    });
*/
//---- 4/ creation of the Canva Support ----//

const firstDrawCanva = () => {
  canvasEl.width = canvasWidth;
  canvasEl.height = canvasHeight;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);//Draw the whole canva 
  drawPixel(canvasWidth, canvasHeight, pixelSize);
};

//---- 5/ creation of the Grid ----//

function drawGrids(ctx,canvasWidth, canvasHeight, pixelSize, pixelSize){
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

const drawPixel = (canvasWidth, canvasHeight, pixelSize) => {
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

const onClickPixel = (canvasEl, pixelSize) => {

  canvasEl.addEventListener("click", (event) => {
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
}

          //---- 8/ We Run all Function ----// 

firstDrawCanva();
drawGrids(gridCtx, canvasEl.width, canvasEl.height, pixelSize, pixelSize);
onClickPixel(canvasEl, pixelSize);

          //---- 9/ Get already placed pixel  ----// 

db.collection('pixel').onSnapshot(function(querySnapshot){
  querySnapshot.docChanges().forEach(function(change){
    console.log(change.doc.data())
    const {rowIndex,colIndex,color} = change.doc.data()
    createPixel(rowIndex,colIndex,color)
  })
})
//---- Pulp fiction ----//

function shoot() {
	setTimeout(function(){ 
		$('.vincent').addClass( "pf-vincent-gun");
		$('.jules').addClass( "pf-jules-gun");
    
    // You ever read the Bible?
		setTimeout(bullet, 500);
		setTimeout(bullet, 1500);

		setTimeout(function(){ 
			$('.vincent').removeClass( "pf-vincent-gun");
			$('.jules').removeClass( "pf-jules-gun");

			shoot();

		}, 3000);
	}, 1000);
 }

function bullet(){
	$('.vincent').addClass( "pf-vincent-fire");
	$('.jules').addClass( "pf-jules-fire");

	setTimeout(function(){ 
		$('.vincent').removeClass( "pf-vincent-fire");
		$('.jules').removeClass( "pf-jules-fire");
	}, 500);
}
shoot();

window.addEventListener('resize', adjustDivSize);
window.addEventListener('load', adjustDivSize);

        function adjustDivSize() {
            const resizeTool = document.getElementsByClassName('resizeTool');
            const windowHeight = window.innerHeight;
            const newHeight = windowHeight * 0.035; // Ajustez selon vos besoins
            for (let i = 0; i < resizeTool.length; i++) {
              resizeTool[i].style.height = newHeight + 'px';
              resizeTool[i].style.width = newHeight + 'px';
          }

          const colorChoice = document.getElementById('colorChoice');
          const newRadius = (windowHeight *0.045 ); // Ajustez selon vos besoins
          colorChoice.style.borderRadius = newRadius + 'px';
        }
