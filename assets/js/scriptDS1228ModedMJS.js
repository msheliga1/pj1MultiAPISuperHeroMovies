// URI Project 1 - Mike Sheliga, De'Sean Pair and Tayler Baldwin = Due 1.9.23

// Includes De'Seans old local storage code 12.28.23
// Issues: 
// - FIXED: Lack of comments - No header comment. No comments at top. No comments for each method.
// - Doesn't load saved localStorage heros.
// - FIXED: Uses plural "userInputs" for a single userInput string.
// - Doesn't use agreed upon names (text area id = superhero, on click function = superherosearch)
// - Doesn't account for situation where no movies exist - should not save in this situtaion.
var form = document.querySelector('form');  // MJS - I'd suggest an input field instead of a form, but either likely works
var hero = document.getElementById('search-input');
// This doesn't get anything even if SuperHero_1 exists. 
var heroes = JSON.parse(localStorage.getItem('SuperHero_')) || [];
console.log("getItem heroes are " + heroes + " Length " + heroes.length);
var previous = document.getElementById('previous');
var previoussearch = document.getElementById('previous-search');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  // use singular (input vs inputs) for a single superhero value
  var userInput = hero.value;

  if (userInput) {
    heroes.push(userInput);
    // Limit the number of hero elements to 3
    if (heroes.length > 3) {
      heroes.shift(); // Remove the oldest hero element
    }
    heroes.forEach(function(element, index){
      localStorage.setItem('SuperHero_' + (index + 1), element);
    });
    // Clear the hero input field
    hero.value = '';

    displayPreviousSearches();

  } else {
    // remember, no confirms in this assignment. Must use a modal(??)
    window.confirm('Please enter hero name.');
  }
});

// Display superheroes previously saved. 
// MJS 12.28 - Precondition: heros array contians list of saved heros (matching local storage)
// Globals - heroes array, 
function displayPreviousSearches() {
  previous.style.display = 'block'; // this belongs in the css file.
  previoussearch.innerHTML = '';    // clear prior buttons
  // For each Hero Entry, Create a Button that when clicked on it can autofill search field in form
  heroes.forEach(function(entry) {
    var listItem = document.createElement('button');
    listItem.textContent = entry;
    listItem.style = 'margin: 20px; padding: 5px';
    listItem.addEventListener('click', function () {
      hero.value = entry;  // heroes is array of strings => setting input box .value to a string
    });
    previoussearch.appendChild(listItem);
  });
} // end function displayPreviousSearches