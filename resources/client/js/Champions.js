"use strict";
function getChampionsList() {
    debugger;
    console.log("Invoked getChampionsList()");     //console.log your BFF for debugging client side - also use debugger statement
    const url = "/champions/championslist/";    		// API method on web server will be in Champions class, method list
    fetch(url, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            formatChampionsList(response);          //this function will create an HTML table of the data (as per previous lesson)
        }
    });
}



function formatChampionsList(myJSONArray){
    let dataHTML = "<tr><th>Index</th><th>Champion</th></tr>";
    for (let item of myJSONArray) {
        dataHTML += "<tr>" + "<td>" + item.ChampionID + "</td>" + "<td>" + item.ChampionName + "</td>"  + "</tr>";
    }
    document.getElementById("ChampionsTable").innerHTML = dataHTML;
}