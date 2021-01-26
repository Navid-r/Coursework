package controllers;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Path("teams/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Teams { //class called Teams for each of the Java classes for the Teams functions for modularity
    @GET
    @Path("teamslist") //API path in order to communicate with JS
    public String teamsList() {  //teamsList class for listing all of the team data
        System.out.println("Invoked Teams.teamsList()");  //invokes for debugging
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT TeamName, Win, Loss, Standing FROM Teams"); //prepare statement to fetch
            ResultSet results = ps.executeQuery();
            while (results.next() == true) {
                JSONObject row = new JSONObject();
                row.put("TeamName", results.getString(1));
                row.put("Win", results.getInt(2));
                row.put("Loss", results.getInt(3));
                row.put("Standing", results.getInt(4)); //JSON object is created from each of the selected parts from the table
                response.add(row);  //
            }
            return response.toString(); //return to JS as a string for formatting purposes in JS
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage()); //error message for debugging
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

    @GET
    @Path("getTeam/{TeamName}") //getTeam path specifies parameter TeamName which relates to the input needed
    public String getTeamName(@PathParam("TeamName") String TeamName) {
        System.out.println("Invoked Teams.getTeam()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT TeamName, Win, Loss, Standing FROM Teams WHERE TeamName = ?"); //prepared statement which selects all of the fields in the Teams table given a TeamName is inputted
            ps.setString(1, TeamName);
            ResultSet results = ps.executeQuery();
            while (results.next() == true) {
                JSONObject row = new JSONObject(); //JSON object is formed form each data aspect sent
                row.put("TeamName", results.getString(1));
                row.put("Win", results.getInt(2));
                row.put("Loss", results.getInt(3));
                row.put("Standing", results.getInt(4));
                response.add(row);
            }
            return response.toString(); //sends a JSON object back to the JS code which consists of the data about the given TeamName.
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage()); //error message if database error for debugging purposes
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

}
