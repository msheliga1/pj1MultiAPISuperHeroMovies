// URI Project 1 - Mike Sheliga, De'Sean Pair and Tayler Baldwin = Due 1.9.23

// De'Seans old code 12.28.23
// Issues: 
// - Lack of comments - No header comment. No comments at top. No comments for each method.
// - Doesn't load saved localStorage heros.
// - Uses plural "userInputs" for a single userInput string.
// - Doesn't use agreed upon names (text area id = superhero, on click function = superherosearch)
// - Doesn't account for situation where no movies exist - should not save in this situtaion.
var form = document.querySelector('form'); // MJS - I'd suggest an input field instead of a form, but either likely works
var hero = document.getElementById('search-input');
// This doesn't get anything even if SuperHero_1 exists. 
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
    window.confirm('Please enter hero name.');  // Need to change to a modal.
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