var tableBody = document.getElementById('repo-table');
var fetchButton = document.getElementById('fetch-button');

function superheroSearch() {
    // fetch request gets a list of all the repos for the node.js organization
    console.log("Starting superheroSearch ... ");
    var requestUrl = 'http://api.github.com/orgs/nodejs/repos';
    var proxy = "http://cors-anywhere.herokuapp.com/";
    var comicvineUrl = "https://comicvine.gamespot.com/api/search/";
    var key = "?api_key=5b3917a296c5dc353759db648ae26bbc1bf525ba"; 
    var format = "&format=json";
    var resources = "&resources=issue&query=Feynman";
    requestUrl = comicvineUrl + key + format + resources;
    requestUrl = proxy + comicvineUrl + key + format + resources;
    // https://comicvine.gamespot.com/api/search/?api_key= api_key&format=json&limit=1&offset=0
    // &field_list=id,name,deck,volume&sort=name:asc&resources=issue&query=Feynman
    console.log("request url: " + requestUrl);

    fetch(requestUrl)
      .then(function (response) {
        console.log("Response is: " + response);
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
          // link.textContent = data[i].html_url;
          // link.href = data[i].html_url;
  
          // Appending the link to the tabledata and then appending the tabledata to the tablerow
          // The tablerow then gets appended to the tablebody
          tableData.appendChild(link);
          createTableRow.appendChild(tableData);
          tableBody.appendChild(createTableRow);
        }
      });
  }

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

fetchButton.addEventListener('click', superheroSearch);
