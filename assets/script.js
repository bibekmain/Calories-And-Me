var foodCard = document.querySelector(".card"); //

var requestUrl = "https://fruityvice.com/api/fruit/all"; //This URL will change depending on the fruit card picked

fetch(requestUrl)//First the program will get the names of all the fruits in the API and make a button like container in the webpage
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data); 
    });

foodCard.addEventListener('click', function(event){//After a button press it will call the API again for the information on the fruit

});

