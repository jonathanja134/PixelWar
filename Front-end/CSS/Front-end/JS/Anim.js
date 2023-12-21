//------------ 1/ We rezise the color block -----------// 

window.addEventListener('resize', adjustDivSize);
window.addEventListener('load', adjustDivSize);

        function adjustDivSize() {
            const resizeTool = document.getElementsByClassName('resizeToolBlock');
            const windowHeight = window.innerHeight;
            const newHeight = windowHeight * 0.05; // Ajustez selon vos besoins
            for (let i = 0; i < resizeTool.length; i++) {
              resizeTool[i].style.height = newHeight + 'px';
              resizeTool[i].style.width = newHeight + 'px';
          }

          const colorChoice = document.getElementById('colorChoice');
          const newRadius = (windowHeight *0.03 ); // Ajustez selon vos besoins
          colorChoice.style.borderRadius = newRadius + 'px';
        }

//-------------------2/ POP UP--------------------//

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

//-------------3/ Animation scale for the selected color--------------//

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

//-----------------------------Hiding tool bar-----------------------------------//
let hiden= Boolean;
hiden=false
function HideToolbar(){
  console.log(hiden)
  if(hiden === true){
    hiden=false;
    colorChoice.querySelectorAll('div').forEach(item => {
      item.style.display = "flex"; // Clear the innerHTML of each color item
      });
    colorChoice.querySelectorAll("section").forEach((item, index) => {
      if (index === 1 || index === 0 ) {
        item.style.display= "flex";
        }
        if(index=== 2 ){
          item.innerHTML='<i class="fa-solid fa-eye-slash"></i>'
        }
    });
    colorChoice.style.background =  "#668bcb";  
  }
  else if(hiden===false){
    hiden=true;
    colorChoice.querySelectorAll('div').forEach(item => {
      item.style.display = "none"; // Clear the innerHTML of each color item
      });
    colorChoice.querySelectorAll("section").forEach((item, index) => {
      if (index === 1 || index === 0 ) {
        item.style.display= "none";
        }
      if(index=== 2 ){
        item.innerHTML='<i class="fa-solid fa-eye"></i>'
      }
    });
    colorChoice.style.background =  "none";
    colorChoice.style.boxShadow =  "none";
  }
  console.log(hiden)
}