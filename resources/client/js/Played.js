"use strict";
function getPlayedList() {
    debugger;
    console.log("Invoked getPlayedList()");     //console.log your BFF for debugging client side - also use debugger statement
    const url = "/played/list/";    		// API method on web server will be in Played class, method list
    fetch(url, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            formatPlayedList(response);          //this function will create an HTML table of the data (as per previous lesson)
        }
    });
}

function formatPlayedList(myJSONArray){
    let dataHTML = "";
    for (let item of myJSONArray) {
        dataHTML += "<tr><td>" + item.TeamID + "<td><td>" + item.MatchID + "<tr><td>";
    }
    document.getElementById("PlayedTable").innerHTML = dataHTML;
}