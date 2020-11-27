"use strict";
function getPoolsList() {
    debugger;
    console.log("Invoked getPoolsList()");     //console.log your BFF for debugging client side - also use debugger statement
    const url = "/pools/list/";    		// API method on web server will be in Pools class, method list
    fetch(url, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            formatPoolsList(response);          //this function will create an HTML table of the data (as per previous lesson)
        }
    });
}

function formatPoolsList(myJSONArray){
    let dataHTML = "";
    for (let item of myJSONArray) {
        dataHTML += "<tr><td>" + item.ProID + "<td><td>" + item.ChampionID + "<tr><td>";
    }
    document.getElementById("PoolsTable").innerHTML = dataHTML;
}