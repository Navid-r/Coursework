"use strict";
function getUsersList() {
    debugger;
    console.log("Invoked getUsersList()");     //console.log your BFF for debugging client side - also use debugger statement
    const url = "/users/list/";    		// API method on web server will be in Users class, method list
    fetch(url, {
        method: "GET",				//Get method
    }).then(response => {
        return response.json();                 //return response as JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) { //checks if response from the web server has an "Error"
            alert(JSON.stringify(response));    // if it does, convert JSON object to string and alert (pop up window)
        } else {
            formatUsersList(response);          //this function will create an HTML table of the data (as per previous lesson)
        }
    });
}

function formatUsersList(myJSONArray){
    let dataHTML = "";
    for (let item of myJSONArray) {
        dataHTML += "<tr><td>" + item.UserID + "<td><td>" + item.UserName + "<tr><td>";
    }
    document.getElementById("UsersTable").innerHTML = dataHTML;
}
function UsersLogin() {
    debugger;
    console.log("Invoked UsersLogin() ");
    let url = "/users/login";
    let formData = new FormData(document.getElementById('LoginForm'));

    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json();                 //now return that promise to JSON
}).then(response => {
        if (response.hasOwnProperty("Error")) {
        alert(JSON.stringify(response));        // if it does, convert JSON object to string and alert
    } else {
        Cookies.set("Token", response.Token);
        Cookies.set("UserName", response.UserName);
        Cookies.set("Administrator", response.Administrator);
        if(response.Administrator =="true"){
            window.open("admin.html", "_self");       //open index.html in same tab
        }else{
            window.open("index.html", "_self");       //open index.html in same tab
        }

    }
});
}
function logout() {
    debugger;
    console.log("Invoked logout");
    let url = "/users/logout";
    fetch(url, {method: "POST"
    }).then(response => {
        return response.json();                 //now return that promise to JSON
    }).then(response => {
        if (response.hasOwnProperty("Error")) {
            alert(JSON.stringify(response));        // if it does, convert JSON object to string and alert
        } else {
            Cookies.remove("Token", response.Token);    //UserName and Token are removed
            Cookies.remove("UserName", response.UserName);
            window.open("login.html", "_self");       //open index.html in same tab
        }
    });
}
function admin(){
    debugger;
    console.log("Invoked admin");
    let url = "/users/admin";
    Cookies.set("Administrator", response.Token)
    window.open("admin.html", "_self");

}




