// URI Project 1 - Mike Sheliga, De'Sean Pair and Tayler Baldwin = Due 1.9.23
// Most programming by MJS
// Includes De'Seans old local storage code 12.28.23
var inputBox = document.getElementById('search-input');  // originally agreed upon name was superhero
var form = document.querySelector('form');                  // MJS - I'd favor an input field instead of a form, but either likely works
var heroInput = document.getElementById('search-input');
var previous = document.getElementById('previous');
previous.style.display = 'block'; // this belongs in the css file.
var btn = document.getElementById("remove-button");

form.addEventListener('submit', function(event) {
  event.preventDefault();  // prevents clearing of window, maybe event propogation
  // use singular (input vs inputs) for a single superhero value
  var userInput = heroInput.value;
  if (userInput) {  // just userInput also works - checks null, undefined, false and 0
    // Only store if hero has movies! 
    // localStorage.setItem('SuperHero_' + (index + 1), element);
    // Clear the hero input field hero.value = '';
    myLog ("Submit event listener calling superherosearch for " + userInput);
    var storeIfFound = true;  // store hero in local storage if movies found.
    superherosearch(storeIfFound);
  } else {
    // remember, no confirms in this assignment. Must use a modal(??)
    window.confirm('Please enter hero name.');
  }
});  // end form (input text area for hero's name) event listener

// MJS 12.20.23 - set up the URL and load search-search_results web page. 
function superherosearch(storeIfFound) {  // poor CamelCase but what we agreed upon
    // fetch request gets a list of all the repos for the node.js organization
    var heroName = inputBox.value;  // ie. "batman";
    var storeQP = "&store=" + storeIfFound;
    console.log("Starting superhero Search routine for " + heroName + " ... storeQP " + storeQP);
    // MJS 12.29 = got rid of PITA / before ? - caused issues in gitHub test (but not before!). What a PITA
    window.location.href = "./assets/html/details.html?search=" + heroName + storeQP;
    // changing location (loading new web page) will terminate the routine 
} // end function superheroSearch

// Display superheroes previously saved in local storage.
// MJS 12.28.23
function displayStoredSearches() {
    myLog("Displaying previous searches stored in local storage ...");
    var previoussearch = document.getElementById('previous-search');
    previoussearch.innerHTML = '';    // clear prior buttons
    // For each Hero Entry, Create a Button that when clicked on it can autofill search field in form
    var done = false;
    var i = 1;
    while (! done && i < 5000) {
        var heroName = localStorage.getItem('SuperHero_' + i);
        if (heroName !== null && heroName.length > 0 ) {
            myLog("Displaying button for " + i + ". " + heroName); 
            var btn = document.createElement('button');
            btn.textContent = heroName;
            btn.style = 'margin: 20px; padding: 5px';
            btn.addEventListener('click', storedSuperheroButtonClick);
            previoussearch.appendChild(btn);
            i++; 
        } else {
            done = true;
        } // end if-else
    } // end while 
    myLog("displayStoredSearches displayed " + (i-1) + " buttons.");
  };  // end function displayStoredSearches

// Display superheroes previously saved. 
// MJS 12.28 - Precondition: heros array contians list of saved heros (matching local storage)
// Globals - heroes array, 
function displayStoredSearchesOldDS() {
    previoussearch.innerHTML = '';    // clear prior buttons
    // For each Hero Entry, Create a Button that when clicked on it can autofill search field in form
    heroes.forEach(function(entry) {
      var btn = document.createElement('button');
      btn.textContent = entry;
      btn.style = 'margin: 20px; padding: 5px';
      btn.addEventListener('click', function () {
        hero.value = entry;  // heroes is array of strings => setting input box .value to a string
      });
      previoussearch.appendChild(btn);
    });
  } // end function displayStoredSearches OldDS displayPreviousSearches

// ---------------- Event Handlers ----------------------------------
// MJS 12.28.23 - When a storedSuperhero button is clicked ... save button name to input box, then 
// call a routine to setup the queryString and page swap. 
function storedSuperheroButtonClick(event) {
        // beware - prior values (ie heroName) not accessible once button is clicked!
        var heroName = event.target.textContent;
        // alert("Button clicked for " + heroName); // cant print as page swap about to happen
        heroInput.value = heroName;   // used by superherosearch
        var storeIfFound = false;  // value already in local storage - dont store
        superherosearch(storeIfFound);  // will setup queryString and page swap 
} // end function storedSuperheroButtonClick

// -------------- Local Storage Functions ----- SuperHero_ -------------
var localStorePrefix = "SuperHero_";     // ideally these would be external to the class.
var localStoreDiv = "#saved-data-div";  // DOM div to store the data

// see if the value is in local storage.  MJS 12.30.23 
function locallyStoredValueExists(value) {
  console.log("Searching for locally stored value .... " + value);
  var count = getLocallyStoredDataCount(localStorePrefix);
  for (i=1; i<=count; i++ ) {
      if (localStorage.getItem(localStorePrefix+i).toLowerCase() === value.toLowerCase()) {  // no trim or lowerCase
          return true;
      }
  }
  return false;
}  // end function locallyStoredValueExists

// clear Local Data beginning with prefix. MJS 12.30.23
function clearLocalStorage(prefix) {
  var count = getLocallyStoredDataCount(prefix);
  for (var i=1; i<=count; i++) {
      localStorage.removeItem(prefix+i);
      myLog("Deleting local storage " + prefix + i);        
  }
  myLog("Done clearingLocalStorage");
}  // end function clearLocalStorage

// Return the number of locally stored values (prefix_index) beginning at 1. MJS 12.30.23.  
// If prefix_1 thru prefix_10 exists, but prefix_5 is missing 4 will be returned.
function getLocallyStoredDataCount(prefix) {
  myLog("Getting locally stored data count for " + prefix);
  done = false;
  var i = 1;
  while (! done) {
      var keyStr = prefix + i;
      var value = localStorage.getItem(keyStr);
      if (value === null || value.length === 0) {
          done = true;
      } else {
          i++;
      }
  } // end while not done
  return (i - 1);
} // end function getLocallyStoredDataCouont

// Count and return the superheroes previously saved in local storage.
// MJS 12.28.23  OBSOLETED 1.2.24 by 
function countStoredHerosOBS() {
    myLog("Counting searches stored in local storage ...");
    // Count the number of SuperHero_i values stored in local storage
    var done = false;
    var i = 0; 
    while (! done && i < 5000) {  // 5000 to prevent infinite loops
        var heroName = localStorage.getItem('SuperHero_' + (i+1));
        if (heroName !== null && heroName.length > 0 ) {
            i++; 
        } else {
            done = true;
        } // end if-else
    } // end while 
    myLog("countStoredHeros found: " + i);
    return i; 
};  // end function countStoredHeros

// Clear the local storage - MJS 12.29.23
function clearLocalStorageButtonClickFunction() {
  myLog("clearing local storage button click function.");
  clearLocalStorage(localStorePrefix);
  displayStoredSearches(); 
  // buttonifyLocalStorage(localStoreDiv, localStorePrefix); // will remove old local storage from screen
}

// ----------------------- Accesssory methods -----------------------  
function myLog(logStr) {
  console.log(logStr);   // enables turning on-off all console.logs
} 

// Store the hero to local storage if it is part of the queryString. MJS 12.28.23 
function localStoreQSHero(localStorePrefix) {
    console.log("Storing QS Hero. Prefix: " + localStorePrefix);
    var heroName = getQueryValue("store");
    if (heroName === null) {
        return;  // heroName not in query string
    }
    if (locallyStoredValueExists(heroName)) {
        return;   // hero already in local storage
    }
    var i = getLocallyStoredDataCount(localStorePrefix);
    var storeKey = 'SuperHero_' + (i+1);
    localStorage.setItem(storeKey, heroName);
    myLog("Stored hero " + heroName + " to " + storeKey);
}

// For the given label (or name) string, return the value from the current URLs query string - 
// Return null if label is not found - MJS 12.27.23
function getQueryValue(label) {
    var url = window.location.href;
    myLog("In location " + url);
    var splitUrl = url.split("?");
    var queryString = splitUrl[splitUrl.length - 1];
    myLog("The query string is " + queryString);
    var splitQS = queryString.split("&");
    var inputText = null;
    for (var i=0; i<splitQS.length; i++) {
        if (splitQS[i].startsWith(label + "=")) {
            inputText = splitQS[i].split("=")[1];
        }
    }
    myLog("Query value for " + label + " is " + inputText);
    return inputText;
}  // end getQueryValue

btn.setAttribute("onclick", "clearLocalStorageButtonClickFunction()"); 
localStoreQSHero(localStorePrefix);  // store hero from queryString if it exists 
displayStoredSearches();