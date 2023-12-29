// MJS 12.25.23 - URI coding bootcamp class - Group Project 1 
// Mike Sheliga, Tayler Baldwin, De'Sean Pair
// Search for movies in tmdb API using superhero key in query string. 
// Use results to search for more details in omdb API. Display to DOM. 
// Also, if new superhero, save to local storage.
myLog("First line in details.js");
const MaxMoviesToDisplay = 8; 
// Following "global" variables better inside of setInterval, but ok for this assignment.
// Javascript has "run time completion", so there is no need to lock variables.
var starts = 0;    // movies weve begun to try to find
var founds = 0;    // movies weve found data for
var foundStr = "Movies Found: ";
var missings = 0;  // movies were done with (either found or not) global to access-print inside promises.
var missingStr = "Movies Missing Data: ";
var waitFetchResultsInterval = null;  // must await URL fetch results, before starting more searches (if data missing)
var ticks = 0;     // for clock for waiting for fetches (which may come back 404 or missing matching data)
var results = null;  // results of superhero-movie search (needed by timer)
var storeHero = false;  // storeHero returned in queryString only if a movie is found.
superheroMovieSearch();

// get movieName from the URL ... search and update DOM ... if query "store" exists, also store if movies found.
function superheroMovieSearch() {  
    // fetch request gets a list of all the repos for the node.js organization
    console.log("Starting superheroMovieSearch routine ... " + dayjs().format("YYYY-MM-DD"));
    // the movie database TMDB - https://developer.themoviedb.org/reference/search-movie 
    //      --url 'https://api.themoviedb.org/3/search/keyword?query=robin&page=1' \
    //      --url 'https://api.themoviedb.org/3/search/keyword?page=1' 
    //      --url 'https://api.themoviedb.org/3/movie/11?api_key=API_KEY'
    //      --url 'https://api.themoviedb.org/3/search/movie?query=batman&include_adult=false&language=en-US&page=1' 
    //      --url 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false
    //                  &language=en-US&page=1&sort_by=popularity.desc&with_keywords=xfed'
    var tmdbBase = 'https://api.themoviedb.org/3/';
    var tmdbKey = "&api_key=3650890ee576ab501048374acf28df97";
    var tmdbkeyBeg = '?api_key=3650890ee576ab501048374acf28df97';
    var tmdbSearchMovie = 'search/movie';
    var tmdbDiscoverMovie = 'discover/movie'; 
    var tmdbPage = "&page=1";
    var heroName = getQueryValue("search");  // "batman";
    var tmdbQueryBeg = "?query=" + heroName;
    // tmdb discover movie allows for sorting, but only with keyword and superheros are not keywords 
    var requestUrl = tmdbBase + tmdbSearchMovie + tmdbQueryBeg + tmdbPage + tmdbKey;
    myLog("Simple tmdb request url: " + requestUrl);

    fetch(requestUrl)
      .then(function (response) {
        console.log("Superhero tmdb Response is: " + response + " Status: " + response.status);
        console.log('Stringified response is ' + JSON.stringify(response));
        // console.log('response.text is: ' + response.text());
        return response.json();    // return response.text();
      })
      .then(function (data) {
        if (data.total_results === 0) {
            myLog("No superhero results found ");
            addNoMoviesFoundToDom("No movies found for superhero " + heroName);
            var backBtn = document.getElementById("back-btn");
            backBtn.addEventListener("click", backToSearch);  // dont allow back until done searching for movie.
            return;
        }
        console.log("Data - JSON stringified is: " + JSON.stringify(data));
        // console.log("Datalen " + data.length);  // will show #characters if response.text pass in
        console.log("Data.page is " + data.page + " of " + data.total_pages + " Results: " + data.total_results);
        results = data.results;  // global since needed by timer event handler
        myLog("Superhero Movies Results length is " + results.length);
        addMovieSummaryToDom(results);
        waitFetchResultsInterval = setInterval(movieTimeHandler, 1000)
      });  // end .then-function
  } // end function superheroMovieSearch

  // Every second, check how many movies have been found or are missing. 
  // If movie is missing from detailedDB, look for more.
  // If found enough detailed data, exit.
  // If no more movies to search through, exit. 
  // Better to put waitFetchResultsInterval and ticks inside of superHeroSearch, instead of making them global, 
  // but then this method must also go inside superheroSearch ... just sticking with globals for this project. 
  // Uses globals: tick, results, waitFetchResultsInterval
  function movieTimeHandler() {
      ticks++;
      myLog("Starting movieTimeHandler tick number " + ticks);
      if (ticks > 10) {  // to prevent infinite loops - if code below has an error.
        myLog ("TimeOut after " + ticks + " ticks");
        clearInterval(waitFetchResultsInterval);
      }
      var done = false;
      var loggedStartedAll = false;
      var startIndex = starts;  // dont look up movies previously started
      var inProgress = starts - missings; // if we've looked up 6 movies, but 2 are missing look up 2 more.
      var endIndex = starts + MaxMoviesToDisplay - inProgress - 1; 
      var simpleFound = results.length; 
      endIndex = Math.min(endIndex, simpleFound - 1);
      // starts is moviesPreviouslyStarted
      if (startIndex <= endIndex) {
        myLog("Looking for Detailed data for movies " + startIndex + "-" + endIndex);
      }
      for (var i = startIndex; i <= endIndex; i++) {
        // dont ever expect this to return a result of a fetch, since fetch asynchronous
        var releaseDayjs = dayjs(results[i].release_date); // beware original format YYYY-MM-DD
        getMovieDetails(results[i].title, releaseDayjs);  // updates starts immediately, founds and missings after fetch URL
      }
      if (starts >= simpleFound && ! loggedStartedAll) {  
        // done = true; // wait until move results back (to figure out which response missing)
        myLog("Started fetching data for all " + starts + " movies");
        loggedStartedAll = true;  // so msg doesn't repeat
      }
      if (founds + missings >= simpleFound) {
        myLog("Results returned for all movies: " + simpleFound);
        done = true;
      }
      if (founds >= MaxMoviesToDisplay) { 
        done = true;
        myLog("Found " + founds + " movies ... returning.");
      }
      if (ticks > 10) { 
        done = true; 
        myLog("TimeOut after " + ticks + " ticks");
      }
      if (done) {  // turn off the timer, sometimes add NoMovie msg, set storeHero, add back button handler.
        myLog("DONE SEARCHING: Starts: " + starts + " missings: " + missings + ' Found: ' + founds);
        myLog("Founds: " + foundStr + " \n " + "Missings: " + missingStr);
        clearInterval(waitFetchResultsInterval);
        heroName = getQueryValue("search");
        storeTF = getQueryValue("store");
        myLog("Done searching for " + heroName + " storing: " + storeTF);
        if (founds <= 0) {
            addNoMoviesFoundToDom("No detailed movie data found for superhero "  + heroName);       
        } else if (storeTF === "true") {
            storeHero = true;  // used by back btn
        }
        var backBtn = document.getElementById("back-btn");
        backBtn.addEventListener("click", backToSearch);  // dont allow back until done searching for movie.
    }  // end if done
  }  // end movieTimeHandler

  // get Movie detail info for 1 movies from omdb API - /www.omdbapi.com - write it to the DOM
  // Mark movie data in DOM table if found, and if release date near parameter.
  function getMovieDetails(movieNameStr, simpleReleaseDayjs) {
    // fetch request gets a list of all the repos for the node.js organization
    myLog("Getting Movie " + movieNameStr + " released " + simpleReleaseDayjs.format('MM-DD-YYYY'));
    starts++;  // number of movies weve tried to get data for.
    var requestUrl = "http://www.omdbapi.com/";
    var apiKey ="&apikey=7b6e5d01";  // beware this is an "open" key 7b6e5d01
    var title = "?t=" + movieNameStr;
    requestUrl += title + apiKey;   // fails unless apiKey is last! - arghhhh.
    myLog("Requesting url " + requestUrl);
    fetch(requestUrl)
      .then(function (response) {
        myLog("getMovieDetails " + movieNameStr + " fetched response ... status: " + response.status);
        return response.json();
      })
      .then(function (data) {  // data is a json object here
        myLog("Movie Detail Data is " + data);
        myLog("Movie Detail Data stringified: " + JSON.stringify(data));
        // Make sure release dates are within 1 year of eachother ... else return 
        myLog("MovieDetail Title " + data.Title + " Year " + data.Year + " Rated " + data.Rated);  // caps count!
        if (movieDetailsFound(data, simpleReleaseDayjs)) {
          addMovieDetailsToDom(data);
          founds++;
          foundStr += movieNameStr + "\n"
        } else {
          missings++;  // finished but without proper data - 404, response "False" or bad release date
          missingStr += movieNameStr + "\n"
        }
        myLog("Done with " + movieNameStr + " Starts: " + starts + " Missings: " + missings + " Founds: " + founds);
      }) // end .then-function
      // cant pass back result dependent upon URL here, as fetch URL call is asynchronouse
      myLog("Exiting getMovieDetails ... for " + movieNameStr);
    }  // end getMovieDetails

    // have valid Movie Details been found (found, same name, release date within 1 year)
    // Returns a boolean, no side effects except for logging.
    // movie not found => 200 {"Response":"False","Error":"Movie not found!"}
    function movieDetailsFound(data, simpleReleaseDayjs) {    
      if (data.Response.toLowerCase() === "false") {
        myLog("No data found for movie.");
        return false;
      }

      var detailReleaseDayjs = dayjs(data.Released);
      if (! simpleReleaseDayjs.isSame(detailReleaseDayjs)) {
        var logStr = "Original date " + simpleReleaseDayjs.format("MM-DD-YYYY");
        logStr += " doesn't match detail date of " + detailReleaseDayjs.format('MM-DD-YYYY'); 
        if (simpleReleaseDayjs.isBefore(detailReleaseDayjs.add(1, 'year'))  && 
          simpleReleaseDayjs.isAfter (detailReleaseDayjs.subtract(1, 'year'))) {
              logStr += " ... accepting release dates since within 1 year.";
              myLog(logStr);
           } else {
              logStr += " release dates not within 1 year ... returning ... ";
              myLog(logStr);
              return false;  // only returns from .then
           }
      } // end if not same release dates
      return true;
    } // end function boolean movieDetailsFound

// ================= Event Handlers ==================================
// load the relative Url, a query store string and change 
function backToSearch() {
    // got rid of / before ?, so one less ../ in Url below MJS 12.29
    var indexUrl = "../../index.html";  
    if (storeHero) {
        indexUrl += "?store=" + getQueryValue("search");  // pass heroName back if needed for localStorage
    }
    alert("Back Button Hit .... returning to " + indexUrl);
    for (var i=0; i<100000; i++) {  // to see log msg before page swap
    }
    // localStoreHero(heroName);  // local storage changes from page to page ... must pass heroName back to main page.
    location.href = indexUrl;
    // no code executes after location (ie web page) is changed.
}  // end function BackToSearch

// ---------------------- Add to DOM Accessory methods ----------------------------------------
// Summary Movie data (tmdb API) has been confirmed found, add it to the DOM
function addMovieSummaryToDom(results) {
        var tableBody = document.getElementById('movie-table'); 
        // Loop over the data to generate a table row, each table row will have data
        for (var i = 0; i < results.length; i++) {
          // Creating elements, tablerow, tabledata
          var title = results[i].title; 
          var releaseDate = results[i].release_date;  // beware format YYYY-MM-DD
          var releaseDayjs = dayjs(releaseDate);
          var rowStr = "Row " + i + " " + title + " " + releaseDate;
          myLog(rowStr + " Pop: " + results[i].popularity + " VAvg " + results[i].vote_average);
          var tableRow = document.createElement('tr');
          var tableData = document.createElement('td');
          tableData.textContent = "" + i + ". " + title;  
          // Aappend the tabledata to the tablerow, and append tableRow to the tablebody
          tableRow.appendChild(tableData);
          tableBody.appendChild(tableRow);
        }  // end for
}  // end addMovieSummaryToDom

// Detailed movie data has been confirmed good, add it to the DOM
function addMovieDetailsToDom(data) {
    var tableBody = document.getElementById('movie-table'); 
    // Generate a table row
    var ratings = data.Ratings;
    var tableRow = document.createElement('tr');
    tableBody.appendChild(tableRow);
    var tdTitle = document.createElement('td');
    tableRow.appendChild(tdTitle);
    var tdYear = document.createElement('td');
    tableRow.appendChild(tdYear);
    var tdRated = document.createElement('td');
    tableRow.appendChild(tdRated);
    tdTitle.textContent = data.Title;
    tdYear.textContent = data.Year;
    tdRated.textContent = data.Rated;
    for (var i = 0; i < ratings.length; i++) {
      // Appending the link to the tabledata and then appending the tabledata to the tablerow
      // The tablerow then gets appended to the tablebody
      // Creating elements, tablerow, tabledata, and anchor
      if (i !== 0) {  // title, year, rated filled already filled in for row 0
        var tableRow = document.createElement('tr');
        tableBody.appendChild(tableRow);
        var tdTitle = document.createElement('td');
        tableRow.appendChild(tdTitle);
        var tdYear = document.createElement('td');
        tableRow.appendChild(tdYear);
        var tdRated = document.createElement('td');
        tableRow.appendChild(tdRated);
      }
      var tdSource = document.createElement('td');
      tableRow.appendChild(tdSource);
      tdSource.textContent = ratings[i].Source;
      var tdSource = document.createElement('td');
      tableRow.appendChild(tdSource);
      tdSource.textContent = ratings[i].Value;
      myLog("Ratings for ... " + ratings[i].Source);
    } // end for
}  // end addMovieDetailsToDom

// No Movie data at all exists ... add msg to DOM
function addNoMoviesFoundToDom(msg) {
    var tableBody = document.getElementById('movie-table');
    // Generate a table row
    var tableRow = document.createElement('tr');
    tableBody.appendChild(tableRow);
    var tdEl= document.createElement('td');
    tableRow.appendChild(tdEl);
    tdEl.textContent = msg;
}  // end addNoMoviesFoundToDom

  
// ----------------------- Accesssory methods -----------------------  
function myLog(logStr) {  // to turn on/off all console.loggging
  console.log(logStr); 
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

// unused sample function from URI class showing use of .fetch and .thens
function getApi() {
  // fetch request gets a list of all the repos for the node.js organization
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
      //Loop over the data to generate a table, each table row will have a link to the repo url
      for (var i = 0; i < data.length; i++) {
        // Creating elements, tablerow, tabledata, and anchor
        var createTableRow = document.createElement('tr');
        var tableData = document.createElement('td');
        var link = document.createElement('a');

        // Setting the text of link and the href of the link
        link.textContent = data[i].html_url;
        link.href = data[i].html_url;

        // Appending the link to the tabledata and then appending the tabledata to the tablerow
        // The tablerow then gets appended to the tablebody
        tableData.appendChild(link);
        createTableRow.appendChild(tableData);
        tableBody.appendChild(createTableRow);
      }
    });
}

// Reference Routine - Various tries to comicVine API and TMDB API 
// comicVine has CORS err, fixable with heroku, but heroku requires a button push to activate. ("once or twice a day")
// https://cors-anywhere.herokuapp.com/corsdemo
// TMDB returns only 1 page (of up to many) of movies at a time.
// Movies can be sorted, but only using discover-keywords, and superheroes are not keywords.
// IMDB requires an AWS account. https://rapidapi.com/blog/movie-api/ has 7, but MoviesDatabase, MoviesMiniDatabase, 
// GoWatch, uNoGS seem no better. 
function superheroSearchOld() {
  // fetch request gets a list of all the repos for the node.js organization
  console.log("Starting superhero Search routine ... ");
  var requestUrl = 'http://api.github.com/orgs/nodejs/repos';
  // tried http-https, w/wout heroku proxy. GitHubIO. - xx Nothing worked.
  // this proxy works ONLY after requesting permission (by a single button click) https://cors-anywhere.herokuapp.com/corsdemo
  var proxy = "https://cors-anywhere.herokuapp.com/";
  var comicvineUrl = "https://comicvine.gamespot.com/api/search/";
  var key = "?api_key=5b3917a296c5dc353759db648ae26bbc1bf525ba"; 
  var format = "&format=json";
  var limit = "&limit=2&offset=0&field_list=id,name,deck,volume&sort=name:asc"
  var resources = "&resources=issue&query=Batman";
  // the movie database TMDB - https://developer.themoviedb.org/reference/search-movie 
  //      --url 'https://api.themoviedb.org/3/search/keyword?query=robin&page=1' \
  //      --url 'https://api.themoviedb.org/3/search/keyword?page=1' 
  //      --url 'https://api.themoviedb.org/3/movie/11?api_key=API_KEY'
  //      --url 'https://api.themoviedb.org/3/search/movie?query=batman&include_adult=false&language=en-US&page=1' 
  //      --url 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false
  //                  &language=en-US&page=1&sort_by=popularity.desc&with_keywords=xfed'
  var tmdbkey = "&api_key=3650890ee576ab501048374acf28df97";
  var tmdb = 'https://api.themoviedb.org/3/search/keyword?query=robin&page=1';
  var tmdb2 = 'https://api.themoviedb.org/3/movie/11';
  var tmdb3 = 'https://api.themoviedb.org/3/search/movie?query=batman&language=en-US&page=2';
  var tmdbUrl5 = 'https://api.themoviedb.org/3/discover/movie?with_people=287&sort_by=vote_average.desc' + tmdbkey;
  var tmdbUrl6 = 'https://api.themoviedb.org/3/discover/movie?with_keywords=4344&sort_by=vote_average.desc' + tmdbkey;
  // tmdb discover movie allows for sorting
  var tmdbBase = 'https://api.themoviedb.org/3/';
  var tmdbDiscMovie = 'discover/movie'; 
  var tmdbQuery = '?include_video=false&language=en-US&page=1&with_keywords=wonka&sort_by=popularity.desc';
  var tmdbUrl4 = tmdbBase + tmdbDiscMovie + tmdbQuery + tmdbkey;
  var tmdbkey2 = '?api_key=3650890ee576ab501048374acf28df97';
  var tmdbUrl = tmdb3 + tmdbkey; 
  var tmdbUrl2 = tmdb2 + tmdbkey2;
  requestUrl = comicvineUrl + key + format + limit + resources;
  requestUrl = proxy + comicvineUrl + key + format + limit + resources;
  requestUrl = tmdbUrl6;
  // https://comicvine.gamespot.com/api/search/?api_key= api_key&format=json&limit=1&offset=0
  // &field_list=id,name,deck,volume&sort=name:asc&resources=issue&query=Feynman
  console.log("request url: " + requestUrl);
  var xhr = new XMLHttpRequest();

  fetch(requestUrl)
    .then(function (response) {
      console.log("Response is: " + response);
      console.log("xhr.response is: " + xhr.response);
      console.log('Stringified response is ' + JSON.stringify(response));
      // console.log('response.text is: ' + response.text());
      return response.json();
      // return response.text();
    })
    .then(function (data) {
      console.log("JSON stringified is: " + JSON.stringify(data));
      // console.log("Datalen " + data.length);  // will show #characters if response.text pass in
      console.log("Data.page is " + data.page + " of " + data.total_pages + " Results: " + data.total_results);
      var results = data.results;
      console.log("Results length is " + results.length);
      // + " data: " + data);  // works with return response.text
      // const parser = new DOMParser();
      // const xmlDOM = parser.parseFromString(data,"text/xml");
      //  const value = xmlDOM.getElementsByTagName("string")[0].childNodes[0].nodeValue;
      // console.log(value);
      //Loop over the data to generate a table, each table row will have a link to the repo url
      for (var i = 0; i < results.length; i++) {
        // Creating elements, tablerow, tabledata, and anchor
        var title = results[i].title; 
        getMovie(title); 
        var rowStr = "Row " + i + " " + title + " " + results[i].release_date;
        console.log(rowStr + " Pop: " + results[i].popularity + " VAvg " + results[i].vote_average);
        var createTableRow = document.createElement('tr');
        var tableData = document.createElement('td');
        var link = document.createElement('a');

        // Setting the text of link and the href of the link
        // link.textContent = data[i].html_url;
        // link.href = data[i].html_url;

        // Appending the link to the tabledata and then appending the tabledata to the tablerow
        // The tablerow then gets appended to the tablebody
        tableData.appendChild(link);
        createTableRow.appendChild(tableData);
        tableBody.appendChild(createTableRow);
      }
    });
} // end function superheroSearchOld
