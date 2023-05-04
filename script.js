var imgEl = document.getElementById("food-image");
//This section is used to initiate the macro counter for the webpage
var totalCalories = localStorage.getItem("totalCalories");
var totalCarbohydrates = localStorage.getItem("totalCarbohydrates");
var totalProteins = localStorage.getItem("totalProteins");
var totalFats = localStorage.getItem("totalFats");


if(!totalCalories && !totalCarbohydrates){//if the local storage values aren't initialized then initilize them to 0
  localStorage.setItem("totalCalories", 0);
  localStorage.setItem("totalCarbohydrates", 0);
  localStorage.setItem("totalProteins", 0);
  localStorage.setItem("totalFats", 0);
}
updateMacros();//calls the update method to update macro elements


//This section is edamam API JS
(function () {
  const result = document.querySelector('#result')
  function initEvent() {
    document.querySelector('#search').addEventListener('submit', function (e) {
      e.preventDefault()
      imgEl.setAttribute("src", "loading.gif"); //change image to a loading GIF if fetching image data takes time
      if (e.target[0].value) {
        result.innerHTML = ''
        changeTextButton(e.target[1], 'SEARCHING...')
        getImage(e.target);
        search(e.target)
      }
    }, false)
  }
  function changeTextButton(button, text) {
    button.textContent = text
  }
  function search(form) {
    const formData = new FormData(form)
    //Without Backend:
    fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=153bdd9c&app_key=bb99694209a64070ce49004caccc4859&ingr=ingr=${formData.get('name')}`)
      .then(resp => resp.json())
      .then(resp => {
        totalCards=0;
        if (resp.hints.length) {
          localStorage.setItem("items",JSON.stringify(resp.hints))
          resp.hints.forEach(hint => {
            insertCard(hint.food)
          })
        }
        else {
          changeInput(form[0], 'placeholder', 'We didn\'t find any food.')
          resetInput(form[0])
        }
        changeTextButton(form[1], 'SEARCH')
        changeInput(form[0], 'value', '')
      }).catch(() => {
        //if the response has an error
        changeTextButton(form[1], 'SEARCH')
        changeInput(form[0], 'placeholder', 'An error has occurred. Try again later.')
        resetInput(form[0])
      })
  }
  //changes input back to it's placeholder
  function resetInput(input) {
    setTimeout(() => {
      changeInput(input, 'placeholder', 'Type a food or a meal...')
    }, 3000)
  }

  function changeInput(input, prop, value) {
    input[prop] = value
  }

  function insertCard(food) {
    result.insertAdjacentHTML('beforeend', buildCard(food))
  }
  //builds the card after search for each product
  var totalCards = 0;
  function buildCard(data) {
    var cardNum = totalCards;
    const energy = data.nutrients.ENERC_KCAL ? `<li><b>Calories: </b><span>${data.nutrients.ENERC_KCAL.toFixed(1)}kcal</span></li>` : ''
    const carbs = data.nutrients.CHOCDF ? `<li><b>Carbohydrates: </b><span>${data.nutrients.CHOCDF.toFixed(1)}g</span></li>` : ''
    const protein = data.nutrients.PROCNT ? `<li><b>Proteins: </b><span>${data.nutrients.PROCNT.toFixed(1)}g</span></li>` : ''
    const fat = data.nutrients.FAT ? `<li><b>Fats: </b><span>${data.nutrients.FAT.toFixed(1)}g</span></li>` : ''
    const sugars = data.nutrients.SUGAR ? `<li><b>Sugars: </b><span>${data.nutrients.SUGAR.toFixed(1)}g</span></li>` : ''
    const html = 
    `
      <div class="card"
      data-calorie="${parseFloat(data.nutrients.ENERC_KCAL.toFixed(1))}" 
      data-carb="${parseFloat(data.nutrients.CHOCDF.toFixed(1))}"
      data-protein="${parseFloat(data.nutrients.PROCNT.toFixed(1))}"
      data-fat="${parseFloat(data.nutrients.FAT.toFixed(1))}">
        
        <div class="card-header">
          <h3>${data.label}</h3>
          <h4>${data.category}</h4>
        </div>

        <div class="card-body">
          <ul>
            ${energy}
            ${carbs}
            ${protein}
            ${fat}
            ${sugars}
          </ul>
        </div>

        <div class="card-footer">
          <p><b>Brand: </b><span>${data.brand || 'None :('}</span></p>
          <div class="addBtn" >
          <button id=${data.foodId} class="heart" type="checkbox" onclick="cardClicked(${cardNum}); storeData();"> &#9829</button>
          </div>

        </div>

      </div>
    `
    totalCards++;
    return html
  }
  initEvent()
})()


//This section below is for PixaBay API JS
var imageURL = "";

function getImage(form) {
  const formData = new FormData(form);
  let searchTerm = formData.get('name');
  var requestURL = "https://pixabay.com/api/?key=35844814-7d1b1acb06ab5ddd767b0ed30&q=" + searchTerm + "&image_type=photo&min_width=200&max_width=200&safesearch=true&category=food";

  fetch(requestURL)
    .then(resp => resp.json())
    .then(resp => {//do something with json recieved from pixabay
      imageURL = resp.hits[0].webformatURL; //selects the first image returned through API
      imgEl.setAttribute("src", imageURL); //sets the src attribute of image in html
      imgEl.style.visibility = "visible";
    }).catch(() => {//if the response has an error, set placeholder as image src
      imgEl.setAttribute("src", "assets/placeholder.jpg");
    })
}

function storeData(event) {
  var dataHTML = "";
  // var dataHTML = "<h1>Cart</h1>";
  // dataHTML += "<h2 id='DIARY'> nutrient info </h2>";
  var element = document.getElementById("diary");
  event = event || window.event;
  event = event.target || event.srcElement;
  if (event.nodeName === 'BUTTON') {
    var items = JSON.parse(localStorage.getItem("items"))
    items.forEach(item => {
      if(event.id === item.food.foodId) {
        dataHTML += 
        `
        <div class="diary">

          <h1>Saved</h1>

          <div class="diary-header">
            <h3>${item.food.label}</h3>
            <h4>${item.food.category}</h4>
          </div>

          <div class="diary-body">
            <ul>
              <li><b>Calories: </b><span>${item.food.nutrients.ENERC_KCAL.toFixed(1)}kcal</span></li>
              <li><b>Carbohydrates: </b><span>${item.food.nutrients.CHOCDF.toFixed(1)}g</span></li>
              <li><b>Proteins: </b><span>${item.food.nutrients.PROCNT.toFixed(1)}g</span></li>
              <li><b>Fats: </b><span>${item.food.nutrients.FAT.toFixed(1)}g</span></li>
            </ul>
          </div>

        </div>

        <div class="log-container">

          <h1>Daily Log</h1>
              
          <div id="totals-header"> <strong>My Daily Log: </strong> </div>
          <div id="totals">

            <h6>Calories: <span id="totalCalories"></span></h6>
            <h6>Carbohydrates: <span id="totalCarbohydrates"></span></h6>
            <h6>Proteins: <span id="totalProteins"></span></h6>
            <h6>Fats: <span id="totalFats"></span></h6>

            <button id="reset-button" onclick="resetMacros();">Reset</button>

          </div>

        </div> 
        `
      }
    })
  }
  element.innerHTML = dataHTML;
  updateMacros();
}

//section below is for total macros

allCards = document.getElementsByClassName("card");
function cardClicked(cardNum){//change local storage based on card clicked
  //allCards[cardNum].getAttribute("data-calorie")
  newCal = (parseFloat(localStorage.getItem("totalCalories")) + parseFloat(allCards[cardNum].getAttribute("data-calorie"))).toFixed(1);
  newCarb = (parseFloat(localStorage.getItem("totalCarbohydrates")) + parseFloat(allCards[cardNum].getAttribute("data-carb"))).toFixed(1);
  newProt = (parseFloat(localStorage.getItem("totalProteins")) + parseFloat(allCards[cardNum].getAttribute("data-protein"))).toFixed(1);
  newFat = (parseFloat(localStorage.getItem("totalFats")) + parseFloat(allCards[cardNum].getAttribute("data-fat"))).toFixed(1);

  localStorage.setItem("totalCalories", newCal);
  localStorage.setItem("totalCarbohydrates", newCarb);
  localStorage.setItem("totalProteins", newProt);
  localStorage.setItem("totalFats", newFat);
}

function updateMacros(){
  let calorieEl = document.getElementById("totalCalories");
  let carbEl = document.getElementById("totalCarbohydrates");
  let proteinEl = document.getElementById("totalProteins");
  let fatEl = document.getElementById("totalFats");

  calorieEl.innerHTML = localStorage.getItem("totalCalories");
  carbEl.innerHTML = localStorage.getItem("totalCarbohydrates");
  proteinEl.innerHTML = localStorage.getItem("totalProteins");
  fatEl.innerHTML = localStorage.getItem("totalFats");
}

function resetMacros(){
  localStorage.setItem("totalCalories", 0);
  localStorage.setItem("totalCarbohydrates", 0);
  localStorage.setItem("totalProteins", 0);
  localStorage.setItem("totalFats", 0);
  updateMacros();
}

//Section below is for bookmark
$(function() {
  $('#bookmarkme').click(function() {
    if (window.sidebar && window.sidebar.addPanel) { // Mozilla Firefox Bookmark
      window.sidebar.addPanel(document.title, window.location.href, '');
    } else if (window.external && ('AddFavorite' in window.external)) { // IE Favorite
      window.external.AddFavorite(location.href, document.title);
    } else if (window.opera && window.print) { // Opera Hotlist
      this.title = document.title;
      return true;
    } else { // webkit - safari/chrome
      alert('Press ' + (navigator.userAgent.toLowerCase().indexOf('mac') != -1 ? 'Command/Cmd' : 'CTRL') + ' + D to bookmark this page.');
    }
  });
});