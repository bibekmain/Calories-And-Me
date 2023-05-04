var imgEl = document.getElementById("food-image");
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
        if (resp.hints.length) {
          localStorage.setItem("items",JSON.stringify(resp.hints))
          resp.hints.forEach(hint => {
            insertCard(hint.food)
          })
        }
        else {
          changeInput(form[0], 'placeholder', 'We didn\'t found any food.')
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
  function buildCard(data) {
    const energy = data.nutrients.ENERC_KCAL ? `<li><b>Calories: </b><span>${data.nutrients.ENERC_KCAL.toFixed(1)}kcal</span></li>` : ''
    const carbs = data.nutrients.CHOCDF ? `<li><b>Carbohydrates: </b><span>${data.nutrients.CHOCDF.toFixed(1)}g</span></li>` : ''
    const protein = data.nutrients.PROCNT ? `<li><b>Proteins: </b><span>${data.nutrients.PROCNT.toFixed(1)}g</span></li>` : ''
    const fat = data.nutrients.FAT ? `<li><b>Fats: </b><span>${data.nutrients.FAT.toFixed(1)}g</span></li>` : ''
    const sugars = data.nutrients.SUGAR ? `<li><b>Sugars: </b><span>${data.nutrients.SUGAR.toFixed(1)}g</span></li>` : ''
    const html = `
  <div class="card">
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
      
      <button id=${data.foodId} class="heart" type="checkbox" onclick="storeData().ba;"> &#9829
     
      </button>
      </div>
    </div>
  </div>
  `
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
  var dataHTML = "<h1>Cart</h1>";
  dataHTML += "<h2 id='DIARY'> nutrient info </h2>";
  var element = document.getElementById("diary");
  
  event = event || window.event;
  event = event.target || event.srcElement;
  if (event.nodeName === 'BUTTON') {
    var items = JSON.parse(localStorage.getItem("items"))
    items.forEach(item => {
      if(event.id === item.food.foodId) {
        dataHTML += `
        <div class="diary">
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
        </div>`
      }
    })
  }
  element.innerHTML = dataHTML;
}
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