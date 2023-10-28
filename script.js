const canvasEl = document.querySelector("canvas");
const ctx = canvasEl.getContext("2d");
const gridCtx = canvasEl.getContext('2d');

// Define the dimensions of the canvas and pixel size
const canvasWidth = 1600;
const canvasHeight = 1600;
const pixelSize = 10;
// Create an empty 2D array to store pixel data
const pixelData = new Array(canvasHeight / pixelSize);
let currentColorChoice = null;

// Your web app's Firebase configuration
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

const colorList = [
  'red', 'orange', 'yellow', '#cb6e00', '#0cd78d', 'cyan', '#052be6', '#690be4', '#ce0ee0', '#c75884'
];
//creation of the color tool 
colorList.forEach(color => {
  const colorItem = document.createElement('div');
  colorItem.style.backgroundColor = color;
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

colorSelector.addEventListener('input', () => { // Use 'input' event for color inputs
    currentColorChoice = colorSelector.value;
    ctx.fillStyle = currentColorChoice;

    colorSelector.style.backgroundColor = currentColorChoice;

    colorChoice.querySelectorAll('div').forEach(item => {
        item.innerHTML = ''; // Clear the innerHTML of each color item
        });
        colorSelector.innerHTML = '<i class="fa-solid fa-pen"></i>'
    });

function drawGrids(ctx,canvasWidth, canvasHeight, pixelSize, pixelSize){
      ctx.beginPath()
      ctx.strokeStyle ="#ccc"
    
      for(let i = 0;i< canvasWidth;i++){
        ctx.moveTo(i* pixelSize,0)
        ctx.lineTo(i * pixelSize, canvasHeight)
      }
      for(let i = 0;i< canvasHeight;i++){
        ctx.moveTo(0 , i* pixelSize)
        ctx.lineTo(canvasWidth ,i * pixelSize)
      }
      ctx.stroke()
    }


const firstDrawPixel = () => {
  canvasEl.width = canvasWidth;
  canvasEl.height = canvasHeight;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  drawPixel(canvasWidth, canvasHeight, pixelSize);
};

const drawPixel = (canvasWidth, canvasHeight, pixelSize) => {
  const colMax = canvasWidth / pixelSize;
  const rowMax = canvasHeight / pixelSize;

  for (let rowIndex = 0; rowIndex < rowMax; rowIndex++) {
    for (let colIndex = 0; colIndex < colMax; colIndex++) {
      // Replace pixelData with the actual pixel data array
      if (pixelData[rowIndex][colIndex] !== null) {
        ctx.fillStyle = pixelData[rowIndex][colIndex];
        ctx.fillRect(
          colIndex * pixelSize,
          rowIndex * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
  }
};



const onClickPixel = (canvasEl, pixelSize) => {
  canvasEl.addEventListener("click", (event) => {
    const colIndex = Math.floor(event.offsetX / pixelSize);
    const rowIndex = Math.floor(event.offsetY / pixelSize);
    
    if (pixelData[rowIndex][colIndex] !== null) {
      ctx.fillStyle = currentColorChoice;
      ctx.fillRect(colIndex * pixelSize,rowIndex * pixelSize,pixelSize,pixelSize);}

    const pixel = {colIndex,rowIndex, color: currentColorChoice}
    
    let pixelRef = db.collection('pixel').doc(`pixel :${pixel.colIndex}-${pixel.rowIndex}`)
    pixelRef.set(pixel, {merge: true})
  });
};

            // -----   Board Generation ----- // 

for (let rowIndex = 0; rowIndex < canvasHeight / pixelSize; rowIndex++) {
  pixelData[rowIndex] = new Array(canvasWidth / pixelSize).fill(null);
}
// Populate the pixel data with colors (example)
for (let rowIndex = 0; rowIndex < canvasHeight / pixelSize; rowIndex++) {
  for (let colIndex = 0; colIndex < canvasWidth / pixelSize; colIndex++) {
    // Generate the color background for the canva (you can use any color representation)
    const ColorCanva = 'white'
    // Assign the color to all the pixel
    pixelData[rowIndex][colIndex] = ColorCanva;
  }
}

firstDrawPixel();
drawGrids(gridCtx, canvasEl.width, canvasEl.height, pixelSize, pixelSize);
onClickPixel(canvasEl, pixelSize);


db.collection('pixel').onSnapshot(function(querySnapshot){
  querySnapshot.docChanges().forEach(function(change){
    console.log(change.doc.data())
    const {rowIndex,colIndex,color} = change.doc.data()
    createPixel(rowIndex,colIndex,color)
  })
})

function createPixel(rowIndex,colIndex,color){

  ctx.beginPath();
  ctx.fillStyle = color; 
  ctx.fillRect(
    colIndex * pixelSize,
    rowIndex * pixelSize,
    pixelSize,
    pixelSize
  );

  }
