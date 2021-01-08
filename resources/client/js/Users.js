"use strict";
function getUsersList() { //fetches the list of users
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

function formatUsersList(myJSONArray){//formats a list into a table
    let dataHTML = "";
    for (let item of myJSONArray) {
        dataHTML += "<tr><td>" + item.UserID + "<td><td>" + item.UserName + "<tr><td>"; // used to format the data entered
    }
    document.getElementById("UsersTable").innerHTML = dataHTML;
}
function UsersLogin() {//this function is used to log the user in depending on whether they are an admin user or regular user
    debugger;
    console.log("Invoked UsersLogin() "); // for debugging
    let url = "/users/login";
    let formData = new FormData(document.getElementById('LoginForm')); //links to the login form in the login page

    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json();                 //now return that promise to JSON
}).then(response => {
        if (response.hasOwnProperty("Error")) {
        alert(JSON.stringify(response));        // if it does, convert JSON object to string and alert
    } else {
        Cookies.set("Token", response.Token);  //sends the token, username and admin as cookies for the website to hold, will be removed when logged out
        Cookies.set("UserName", response.UserName);
        Cookies.set("Administrator", response.Administrator);
        if(response.Administrator =="1" || response.Administrator =="true"){
            window.open("admin.html", "_self");       //open index.html in same tab
        }else{
            window.open("index.html", "_self");       //open index.html in same tab
        }

    }
});
}
function logout() {//logout function used to move the user to the login window
    debugger;
    console.log("Invoked logout"); //invokes for debugging
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
function postUsersAdd() { //this function is for validating username, password and email
    console.log("Invoked postUsersAdd") //invokes for debugging
    let formData = new FormData(document.getElementById('RegisterForm'));
    if(((formData.get('UserName')).length > 2 && (formData.get('UserName').length<31))&&((formData.get('Password')).length > 2 && formData.get('Password')).length<31){ //validation check on username and password
        if(valEmail(formData.get('Email'))){ //validation check on the email via the valEmail() function
            UsersAdd(); // if all three inputs are validated, calls UsersAdd function to add users to the database
        } else {
            alert("Invalid Email.")//error for debugging
        }
    } else {
        alert("Invalid Username or Password.\nUsername must be 3 to 30 characters.\nPassword must be 3 to 30 characters") //error for debugging
    }
}

function UsersAdd(){ //function to add users to the database
    console.log("Invoked UsersAdd()"); //invokes for debugging

    let url = "/users/add";
    let formData = new FormData(document.getElementById('RegisterForm')); //links to form for registering users to exchange inputs

    fetch(url, {
        method: "POST",
        body: formData,
    }).then(response => {
        return response.json(); //sends a response to the java class for adding users through JSON
    }).then(response => {
        if(response.hasOwnProperty("Error")){
            alert("Error - Username may already be in use."); //error for debugging
            alert(JSON.stringify(response));
        }
        else{
            alert("Account Created")//confirmation alert for debugging
        }
    });
}

function valEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase()); //returns true if in correct format, false otherwise

}


