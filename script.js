//This section is edamam API JS
(function () {
  const result = document.querySelector('#result')
  function initEvent() {
    document.querySelector('#search').addEventListener('submit', function (e) {
      e.preventDefault()
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
    //without backend:
    fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=153bdd9c&app_key=bb99694209a64070ce49004caccc4859&ingr=ingr=${formData.get('name')}`)
      .then(resp => resp.json())
      .then(resp => {
        if (resp.hints.length) {
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
        changeTextButton(form[1], 'SEARCH')
        changeInput(form[0], 'placeholder', 'An error has occurred. Try again later.')
        resetInput(form[0])
      })
  }

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

  function buildCard(data) {
    const energy = data.nutrients.ENERC_KCAL ? `<li><b>Calories: </b><span>${data.nutrients.ENERC_KCAL.toFixed(1)}kcal</span></li>` : ''
    const carbs = data.nutrients.CHOCDF ? `<li><b>Carbohydrates: </b><span>${data.nutrients.CHOCDF.toFixed(1)}g</span></li>` : ''
    const protein = data.nutrients.PROCNT ? `<li><b>Protein: </b><span>${data.nutrients.PROCNT.toFixed(1)}g</span></li>` : ''
    const fat = data.nutrients.FAT ? `<li><b>Fat: </b><span>${data.nutrients.FAT.toFixed(1)}g</span></li>` : ''
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
      </div>
    </div>
    `
    return html
  }

  initEvent()(function () {
  const result = document.querySelector('#result')
  function initEvent() {
    document.querySelector('#search').addEventListener('submit', function (e) {
      e.preventDefault()
      if (e.target[0].value) {
        result.innerHTML = ''
        changeTextButton(e.target[1], 'SEARCHING...')
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
      }).catch(() => {//if the response has an error
        changeTextButton(form[1], 'SEARCH')
        changeInput(form[0], 'placeholder', 'An error has occurred. Try again later.')
        resetInput(form[0])
      })
  }
  function resetInput(input) { //changes input back to it's placeholder
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
  function buildCard(data) { //builds the card after search for each product
    const energy = data.nutrients.ENERC_KCAL ? `<li><b>Energy: </b><span>${data.nutrients.ENERC_KCAL.toFixed(1)}kcal</span></li>` : ''
    const carbs = data.nutrients.CHOCDF ? `<li><b>Carbs: </b><span>${data.nutrients.CHOCDF.toFixed(1)}g</span></li>` : ''
    const protein = data.nutrients.PROCNT ? `<li><b>Protein: </b><span>${data.nutrients.PROCNT.toFixed(1)}g</span></li>` : ''
    const fat = data.nutrients.FAT ? `<li><b>Fat: </b><span>${data.nutrients.FAT.toFixed(1)}g</span></li>` : ''
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
      </div>
    </div>
    `
    return html
  }
  initEvent()
})()
})()

//This section below is for PixaBay API JS

var pixaBayURLp1 = "https://pixabay.com/api/?key=35844814-7d1b1acb06ab5ddd767b0ed30&q=";
var pixaBayURLp2 = "&image_type=photo&min_width=200&max_width=200&safesearch=true&per_page=3";
var imageURL = "";

function getImage(form){
  const formData = new FormData(form);
  let searchTerm = formData.get('name');
  var requestURL = "https://pixabay.com/api/?key=35844814-7d1b1acb06ab5ddd767b0ed30&q=" + searchTerm + "&image_type=photo&min_width=200&max_width=200&safesearch=true&per_page=3"
  
  fetch(requestURL)
    .then(resp => resp.json())
    .then(resp => {//do something with json recieved from pixabay
      imageURL = resp.hits[0].webformatURL;
    }).catch(() => {//if the response has an error
      
    })
  //console.log("https://pixabay.com/api/?key=35844814-7d1b1acb06ab5ddd767b0ed30&q=" + searchTerm + "&image_type=photo&min_width=200&max_width=200&safesearch=true&per_page=3");
}
