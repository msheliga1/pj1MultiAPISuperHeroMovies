// URI Project 1 - Mike Sheliga, De'Sean Pair and Tayler Baldwin = Due 1.9.23
// Most programming by MJS
// Includes De'Seans old local storage code 12.28.23
var inputBox = document.getElementById('search-input');  // originally agreed upon name was superhero
var form = document.querySelector('form');                  // MJS - I'd favor an input field instead of a form, but either likely works
var heroInput = document.getElementById('search-input');
var previous = document.getElementById('previous');
previous.style.display = 'block'; // this belongs in the css file.
var modal = document.getElementById('modal-js-example');
var closemodal = document.getElementById('close-modal');

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
    openModal();
  }
});  // end form (input text area for hero's name) event listener


function openModal() {
  modal.classList.add('is-active');
}

closemodal.addEventListener ('click', function (event) {
  closeModal();
});

function closeModal() {
  modal.classList.remove('is-active');
}


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
    while (! done && i < 5000) {  // 5000 to stop infinite loops
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
    queryString = queryString.replaceAll("%20", " ");  // spaces auto-coerced to %20, change back. (IE compatable?)
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

// Setup some of our favorite posters, including alt descriptions
// Video https://www.youtube.com/watch?v=X3OZshO9Bys&t=1s
// https://comicbook.com/movies/news/the-50-most-important-superheroes-ranked/#13
function getFavoriteMovies() {
  // posterNames exclude https:// and .jpg at the ending
  var movies= [];
  var movie = {};
  // batman 1989
  movie = {"Title":"Batman","Year":"1989","Rated":"PG-13","Released":"23 Jun 1989","Runtime":"126 min","Genre":"Action, Adventure","Director":"Tim Burton","Writer":"Bob Kane, Sam Hamm, Warren Skaaren","Actors":"Michael Keaton, Jack Nicholson, Kim Basinger","Plot":"The Dark Knight of Gotham City begins his war on crime with his first major enemy being Jack Napier, a criminal who becomes the clownishly homicidal Joker.","Language":"English, French, Spanish","Country":"United States, United Kingdom","Awards":"Won 1 Oscar. 10 wins & 28 nominations total","Poster":"https://m.media-amazon.com/images/M/MV5BZWQ0OTQ3ODctMmE0MS00ODc2LTg0ZTEtZWIwNTUxOGExZTQ4XkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"7.5/10"},{"Source":"Rotten Tomatoes","Value":"76%"},{"Source":"Metacritic","Value":"69/100"}],"Metascore":"69","imdbRating":"7.5","imdbVotes":"398,066","imdbID":"tt0096895","Type":"movie","DVD":"24 Jul 2014","BoxOffice":"$251,409,241","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  // planet hulk
  movie = {"Title":"Planet Hulk","Year":"2010","Rated":"PG-13","Released":"02 Feb 2010","Runtime":"81 min","Genre":"Animation, Action, Adventure, Drama, Sci-Fi","Director":"Sam Liu","Writer":"Greg Pak (comic book), Carlo Pagulayan (comic book), Greg Johnson (screen story), Craig Kyle (screen story), Joshua Fine (screen story), Greg Johnson (screenplay), Stan Lee (The Incredible Hulk created by), Jack Kirby (The Incredible Hulk created by), Jose Ladronn (original comics designs), Lucio Parrillo (original comics designs), Aaron Lopresti (original comics designs)","Actors":"Rick D. Wasserman, Lisa Ann Beley, Mark Hildreth, Liam O'Brien","Plot":"The Incredible Hulk, ejected from Earth in a spaceship, crash-lands on a planet ruled by a tyrant, who forces him to fight in a coliseum against other powerful creatures. The Hulk reluctantly befriends the combatants on his team.","Language":"English","Country":"USA","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BYmFlNTNhNjktNDQ4NC00ZmVhLTg2NmYtOWExMmI0MzQ1ODFmL2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"6.8/10"}],"Metascore":"N/A","imdbRating":"6.8","imdbVotes":"12,405","imdbID":"tt1483025","Type":"movie","DVD":"25 Feb 2010","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"};
  movies.push(movie);
  // xmen apocolypse
  movie = {"Title":"X-Men: Apocalypse","Year":"2016","Rated":"PG-13","Released":"27 May 2016","Runtime":"144 min","Genre":"Action, Adventure, Sci-Fi","Director":"Bryan Singer","Writer":"Simon Kinberg, Bryan Singer, Michael Dougherty","Actors":"James McAvoy, Michael Fassbender, Jennifer Lawrence","Plot":"In the 1980s the X-Men must defeat an ancient all-powerful mutant, En Sabah Nur, who intends to thrive through bringing destruction to the world.","Language":"English, Polish, German, Arabic, Egyptian (Ancient)","Country":"United States","Awards":"1 win & 19 nominations","Poster":"https://m.media-amazon.com/images/M/MV5BMjU1ODM1MzYxN15BMl5BanBnXkFtZTgwOTA4NDE2ODE@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"6.9/10"},{"Source":"Rotten Tomatoes","Value":"47%"},{"Source":"Metacritic","Value":"52/100"}],"Metascore":"52","imdbRating":"6.9","imdbVotes":"454,508","imdbID":"tt3385516","Type":"movie","DVD":"09 Sep 2016","BoxOffice":"$155,442,489","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie); 
  // justice league flashpoint paradox 
  movie = {"Title":"Justice League: The Flashpoint Paradox","Year":"2013","Rated":"PG-13","Released":"30 Jul 2013","Runtime":"75 min","Genre":"Animation, Action, Adventure, Fantasy, Sci-Fi","Director":"Jay Oliva","Writer":"James Krieg, Geoff Johns (based on the graphic novel \"Flashpoint\" by), Andy Kubert (based on the graphic novel \"Flashpoint\" by), Jerry Siegel (character created by: Superman), Joe Shuster (character created by: Superman), Bob Kane (character created by: Batman), William Moulton Marston (character created by: Wonder Woman), Paul Norris (character created by: Aquaman), Jack Kirby (character created by: Etrigan the Demon), Marv Wolfman (characters created by: Cyborg & Deathstroke), George Pérez (characters created by: Cyborg & Deathstroke), Jim Lee (character created by: Grifter), Brandon Choi (character created by: Grifter)","Actors":"Justin Chambers, C. Thomas Howell, Michael B. Jordan, Kevin McKidd","Plot":"The Flash finds himself in a war torn alternate timeline and teams up with alternate versions of his fellow heroes to return home and restore the timeline.","Language":"English","Country":"USA","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BMTgwNTljYzgtOTU3ZC00ZjhhLTk0YzItY2RiMWU0MGZlNzFjL2ltYWdlXkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"8.1/10"},{"Source":"Rotten Tomatoes","Value":"100%"}],"Metascore":"N/A","imdbRating":"8.1","imdbVotes":"46,318","imdbID":"tt2820466","Type":"movie","DVD":"08 Jun 2016","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  // spiderman 2018 PG 
  movie = {"Title":"Spider-Man: Into the Spider-Verse","Year":"2018","Rated":"PG","Released":"14 Dec 2018","Runtime":"117 min","Genre":"Animation, Action, Adventure","Director":"Bob Persichetti, Peter Ramsey, Rodney Rothman","Writer":"Phil Lord, Rodney Rothman","Actors":"Shameik Moore, Jake Johnson, Hailee Steinfeld","Plot":"Teen Miles Morales becomes the Spider-Man of his universe and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.","Language":"English, Spanish","Country":"Canada, United States","Awards":"Won 1 Oscar. 81 wins & 57 nominations total","Poster":"https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"8.4/10"},{"Source":"Rotten Tomatoes","Value":"97%"},{"Source":"Metacritic","Value":"87/100"}],"Metascore":"87","imdbRating":"8.4","imdbVotes":"646,090","imdbID":"tt4633694","Type":"movie","DVD":"07 Mar 2019","BoxOffice":"$190,241,310","Production":"N/A","Website":"N/A","Response":"True"};
  movies.push(movie);
  // thor-ragnorak 201y
  movie = {"Title":"Thor: Ragnarok","Year":"2017","Rated":"PG-13","Released":"03 Nov 2017","Runtime":"130 min","Genre":"Action, Adventure, Comedy","Director":"Taika Waititi","Writer":"Eric Pearson, Craig Kyle, Christopher L. Yost","Actors":"Chris Hemsworth, Tom Hiddleston, Cate Blanchett","Plot":"Imprisoned on the planet Sakaar, Thor must race against time to return to Asgard and stop Ragnarök, the destruction of his world, at the hands of the powerful and ruthless villain Hela.","Language":"English","Country":"United States","Awards":"6 wins & 50 nominations","Poster":"https://m.media-amazon.com/images/M/MV5BMjMyNDkzMzI1OF5BMl5BanBnXkFtZTgwODcxODg5MjI@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"7.9/10"},{"Source":"Rotten Tomatoes","Value":"93%"},{"Source":"Metacritic","Value":"74/100"}],"Metascore":"74","imdbRating":"7.9","imdbVotes":"800,376","imdbID":"tt3501632","Type":"movie","DVD":"17 Feb 2018","BoxOffice":"$315,058,289","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  // batman vs superman: Dawn of Justice 2016
  movie = {"Title":"Batman v Superman: Dawn of Justice","Year":"2016","Rated":"PG-13","Released":"25 Mar 2016","Runtime":"151 min","Genre":"Action, Adventure, Sci-Fi","Director":"Zack Snyder","Writer":"Bob Kane, Bill Finger, Jerry Siegel","Actors":"Ben Affleck, Henry Cavill, Amy Adams","Plot":"Batman is manipulated by Lex Luthor to fear Superman. Superman´s existence is meanwhile dividing the world and he is framed for murder during an international crisis. The heroes clash and force the neutral Wonder Woman to reemerge.","Language":"English","Country":"United States","Awards":"14 wins & 33 nominations","Poster":"https://m.media-amazon.com/images/M/MV5BYThjYzcyYzItNTVjNy00NDk0LTgwMWQtYjMwNmNlNWJhMzMyXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"6.5/10"},{"Source":"Rotten Tomatoes","Value":"29%"},{"Source":"Metacritic","Value":"44/100"}],"Metascore":"44","imdbRating":"6.5","imdbVotes":"743,708","imdbID":"tt2975590","Type":"movie","DVD":"25 Nov 2016","BoxOffice":"$330,360,194","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie); 
  // Aquamania 1961 - not a real superhero, but a good poster!
  movie = {"Title":"Aquamania","Year":"1961","Rated":"N/A","Released":"20 Dec 1961","Runtime":"8 min","Genre":"Animation, Short, Comedy","Director":"Wolfgang Reitherman, Jack Hannah, Jack Kinney","Writer":"Vance Gerry, Ralph Wright","Actors":"Pinto Colvig, Kevin Corcoran, John Dehner","Plot":"Mr. X buys a boat and inadvertently enters the water-skiing race. With Junior driving, with no experience, he's a bit out of his league.","Language":"English","Country":"United States","Awards":"Nominated for 1 Oscar. 1 nomination total","Poster":"https://m.media-amazon.com/images/M/MV5BMjhlZTYzNjAtMWU5Zi00MWFmLWI3YmEtYTE3ZTJkNDFiODc0XkEyXkFqcGdeQXVyNDgyODgxNjE@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"6.7/10"}],"Metascore":"N/A","imdbRating":"6.7","imdbVotes":"795","imdbID":"tt0054634","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie); 
  // Wonder Woman - DC style poster
  movie = {"Title":"Wonder Woman: Bloodlines","Year":"2019","Rated":"PG-13","Released":"05 Oct 2019","Runtime":"83 min","Genre":"Animation, Action, Fantasy","Director":"Justin Copeland, Sam Liu","Writer":"Drew Johnson, William Moulton Marston, Harry G. Peter","Actors":"Rosario Dawson, Jeffrey Donovan, Marie Avgeropoulos","Plot":"Wonder Woman tries to help a troubled young girl, Vanessa, who has fallen in with a deadly organization known as Villainy Inc. headed by Dr. Cyber.","Language":"English, German","Country":"United States","Awards":"1 nomination","Poster":"https://m.media-amazon.com/images/M/MV5BOWVmMjY0ZWYtNjAwMy00N2U1LTkzM2QtYmI3NjZlZmZlN2M3XkEyXkFqcGdeQXVyMTEyNzgwMDUw._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"5.9/10"},{"Source":"Rotten Tomatoes","Value":"88%"}],"Metascore":"N/A","imdbRating":"5.9","imdbVotes":"8,140","imdbID":"tt8752498","Type":"movie","DVD":"05 Oct 2019","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  // Batman featuring the Joker poster 
  movie = {"Title":"Batman Beyond: Return of the Joker","Year":"2000","Rated":"PG-13","Released":"12 Dec 2000","Runtime":"76 min","Genre":"Animation, Action, Crime, Sci-Fi, Thriller","Director":"Curt Geda","Writer":"Bob Kane (character created by: Batman), Paul Dini (story by), Glen Murakami (story by), Bruce Timm (story by), Paul Dini (screenplay by)","Actors":"Will Friedle, Kevin Conroy, Mark Hamill, Angie Harmon","Plot":"The Joker is back with a vengeance, and Gotham's newest Dark Knight needs answers as he stands alone to face Gotham's most infamous Clown Prince of Crime.","Language":"English","Country":"USA","Awards":"3 wins & 5 nominations.","Poster":"https://m.media-amazon.com/images/M/MV5BNmRmODEwNzctYzU1MS00ZDQ1LWI2NWMtZWFkNTQwNDg1ZDFiXkEyXkFqcGdeQXVyNTI4MjkwNjA@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"7.8/10"},{"Source":"Rotten Tomatoes","Value":"100%"}],"Metascore":"N/A","imdbRating":"7.8","imdbVotes":"24,592","imdbID":"tt0233298","Type":"movie","DVD":"01 May 2008","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  // Batman featuring catWoman poster
  movie = {"Title":"Chase Me","Year":"2003","Rated":"Not Rated","Released":"21 Oct 2003","Runtime":"6 min","Genre":"Animation, Short, Action, Sci-Fi","Director":"Curt Geda","Writer":"Alan Burnett, Paul Dini, Bob Kane (creator: Batman)","Actors":"N/A","Plot":"While escaping a dull party, Bruce Wayne finds Catwoman robbing a vault and gives chase as Batman.","Language":"None","Country":"USA","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BMmI1MGMxMTAtNGIzMi00NzEwLWJlNDQtZjYxYzg1ZTIyMTYzXkEyXkFqcGdeQXVyNDQ2MTMzODA@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"7.2/10"}],"Metascore":"N/A","imdbRating":"7.2","imdbVotes":"900","imdbID":"tt0982860","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  // Captain America
  movie = {"Title":"Captain America","Year":"1990","Rated":"PG-13","Released":"26 Jul 1991","Runtime":"97 min","Genre":"Action, Adventure, Sci-Fi","Director":"Albert Pyun","Writer":"Joe Simon, Jack Kirby, Stephen Tolkin","Actors":"Matt Salinger, Ronny Cox, Ned Beatty","Plot":"Frozen in the ice for decades, Captain America is freed to battle against archcriminal The Red Skull.","Language":"English","Country":"United States, Yugoslavia, Croatia","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BYmRmYzA4NDItZmI3NS00NWIyLWIzZWEtNGIzZjZlYmY5MzE2XkEyXkFqcGdeQXVyMTEyNzgwMDUw._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"3.2/10"},{"Source":"Rotten Tomatoes","Value":"12%"}],"Metascore":"N/A","imdbRating":"3.2","imdbVotes":"14,976","imdbID":"tt0103923","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  movie = {"Title":"Green Lantern: Emerald Knights","Year":"2011","Rated":"PG","Released":"07 Jun 2011","Runtime":"84 min","Genre":"Animation, Action, Adventure, Fantasy, Sci-Fi","Director":"Christopher Berkeley, Lauren Montgomery, Jay Oliva","Writer":"Michael Green, Marc Guggenheim, Peter Tomasi (story \"New Blood\"), Chris Samnee (story New Blood\"), Peter Tomasi, Dave Gibbons (story \"Mogo Doesn't Socialize\"), Dave Gibbons, Kevin O'Neill (story Tygers\"), Geoff Johns, Alan Burnett (story), Geoff Johns (story), Alan Burnett (screenplay), Todd Casey (screenplay), Ruben Diaz (story What Price Honor?\"), Travis Charest (story What Price Honor?\"), Eddie Berganza","Actors":"Nathan Fillion, Jason Isaacs, Elisabeth Moss, Henry Rollins","Plot":"As the home planet of the Green Lantern Corps faces a battle with an ancient enemy, Hal Jordan prepares new recruit Arisia for the coming conflict by relating stories of the first Green Lantern and several of Hal's comrades.","Language":"English","Country":"USA","Awards":"1 nomination.","Poster":"https://m.media-amazon.com/images/M/MV5BYjI4MTcyYzItMDQ3Ni00OWNmLWI2MGItYzczY2IxZDFiMzBlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"6.8/10"},{"Source":"Rotten Tomatoes","Value":"80%"}],"Metascore":"N/A","imdbRating":"6.8","imdbVotes":"12,856","imdbID":"tt1683043","Type":"movie","DVD":"16 Jun 2016","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  movie = {"Title":"The Invincible Iron Man","Year":"2007","Rated":"PG-13","Released":"23 Jan 2007","Runtime":"83 min","Genre":"Animation, Action, Adventure, Fantasy, Sci-Fi","Director":"Patrick Archibald, Jay Oliva, Frank Paur","Writer":"Avi Arad (story), Greg Johnson (story), Craig Kyle (story), Greg Johnson (screenplay), Stan Lee (comic book), Don Heck (comic book), Larry Lieber (comic book), Jack Kirby (comic book)","Actors":"Marc Worden, Gwendoline Yeo, Fred Tatasciore, Rodney Saulsberry","Plot":"When a cocky industrialist's efforts to raise an ancient Chinese temple leads him to be seriously wounded and captured by enemy forces, he must use his ideas for a revolutionary power armor in order to fight back as a superhero.","Language":"English","Country":"USA","Awards":"2 nominations.","Poster":"https://m.media-amazon.com/images/M/MV5BOGRmZDg1YjMtMDA5YS00OTFjLTgyMjQtNDgzNTIyNzAwZDg0L2ltYWdlL2ltYWdlXkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"5.9/10"}],"Metascore":"N/A","imdbRating":"5.9","imdbVotes":"6,993","imdbID":"tt0903135","Type":"movie","DVD":"06 Oct 2016","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  movie = {"Title":"The Wolverine","Year":"2013","Rated":"PG-13","Released":"26 Jul 2013","Runtime":"126 min","Genre":"Action, Sci-Fi","Director":"James Mangold","Writer":"Mark Bomback, Scott Frank","Actors":"Hugh Jackman, Will Yun Lee, Tao Okamoto","Plot":"Wolverine comes to Japan to meet an old friend whose life he saved years ago, and gets embroiled in a conspiracy involving yakuza and mutants.","Language":"English, Japanese","Country":"United States, United Kingdom, Japan","Awards":"2 wins & 11 nominations","Poster":"https://m.media-amazon.com/images/M/MV5BNzg1MDQxMTQ2OF5BMl5BanBnXkFtZTcwMTk3MjAzOQ@@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"6.7/10"},{"Source":"Rotten Tomatoes","Value":"71%"},{"Source":"Metacritic","Value":"61/100"}],"Metascore":"61","imdbRating":"6.7","imdbVotes":"486,435","imdbID":"tt1430132","Type":"movie","DVD":"01 Jun 2015","BoxOffice":"$132,556,852","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  movie = {"Title":"Justinian's Human Torches","Year":"1907","Rated":"N/A","Released":"01 Jun 1908","Runtime":"4 min","Genre":"Short","Director":"Georges Méliès","Writer":"N/A","Actors":"N/A","Plot":"Emperor Justinian is hosting a party, and, for the entertainment of his court, he has three victims of his choice tied to stakes, which are then set on fire.","Language":"None","Country":"France","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BMzg2N2FkNjctZmViNi00Y2M0LWIzMjYtMmJjN2M3YTRlNzFjXkEyXkFqcGdeQXVyNTI2NTY2MDI@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"5.0/10"}],"Metascore":"N/A","imdbRating":"5.0","imdbVotes":"176","imdbID":"tt0227669","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  movie = {"Title":"Batgirl: Year One","Year":"2009","Rated":"N/A","Released":"23 Jul 2009","Runtime":"75 min","Genre":"Animation, Action, Adventure","Director":"Stephen Fedasz IV","Writer":"Scott Beatty, Chuck Dixon, Marcos Martín (illustrated by: penciller), Alvaro Lopez (illustrated by: inker), Javier Rodriguez (illustrated by: colorist)","Actors":"Kate Higgins, Erin Fitzgerald, Lex Lang","Plot":"Defying her father, Barbara Gordon interviews with a Detective for a spot on the force. She later sneaks into the Justice Society to further her cause.","Language":"English","Country":"United States","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BZDhkNDY3NDEtZjY0Yy00YzQ5LTg2M2YtZTU5ZjNhY2NlMzMzXkEyXkFqcGdeQXVyMTEyNzgwMDUw._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"7.7/10"}],"Metascore":"N/A","imdbRating":"7.7","imdbVotes":"76","imdbID":"tt1757683","Type":"series","totalSeasons":"N/A","Response":"True"}
  movies.push(movie);
  movie = {"Title":"Dragon Ball Z: Bardock - The Father of Goku","Year":"1990","Rated":"Not Rated","Released":"17 Oct 1990","Runtime":"48 min","Genre":"Animation, Action, Drama","Director":"Mitsuo Hashimoto, Daisuke Nishio","Writer":"Akira Toriyama, Takao Koyama, Katsuyuki Sumizawa","Actors":"Masako Nozawa, Kazuyuki Sogabe, Yûko Mita","Plot":"The tale of Bardock, the father of Goku, and his rebellion against his master the mighty Frieza.","Language":"Japanese","Country":"Japan","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BMzFkMWM1M2YtYTMwYy00YWZhLWE0ZjktZjhiNTMwMjQ2ZjU5XkEyXkFqcGdeQXVyMzM4MjM0Nzg@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"7.8/10"}],"Metascore":"N/A","imdbRating":"7.8","imdbVotes":"6,015","imdbID":"tt0142245","Type":"movie","DVD":"N/A","BoxOffice":"$270,354","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  movie = {"Title":"Isis Rising: Curse of the Lady Mummy","Year":"2013","Rated":"N/A","Released":"18 Jan 2013","Runtime":"81 min","Genre":"Horror","Director":"Lisa Palenica","Writer":"Ted Chalmers, Annie T. Conlon, Lisa Palenica","Actors":"Priya Rai, James Bartholet, Michael C. Alvarez","Plot":"In ancient Egypt, Isis and Osiris ruled the land. All were happy for the couple except one, Set, a jealous man who killed Osiris in order to take over his kingdom. Isis snuck into Osiris' tomb and tried to raise him from the dead ...","Language":"English","Country":"United States","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BMjIzNTg2OTY3NV5BMl5BanBnXkFtZTcwMDMyNDA2OA@@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"1.8/10"}],"Metascore":"N/A","imdbRating":"1.8","imdbVotes":"419","imdbID":"tt2441232","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  movie = {"Title":"Underdog","Year":"2007","Rated":"PG","Released":"03 Aug 2007","Runtime":"84 min","Genre":"Action, Adventure, Comedy","Director":"Frederik Du Chau","Writer":"Adam Rifkin, Joe Piscatella, Craig A. Williams","Actors":"Peter Dinklage, Jason Lee, Amy Adams","Plot":"A Beagle must use his newly-bestowed superpowers to defend Capitol City from mad scientist Simon Barsinister.","Language":"English","Country":"United States","Awards":"3 nominations","Poster":"https://m.media-amazon.com/images/M/MV5BMTk5NjkyNzEwOV5BMl5BanBnXkFtZTcwODc5NDI1MQ@@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"4.8/10"},{"Source":"Rotten Tomatoes","Value":"14%"},{"Source":"Metacritic","Value":"37/100"}],"Metascore":"37","imdbRating":"4.8","imdbVotes":"22,519","imdbID":"tt0467110","Type":"movie","DVD":"08 Jul 2016","BoxOffice":"$43,760,605","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  movie = {"Title":"Superman II","Year":"1980","Rated":"PG","Released":"19 Jun 1981","Runtime":"127 min","Genre":"Action, Adventure, Sci-Fi","Director":"Richard Lester, Richard Donner","Writer":"Jerry Siegel, Joe Shuster, Mario Puzo","Actors":"Gene Hackman, Christopher Reeve, Margot Kidder","Plot":"Superman agrees to sacrifice his powers to start a relationship with Lois Lane, unaware that three Kryptonian criminals he inadvertently released are conquering Earth.","Language":"English, French, Russian","Country":"United States, United Kingdom, Canada","Awards":"3 wins & 7 nominations","Poster":"https://m.media-amazon.com/images/M/MV5BZDQzNjQwZjYtNjUzOS00MzAzLTg5NDYtN2MyNjVlYjhhYWFlXkEyXkFqcGdeQXVyNjc5NjEzNA@@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"6.8/10"},{"Source":"Rotten Tomatoes","Value":"83%"},{"Source":"Metacritic","Value":"83/100"}],"Metascore":"83","imdbRating":"6.8","imdbVotes":"113,104","imdbID":"tt0081573","Type":"movie","DVD":"15 Aug 2008","BoxOffice":"$108,185,706","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  movie = {"Title":"Return to the Batcave: The Misadventures of Adam and Burt","Year":"2003","Rated":"N/A","Released":"09 Mar 2003","Runtime":"90 min","Genre":"Action, Biography, Comedy","Director":"Paul A. Kaufman","Writer":"Duane Poole","Actors":"Adam West, Burt Ward, Jack Brewer","Plot":"When the Batmobile is stolen, Adam West and Burt Ward search for it while remembering their days as the stars of the Batman live action series.","Language":"English","Country":"United States","Awards":"1 nomination","Poster":"https://m.media-amazon.com/images/M/MV5BMTkwNTA2NjQzOV5BMl5BanBnXkFtZTcwMTIzNjgyMQ@@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"6.5/10"}],"Metascore":"N/A","imdbRating":"6.5","imdbVotes":"2,199","imdbID":"tt0321359","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  movie = {"Title":"Batman and Robin","Year":"1949","Rated":"Approved","Released":"26 May 1949","Runtime":"263 min","Genre":"Action, Adventure, Family","Director":"Spencer Gordon Bennet","Writer":"Bob Kane, George H. Plympton, Joseph F. Poland","Actors":"Robert Lowery, Johnny Duncan, Jane Adams","Plot":"The caped crusaders versus The Wizard, black-hooded mastermind.","Language":"English","Country":"United States","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BMTk3MzU1OTM2Nl5BMl5BanBnXkFtZTgwOTIyODM1MjE@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"5.9/10"}],"Metascore":"N/A","imdbRating":"5.9","imdbVotes":"2,071","imdbID":"tt0041162","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  movie = {"Title":"Scooby-Doo! Mystery Incorporated","Year":"2010–2013","Rated":"TV-Y7-FV","Released":"12 Jul 2010","Runtime":"23 min","Genre":"Animation, Adventure, Comedy","Director":"N/A","Writer":"Joe Ruby, Ken Spears, Mitch Watson","Actors":"Frank Welker, Mindy Cohn, Grey Griffin","Plot":"Scooby-Doo and the gang attempt to solve creepy mysteries in the town of Crystal Cove, a place with a history of eerie supernatural events.","Language":"English","Country":"United States","Awards":"9 nominations","Poster":"https://m.media-amazon.com/images/M/MV5BYjEwMzE1ZGMtMmQzNS00ZGRkLWJmZTQtM2Q3Y2Q5ZTg4ZjQwXkEyXkFqcGdeQXVyNjIyNDgwMzM@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"8.1/10"}],"Metascore":"N/A","imdbRating":"8.1","imdbVotes":"16,809","imdbID":"tt1660055","Type":"series","totalSeasons":"2","Response":"True"}
  movies.push(movie);
  movie = {"Title":"Alyas Batman at Robin","Year":"1965","Rated":"N/A","Released":"25 May 1965","Runtime":"N/A","Genre":"Comedy","Director":"Paquito Toledo","Writer":"Romy T. Espiritu, Marcelo B. Osorio, Bob Kane","Actors":"Bob Soler, Lou Salvador Jr., Nova Villa","Plot":"A Batman takeoff.","Language":"Filipino, Tagalog","Country":"Philippines","Awards":"N/A","Poster":"https://m.media-amazon.com/images/M/MV5BM2Y4Y2UzYTUtYWMwYS00ZDA0LThlMjEtOTkyNjVkYzBiNTI5XkEyXkFqcGdeQXVyMzYzNzc1NjY@._V1_SX300.jpg","Ratings":[{"Source":"Internet Movie Database","Value":"6.6/10"}],"Metascore":"N/A","imdbRating":"6.6","imdbVotes":"25","imdbID":"tt1228961","Type":"movie","DVD":"N/A","BoxOffice":"N/A","Production":"N/A","Website":"N/A","Response":"True"}
  movies.push(movie);
  return movies;
} // end function getFavoriteMovies 

// A poster in the footer has been clicked. Display it in the main poster area.
function footImageClick(ev) {
  myLog('Starting footImageClick.');
  target = ev.target;
  var movieNumber = target.getAttribute("movieNumber");
  currentMainMovie = movieNumber;  
  replaceMainMovie(currentMainMovie, "false");  // false => Not loaded due to timeout 
  currentMainMovie = (currentMainMovie + 1) % movies.length;
}  // end footImageClick

// function will change the movies in the posterScrollDiv
function scrollMovies() {
  const moviesAtOnce = 5;
  var posterDiv = document.getElementById('posterScrollDiv');
  posterDiv.setAttribute("display", "flex");  // does not work. Use style.display instead
  posterDiv.style.display = "flex";
  
  posterDiv.innerHTML = '';  // or could set text 
  for (var i=0; i<moviesAtOnce; i++) {
    currentMovie = (currentMovie + 1) % movies.length;  // pre-increment so not same starting moview as mainImg area
    var poster1 = document.createElement('div');
    posterDiv.appendChild(poster1);
    var img = document.createElement('img');
    poster1.appendChild(img);
    img.setAttribute("onclick", "footImageClick(event)"); 
    img.setAttribute("src", movies[currentMovie].Poster);
    img.setAttribute("alt", movies[currentMovie].Title + " Movie Poster");
    img.setAttribute("width", "50%");
    img.setAttribute("movieNumber", currentMovie);
  }
  setTimeout(scrollMovies, 4000);
} // end function scroll movies

// Scroll the main movie - includes fade-out, replace, fade-in
function scrollMainMovie() {
  const displayTime = 7000;  // display time before scrolling, in MS
  var mainImg = document.getElementById('main-img'); 
  var timeoutLoad = mainImg.getAttribute("timeoutLoad");
  myLog("Starting scroll main movie. timeoutLoad: " + timeoutLoad);
  if (timeoutLoad !== "true") {
    // either loaded originally or loaded by user. 
    myLog("Resetting MainMovie timer ... ");
    mainImg.setAttribute("timeoutLoad", "true");  // Attributes must be strings
    setTimeout("scrollMainMovie()", displayTime);
    return;
  }
  var op = parseFloat(mainImg.style.opacity);
  if (increaseMainMovieOpacity && op >= 1.0) {
    myLog("Beginning fade out. Opacity: " + op); 
    op = 1.0;
    increaseMainMovieOpacity = false; 
  } else if (!increaseMainMovieOpacity && op <= 0.0) {
    myLog("Changing movie and beginning fade in. Opacity: " + op);
    op = 0.0;
    increaseMainMovieOpacity = true;  
    replaceMainMovie(currentMainMovie, "true");  // true => loaded due to timeout
    currentMainMovie = (currentMainMovie + 1) % movies.length;
  }
  if (increaseMainMovieOpacity) {
    mainImg.style.opacity = 0.1 + op;  // number 1st - avoid string errs 
    if (mainImg.style.opacity >= 1.0) {
      myLog("Done fade in ... ");
      setTimeout("scrollMainMovie()", displayTime); 
      return;
    }
  } else {
    mainImg.style.opacity = op - 0.1; 
  }
  setTimeout("scrollMainMovie()", 100); // work w or wo quotes
} // scrollMainMovie

// Replace the Main move poster image and related text info.
// Uses movies[] global. 
function replaceMainMovie(currentMainMovie, timeoutLoadStr) {
  var movie = movies[currentMainMovie]; 
  var mainImg = document.getElementById('main-img'); 
  mainImg.setAttribute("timeoutLoad", timeoutLoadStr);
  mainImg.setAttribute("src", movie.Poster);
  var titleDiv = document.getElementById('main-title-div'); 
  titleDiv.textContent = movie.Title + " " + movie.Year;
  var detailDiv = document.getElementById('main-plot'); 
  detailDiv.textContent = movie.Plot;
  var detailDiv = document.getElementById('main-actors'); 
  detailDiv.textContent = movie.Actors;
  var detailDiv = document.getElementById('main-directors'); 
  detailDiv.textContent = movie.Director;
  var detailDiv = document.getElementById('main-rating'); 
  detailDiv.textContent = movie.Rated;
} // replaceMainMovie

// insert the scroll movie div at the end of main, and the main-movie section at the top
function insertMissingDivs() {

  // create posterDiv as last sibling of disclaimer - until it gets put in html by DeSean or Tayler
  var disclaimer = document.getElementById("disclaimer");
  // disclaimer.style.background = "purple";  // works
  var mainDiv = disclaimer.parentNode; // this should really be main as index is set up as of 1.5
  myLog("Main Div Tag: " + mainDiv.tagName);
  var posterDiv = document.createElement('div');
  mainDiv.appendChild(posterDiv);
  posterDiv.setAttribute("id", "posterScrollDiv"); 
  posterDiv.setAttribute("display", "flex");  // does not work. Use style.display instead
  posterDiv.style.display = "flex";
  posterDiv.style.backgroundColor = "blue";

  // Now create new "topSection" for 2 ps and image.
  // section is top section with 2 ps, and img
  var topSection = document.createElement('section');
  topSection.setAttribute("id", 'topSection');
  topSection.style.display = "flex";
  topSection.style.margin = "5px";
  topSection.style.padding = "5px";
  topSection.style.backgroundColor = "red";
  var parasDiv = document.createElement('div');
  topSection.appendChild(parasDiv);
  parasDiv.style.width = "40%";
  parasDiv.style.padding = "5px";
  parasDiv.style.backgroundColor = "purple";
  var mainImgCard = document.createElement('div');
  topSection.appendChild(mainImgCard);
  mainImgCard.style.width = "60%";
  mainImgCard.style.backgroundColor = "pink";
  mainImgCard.style.padding = "1%";
  var mainImgDiv = document.createElement('div');
  mainImgCard.appendChild(mainImgDiv);
  mainImgDiv.setAttribute("id", "main-img-div");
  //var mainImg = document.createElement('img');
  //mainImgDiv.appendChild(mainImg); 
  //var mainImg = document.getElementById('main-img');
  var mainTitleDiv = document.getElementById('main-title-div');
  //mainImgCard.appendChild(mainTitleDiv);
  //mainTitleDiv.setAttribute("id", "main-title-div");
  //mainTitleDiv.textContent = "Movie Title Year";
  var mainDetailDiv = document.getElementById('main-detail-div');
  //mainImgCard.appendChild(mainDetailDiv);
  //mainDetailDiv.setAttribute("id", "main-detail-div");
  //mainDetailDiv.textContent = "Movie Details";


  // firstChild will return text - which includes line-break in this case! - Use firstElementChild
  var firstKid = mainDiv.firstElementChild; // currently p welcome-msg
  if (firstKid === null || firstKid === undefined) {
    myLog("Firstkid is null-undef: " + firstKid);
  }
  myLog("firstKid " + firstKid.tagName);
  firstKid.style.backgroundColor = "yellow";
  // now take the prior first element of main, and insert it into new section
  parasDiv.appendChild(firstKid);
  var secondKid = mainDiv.firstElementChild; // should also be a p-tage
  secondKid.style.backgroundColor = "blue";
  parasDiv.appendChild(secondKid);

  // insert topSection before current first Element of mainDiv
  mainDiv.insertBefore(topSection, mainDiv.firstElementChild);
} // end insertMissingDivs

//insertMissingDivs(); 
var movies = getFavoriteMovies(); // array of movies with good posters
var currentMovie = 0; 
var currentMainMovie = 0;
var increaseMainMovieOpacity = true;
scrollMovies();
replaceMainMovie(currentMainMovie, "true");  // true => a timeoutLoad
currentMainMovie++;  
// scrollMainMovie(); // this will fade out immediately, 
setTimeout("scrollMainMovie()", 7000); 

var btn = document.getElementById("remove-button");
btn.setAttribute("onclick", "clearLocalStorageButtonClickFunction()"); 
// this doesn't work unless after localStorePrefix decleared.
localStoreQSHero(localStorePrefix);  // store hero from queryString if it exists 
displayStoredSearches();