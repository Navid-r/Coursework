"use strict";
function getChampionsList() {
    debugger;
    console.log("Invoked getChampionsList()");     //console.log for debugging client side - also use debugger statement
    const url = "/champions/championslist/";    		// API method on web server will be in Champions class
    fetch(url, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert
        } else {
            formatChampionsList(response);          //this function will create a HTML table of the data
        }
    });
}

function formatChampionsList(myJSONArray) {
    if (myJSONArray[0] == undefined) { //if the ChampionName does not exist in the case of inputting non existent names
        alert("Error - ChampionName does not exist or is written with incorrect case"); //error for debugging
    } else {

        let dataHTML = "<tr><th>Champion</th><th>Position</th><th>Wins</th><th>Losses</th><th>Win Rate</th></tr>"; //table headings for clarity
        for (let item of myJSONArray) {
            dataHTML += "<tr>" + "<td>" + item.ChampionName + "</td>" + "<td>" + item.Position + "</td>" + "<td>" + item.Wins + "</td>" + "<td>" + item.Losses + "</td>" + "<td>" + item.WinRate + "</td>" + "</tr>";//formatting of the table so that each of the data items is in the correct column
        }
        if (myJSONArray.length !== 1){ //checks the length of the array, if there is only 1 champion it will edit the champion table, otherwise it will edit the champions table
            document.getElementById("championsTable").innerHTML = dataHTML;
        }else{
            document.getElementById("championTable").innerHTML = dataHTML;
        }//links to the table in champions.html
    }
}
function getChampion(ChampionName) { //fetches a particular champion
    debugger;
    console.log("Invoked getChampion()");     //console.log for debugging client side - also uses debugger statement
    const url = "/champions/getChampion/";    		// API method on web server will be in Teams class
    fetch(url + ChampionName, {
        method: "GET",				//GET method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));// if it does, convert JSON object to string and alert (pop up window)
        } else {
            formatChampionsList(response);          //this function will create an HTML table of the data but in this case a single record
        }
    });
}
function valChampions(){  //function for validating user inputs for ChampionName
    debugger;
    console.log("Invoked Champions()"); //invoke for debugging
    let formData = new FormData(document.getElementById('ChampionForm')) // links to the form on the Champions.html page
    if (formData.get('ChampionName').length < 3 || formData.get('ChampionName').length >15){
        alert("Error - ChampionName must be within the 3-15 character boundary"); //error for debugging
    }else {
        getChampion(formData.get('ChampionName'))//calls getChampion after validating inputs
    }
}