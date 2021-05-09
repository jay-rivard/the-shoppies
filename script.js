window.addEventListener("load", fillNominations, false);
window.addEventListener("load", fillResults, false);
window.addEventListener("load", function() {
    document.querySelectorAll("button").forEach(element => function() {
        element.addEventListener("click", fillResults, false);
    });
});

// Fills the result box on page load
function fillResults() {
    let urlParams = new URLSearchParams(window.location.search);
    
    if(urlParams.has('searchTerm')) {
        // Clearing the result box
        var resultBox = document.getElementById("results");
        resultBox.innerHTML = "";
        // The search term
        let searchTerm = urlParams.get('searchTerm').toLowerCase();
        // The address in the OMDB API to be retrieved from 
        var searchAddress = "https://www.omdbapi.com/?s=" + searchTerm + "&type=movie&apikey=e249cfec";

        // Fetches the data from the search address and appends each film to the result box
        fetch(searchAddress)
            .then(response => response.json())
            .then(data => {
                data.Search.forEach(element => {
                    if(window.localStorage.length === 5) {
                        resultBox.innerHTML += '<div id="singleResult"><span class="d-flex justify-content-between"><h4 class="movie-title d-inline"><b>' + element.Title + '</b> (' + element.Year + ')</h4> <button disabled onclick="nominateFilm()" type="button" class="d-inline btn btn-outline-dark custom-button movie-title" x' + element.Title.replace(/\s|\W/g,'') + '="true" id="nominate-button">NOMINATE</button></span><div class="row"><div class="col-md-4"><img alt="Image Not Found" src="'+ element.Poster +'" class="result-image"></div></div><hr></div>';
                    } else {
                        resultBox.innerHTML += '<div id="singleResult"><span class="d-flex justify-content-between"><h4 class="movie-title d-inline"><b>' + element.Title + '</b> (' + element.Year + ')</h4> <button onclick="nominateFilm()" type="button" class="d-inline btn btn-outline-dark custom-button movie-title" x' + element.Title.replace(/\s|\W/g,'') + '="true" id="nominate-button">NOMINATE</button></span><div class="row"><div class="col-md-4"><img alt="Image Not Found" src="'+ element.Poster +'" class="result-image"></div></div><hr></div>';
                    }
                });
            })
            .catch(error => resultBox.innerHTML = '<h5 class="text-secondary">No Results Found :(</h5>')
    }
}

// Fills the nominations box on page load
function fillNominations() {
    if(window.localStorage.length > 0) {
        var nominationBox = document.getElementById("nominations");
        var keys = Object.keys(window.localStorage);
        var i = keys.length;

        if(window.localStorage.length === 5) {
            document.getElementById("checkmark-img").hidden = 0;
        }
    
        while(i--) {
            // Add the item to the nominations box
            nominationBox.innerHTML += window.localStorage.getItem(keys[i]);
        }    
    }
}


// Adds a film to the nominations box and local storage
function nominateFilm() {
    // If localStorage is below 5 add film normally
    if(window.localStorage.length < 5) {
        var nominationBox = document.getElementById("nominations");
        var selectedButton = event.target;
        // Title node of the film to be nominated
        var temp = selectedButton.previousSibling.previousSibling.innerHTML;
        // Takes out the year of release from the title
        var movieTitleNoSpaces = temp.substring(0, temp.lastIndexOf("(")).replace(/\s|\W|[\<b\>]/g,'');

        if(window.localStorage.getItem(movieTitleNoSpaces)) {
            Swal.fire('Film Already Nominated!','','error');
        } else {
            // Changes the button to be added to the nominations box (as well as the search items)
            selectedButton.setAttribute("onclick", "removeFilm()");
            selectedButton.setAttribute("id", "remove-button");
            selectedButton.setAttribute("class", "d-inline btn btn-outline-danger custom-button");
            selectedButton.innerHTML = "REMOVE";
            // The entire div of the film to be nominated
            var selectedItem = event.target.parentElement.parentElement.outerHTML;

            // Put the item into local storage
            window.localStorage.setItem(movieTitleNoSpaces, selectedItem);
            // If localStorage is at 5 after having added the item -> add checkmark img and disable buttons
            if(window.localStorage.length === 5) {
                document.getElementById("checkmark-img").hidden = 0;
                document.querySelectorAll("#nominate-button").forEach(element => function(){
                    element.disabled = true;
                    element.innerHTML = "NOMINATIONS FULL"
                })
            }

            // Adds the edited div to the nomination box
            nominationBox.innerHTML += selectedItem;

            // Disable the button (on the search item)
            selectedButton.disabled = true;
            selectedButton.innerHTML = "NOMINATED";

            // SweetAlert success alert
            Swal.fire('Added To Nominations!','','success');
        }

    }
    // Else if localStorage is === 5 alert user that nominations are full
    else {
        Swal.fire('Your nominations are full!', '', 'error');
    }
}


// Removes a film from the nominations box and localStorage
function removeFilm() {

    // SweetAlert success alert
    Swal.fire('Removed From Nominations!','','success');

    // Button which was pressed
    var selectedButton = event.target;
    // Title node of the film to be nominated
    var temp = selectedButton.previousSibling.previousSibling.innerHTML;
    // Takes out the year of release from the title
    var movieTitleNoSpaces = temp.substring(0, temp.lastIndexOf("(")).replace(/\s|\W|[\<b\>]/g,'');

    // The entire div of the film to be removed
    var selectedItem = event.target.parentElement.parentElement;
    // Removing the selected film from the nominations box
    selectedItem.parentElement.removeChild(selectedItem);

    // Removes the selected item from localStorage
    window.localStorage.removeItem(movieTitleNoSpaces);
    // If localStorage is less than 5 after deleting the item -> take off the checkmark img
    if(window.localStorage.length < 5) {
        document.getElementById("checkmark-img").hidden = 1;
    }

    // The button of the corresponding film in the search box
    searchMovieButton = document.getElementById("results").querySelector("button[x" + movieTitleNoSpaces + "]")
    // Changing the button's attributes to reflect a nominate button
    searchMovieButton.setAttribute("onclick", "nominateFilm()");
    searchMovieButton.setAttribute("id", "nominate-button");
    searchMovieButton.setAttribute("class", "d-inline btn btn-outline-dark custom-button");
    searchMovieButton.innerHTML = "NOMINATE";
    searchMovieButton.disabled = false; 
}
