"use strict";
function getProsList() {
    debugger;
    console.log("Invoked getProsList()");     //console.log for debugging client side - also use debugger statement
    const url = "/pros/proslist/";    		// API method on web server will be in Pros class, method list
    fetch(url, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert
        } else {
            formatProsList(response);          //this function will create a HTML table of the data
        }
    });
}

function formatProsList(myJSONArray) {
    if (myJSONArray[0] == undefined) { //if the ProName does not exist in the case of inputting non existent names
        alert("Error - ProName does not exist or is written with incorrect case"); //error for debugging
    } else {

        let dataHTML = "<tr><th>Name</th><th>Position</th><th>Average Kills</th><th>Average Deaths</th><th>Average Assists</th><th>KDA</th></tr>"; //table headings for clarity
        for (let item of myJSONArray) {
            dataHTML += "<tr>" + "<td>" + item.ProName + "</td>" + "<td>" + item.Position + "</td>" + "<td>" + item.AverageKills + "</td>" + "<td>" + item.AverageDeaths + "</td>" + "<td>" + item.AverageAssists + "</td>" + "<td>" + item.KDA + "</td>" + "</tr>";//formatting of the table so that each of the data items is in the correct column
        }
        if (myJSONArray.length !== 1){ //checks the length of the array, if there is only 1 player it will edit the Pro table, otherwise it will edit the Pros table
            document.getElementById("ProsTable").innerHTML = dataHTML;
        }else{
            document.getElementById("ProTable").innerHTML = dataHTML;
        }//links to the table in pros.html
    }
}
function getPro(ProName) { //fetches the a particular pro
    debugger;
    console.log("Invoked getPros()");     //console.log for debugging client side - also uses debugger statement
    const url = "/pros/getPro/";    		// API method on web server will be in Pros class
    fetch(url + ProName, {
        method: "GET",				//GET method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));// if it does, convert JSON object to string and alert (pop up window)
        } else {
            formatProsList(response);          //this function will create an HTML table of the data but in this case a single record
        }
    });
}
function valPros(){  //function for validating user inputs for ProName
    debugger;
    console.log("Invoked Pros()"); //invoke for debugging
    let formData = new FormData(document.getElementById('ProsForm')) // links to the form on the Pros.html page
    if (formData.get('ProName').length < 2 || formData.get('ProName').length >15){
        alert("Error - ProName must be within the 2-15 character boundary"); //error for debugging
    }else {
        getPro(formData.get('ProName'))//calls getPros
    }
}