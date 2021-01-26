"use strict";
function getTeamsList() {
    debugger;
    console.log("Invoked getTeamsList()");     //console.log for debugging client side - also use debugger statement
    const url = "/teams/teamslist/";    		// API method on web server will be in Teams class
    fetch(url, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert
        } else {
            formatTeamsList(response);          //this function will create a HTML table of the data
        }
    });
}

function formatTeamsList(myJSONArray) {
    if (myJSONArray[0] == undefined) { //if the ProName does not exist in the case of inputting non existent names
        alert("Error - TeamName does not exist or is written with incorrect case"); //error for debugging
    } else {

        let dataHTML = "<tr><th>Name</th><th>Wins</th><th>Losses</th><th>Standings</th></tr>"; //table headings for clarity
        for (let item of myJSONArray) {
            dataHTML += "<tr>" + "<td>" + item.TeamName + "</td>" + "<td>" + item.Win + "</td>" + "<td>" + item.Loss + "</td>" + "<td>" + item.Standing + "</td>" + "</tr>";//formatting of the table so that each of the data items is in the correct column
        }
        if (myJSONArray.length !== 1){ //checks the length of the array, if there is only 1 player it will edit the Pro table, otherwise it will edit the Pros table
            document.getElementById("teamsTable").innerHTML = dataHTML;
        }else{
            document.getElementById("teamTable").innerHTML = dataHTML;
        }//links to the table in teams.html
    }
}
function getTeam(TeamName) { //fetches a particular team
    debugger;
    console.log("Invoked getTeam()");     //console.log for debugging client side - also uses debugger statement
    const url = "/teams/getTeam/";    		// API method on web server will be in Teams class
    fetch(url + TeamName, {
        method: "GET",				//GET method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));// if it does, convert JSON object to string and alert (pop up window)
        } else {
            formatTeamsList(response);          //this function will create an HTML table of the data but in this case a single record
        }
    });
}
function valTeams(){  //function for validating user inputs for TeamName
    debugger;
    console.log("Invoked Teams()"); //invoke for debugging
    let formData = new FormData(document.getElementById('TeamForm')) // links to the form on the Teams.html page
    if (formData.get('TeamName').length < 2 || formData.get('TeamName').length >18){
        alert("Error - TeamName must be within the 2-18 character boundary"); //error for debugging
    }else {
        getTeam(formData.get('TeamName'))//calls getTeam after validating inputs
    }
}