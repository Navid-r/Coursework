"use strict";
function getMatchesList() {
    debugger;
    console.log("Invoked getMatchesList()");     //console.log your BFF for debugging client side - also use debugger statement
    const url = "/matches/list/";    		// API method on web server will be in Matches class, method list
    fetch(url, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            formatMatchesList(response);          //this function will create an HTML table of the data (as per previous lesson)
        }
    });
}

function formatMatchesList(myJSONArray){
    let dataHTML = "";
    for (let item of myJSONArray) {
        dataHTML += "<tr><td>" + item.MatchID + "<td><td>" + item.VOD + "<tr><td>";
    }
    document.getElementById("MatchesTable").innerHTML = dataHTML;
}