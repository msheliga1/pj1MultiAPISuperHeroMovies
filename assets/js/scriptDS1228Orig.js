
var form = document.querySelector('form');
var hero = document.getElementById('search-input');
var heroes = JSON.parse(localStorage.getItem('SuperHero_')) || [];
var previous = document.getElementById('previous');
var previoussearch = document.getElementById('previous-search');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  var userInputs = hero.value;

  if (userInputs) {
    heroes.push(userInputs);

    // Limit the number of hero elements to 3
    if (heroes.length > 3) {
      heroes.shift(); // Remove the oldest hero element
    }

    heroes.forEach(function(element, index){
      localStorage.setItem('SuperHero_' + (index + 1), element);
    });

    // Clear the hero input field
    hero.value = '';

    displayPreviousSearch();

  } else {
    window.confirm('Please enter hero name.');
  }
});

function displayPreviousSearch() {
  previous.style.display = 'block';
  previoussearch.innerHTML = '';
//For each Hero Entry, Create a Button that when clicked on it can autofill search field in form
  heroes.forEach(function(entry) {
    var listItem = document.createElement('button');
    listItem.textContent = entry;
    listItem.style = 'margin: 20px; padding: 5px';
    listItem.addEventListener('click', function (){
      hero.value = '';
      hero.value = entry;
    });
    previoussearch.appendChild(listItem);
  });
}