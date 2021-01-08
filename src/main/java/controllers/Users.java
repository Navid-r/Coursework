package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.DatatypeConverter;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;

@Path("users/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Users{
    @GET
    @Path("list")
    public String UsersList() {
        System.out.println("Invoked Users.UsersList()"); //invokes userslist to show the function has run for debugging
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT UserID, UserName FROM Users"); //prepared statement selects UserID given that the Username is entered from the users table
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject(); //creates JSON object with UserID and UserName
                row.put("UserID", results.getInt(1));
                row.put("UserName", results.getString(2));
                response.add(row);
            }
            return response.toString(); //returns the JSON to string
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage()); //Error messages
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

    @GET
    @Path("get/{UserID}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public String GetUser(@PathParam("UserID") Integer UserID) {
        System.out.println("Invoked Users.GetUser() with UserID " + UserID); //invokes getuser to show that the function has run for debugging
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT UserName, SessionToken FROM Users WHERE UserID = ?"); //prepared statement to retrieve the UserName and SessionToken of a user from the users table given a UserID has been entered
            ps.setInt(1, UserID);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject(); //creates a new JSON object with UserID, UserName, Token
            if (results.next()== true) {
                response.put("UserID", UserID);
                response.put("UserName", results.getString(1));
                response.put("Token", results.getInt(2));
            }
            return response.toString(); // returns as string
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage()); //error messages
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }

    }
    @POST
    @Path("add")
    public String UsersAdd(@FormDataParam("UserName") String UserName, @FormDataParam("Password") String Password, @FormDataParam("Email") String Email) {
        System.out.println("Invoked Users.UsersAdd()"); //invokes users add for debugging
        Password = generateHash(Password);
        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Users (UserName, Password, Email) VALUES (?, ?, ?)"); //prepared statement to add a userID and UserName with inputted values
            ps.setString(1, UserName);
            ps.setString(2, Password);
            ps.setString(3, Email);
            ps.execute();
            return "{\"OK\": \"Added user.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());  //Error messages
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }

    }
    @POST
    @Path("update")
    public String UpdateUser(@FormDataParam("UserID") Integer UserID, @FormDataParam("UserName") String UserName) {
        try {
            System.out.println("Invoked Users.UpdateUsers/update UserID=" + UserID); //invoke for debugging
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Users SET UserName = ? WHERE UserID = ?"); //prepared statement to change the username of a user given a UserID
            ps.setString(1, UserName);
            ps.setInt(2, UserID);
            ps.execute();
            return "{\"OK\": \"Users updated\"}"; //correct return
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage()); //error messages
            return "{\"Error\": \"Unable to update item, please see server console for more info.\"}";
        }
    }
    @POST
    @Path("delete/{UserID}")
    public String DeleteUser(@PathParam("UserID") Integer UserID) throws Exception {
        System.out.println("Invoked Users.DeleteUser()"); //invokes for debugging
        if (UserID == null) {
            throw new Exception("UserID is missing in the HTTP request's URL."); //error message for no UserID found
        }
        try {
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Users WHERE UserID = ?"); //prepared statement to delete a record from users given a userID
            ps.setInt(1, UserID);
            ps.execute();
            return "{\"OK\": \"User deleted\"}"; //correct return
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage()); //error messages
            return "{\"Error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }
    @POST
    @Path("login") //This function is for the login page where a username and password is entered to allow access to the rest of the website
    public String UsersLogin(@FormDataParam("UserName") String UserName, @FormDataParam("PassWord") String PassWord) {
        System.out.println("Invoked loginUser() on path users/login"); //invokes for debugging
        PassWord = generateHash(PassWord);
        try {
            PreparedStatement ps1 = Main.db.prepareStatement("SELECT PassWord FROM Users WHERE UserName = ?"); //prepares statement to select the password from users given a username
            ps1.setString(1, UserName);
            ResultSet loginResults = ps1.executeQuery();
            if (loginResults.next() == true) {
                String correctPassword = loginResults.getString(1);
                if (PassWord.equals(correctPassword)) { //compares password to inputted password, if correct generates a token
                    String Token = UUID.randomUUID().toString();
                    PreparedStatement ps2 = Main.db.prepareStatement("UPDATE Users SET Token = ? WHERE UserName = ?"); // updates the users table with the token
                    ps2.setString(1, Token);
                    ps2.setString(2, UserName);
                    ps2.executeUpdate();
                    PreparedStatement ps3 = Main.db.prepareStatement("SELECT Administrator FROM Users WHERE UserName =?"); //selects the administrator value from the user table
                    ps3.setString(1, UserName);
                    ResultSet adminResults = ps3.executeQuery();
                    String Administrator = adminResults.getString(1);
                    JSONObject userDetails = new JSONObject(); //creates JSON object with username, token and admin
                    userDetails.put("UserName", UserName);
                    userDetails.put("Token", Token);
                    userDetails.put("Administrator", Administrator);
                    return userDetails.toString(); //return as string
                } else {
                    return "{\"Error\": \"Incorrect password!\"}"; //incorrect password
                }
            } else {
                return "{\"Error\": \"Incorrect username or password.\"}"; //incorrect username
            }
        } catch (Exception exception) { //error messages
            System.out.println("Database error during /users/login: " + exception.getMessage());
            return "{\"Error\": \"Server side error!\"}";
        }
    }
    @POST
    @Path("logout") //This function clears cookies from the website to make sure the user is offline
    public static String logout(@CookieParam("Token") String Token){
        try{
            System.out.println("users/logout "+ Token);
            PreparedStatement ps = Main.db.prepareStatement("SELECT UserID FROM Users WHERE Token=?"); //selects the userID from users given a token
            ps.setString(1, Token);
            ResultSet logoutResults = ps.executeQuery();
            if (logoutResults.next()){
                int UserID = logoutResults.getInt(1);
                //Set the token to null to indicate that the user is not logged in
                PreparedStatement ps1 = Main.db.prepareStatement("UPDATE Users SET Token = NULL WHERE UserID = ?"); //change the token to null to indicate logged out
                ps1.setInt(1, UserID);
                ps1.executeUpdate();
                return "{\"status\": \"OK\"}"; // correct return
            } else {
                return "{\"error\": \"Invalid token!\"}"; // error message

            }
        } catch (Exception ex) {
            System.out.println("Database error during /users/logout: " + ex.getMessage()); //database +serverside errors
            return "{\"error\": \"Server side error!\"}";
        }
    }


    public static String generateHash(String text) { //calls the hash function on a string, in this case a password
        try {
            MessageDigest hasher = MessageDigest.getInstance("MD5"); //this makes the hash use the hashing algorithm MD5 through the use of the MessageDigest Package
            hasher.update(text.getBytes());
            return DatatypeConverter.printHexBinary(hasher.digest()).toUpperCase(); //return the hashed value all in uppercase
        } catch (NoSuchAlgorithmException nsae) { //exception/error catch
            return nsae.getMessage(); //returns error message
        }
    }


}
