const game = document.querySelector('#game'); // Creating the pixel war space
const colorChoice = document.querySelector('#colorChoice');
const colorSelector = document.getElementById('colorSelector')
const cursor = document.querySelector('#cursor')
const gridCellSize = 10

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqcbO3hjGurUTvCiNDMWflF_KpAtobPuQ",
  authDomain: "pixelwars-19396.firebaseapp.com",
  projectId: "pixelwars-19396",
  storageBucket: "pixelwars-19396.appspot.com",
  messagingSenderId: "343637153226",
  appId: "1:343637153226:web:d316bd6ca67bd6ffb2ab33"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()



game.width = 1200; // sizing the pixel war space
game.height = 600;

colorSelector.backgroundColor = colorSelector.value

let currentColorChoice = '#faf3e6'; // Default color set to the color of the background

const ctx = game.getContext('2d'); 
const gridCtx = game.getContext('2d');
ctx.fillStyle = currentColorChoice; // Set the initial color

const colorList = [
  'red', 'orange', 'yellow', '#cb6e00', '#0cd78d', 'cyan', '#052be6', '#690be4', '#ce0ee0', '#c75884'
];

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
    colorItem.innerHTML = '<i class="fa-solid fa-pen"></i>'

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
function createPixel(x,y,color){

  ctx.beginPath();
  ctx.fillStyle = color; 
  ctx.fillRect(x, y, gridCellSize, gridCellSize);

}

function addPixel(){ 
  const x = cursor.offsetLeft - game.getBoundingClientRect().left - window.scrollX;
  const y = cursor.offsetTop - game.getBoundingClientRect().top - window.scrollY;

createPixel(x,y,currentColorChoice)

  const pixel = {
    x,
    y,
    color: currentColorChoice
  }

  let pixelRef = db.collection('pixels').doc(`${pixel.x}-${pixel.y}`)
  pixelRef.set(pixel, {merge: true})

}



cursor.addEventListener('click', function (event) {
  addPixel()
});
 
game.addEventListener('click', function (event) {
  addPixel()
});



function drawGrids(ctx,width, height, cellWidth, cellHeight){
  ctx.beginPath()
  ctx.strokeStyle ="#ccc"

  for(let i = 0;i< width;i++){
    ctx.moveTo(i* cellWidth,0)
    ctx.lineTo(i * cellWidth, height)
  }
  for(let i = 0;i< height;i++){
    ctx.moveTo(0 , i* cellHeight)
    ctx.lineTo(width ,i * cellHeight)
  }
  ctx.stroke()
}
drawGrids(gridCtx, game.width,game.height,gridCellSize,gridCellSize)

game.addEventListener('mousemove',function(event){

  const cursorLeft = event.pageX -(cursor.offsetWidth/2)
  const cursorTop = event.pageY -(cursor.offsetHeight/2) 

  cursor.style.left = Math.floor(cursorLeft / gridCellSize) * gridCellSize + "px";
  cursor.style.top = Math.floor(cursorTop / gridCellSize) * gridCellSize + "px";
})

db.collection('pixels').onSnapshot(function(querySnapshot){
  querySnapshot.docChanges().forEach(function(change){
    console.log(change.doc.data())
    const {x,y,color} = change.doc.data()

    createPixel(x,y,color)
  })
})