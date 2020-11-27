"use strict";
function getProsList() {
    debugger;
    console.log("Invoked getProsList()");     //console.log your BFF for debugging client side - also use debugger statement
    const url = "/Pros/list/";    		// API method on web server will be in Pros class, method list
    fetch(url, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            formatProsList(response);          //this function will create an HTML table of the data (as per previous lesson)
        }
    });
}

function formatProsList(myJSONArray){
    let dataHTML = "";
    for (let item of myJSONArray) {
        dataHTML += "<tr><td>" + item.ProID + "<td><td>" + item.ProName + "<tr><td>";
    }
    document.getElementById("ProsTable").innerHTML = dataHTML;
}