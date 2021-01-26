package controllers;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
@Path("pros/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Pros { //class called Pros for each of the Java classes for the Pros functions for modularity
    @GET
    @Path("proslist") //API path in order to communicate with JS
    public String prosList() {  //prosList class for listing all of the pro data
        System.out.println("Invoked Pros.ProsList()");  //invokes for debugging
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT ProName, Position, AverageKills, AverageDeaths, AverageAssists, KDA FROM Pros"); //prepare statement to fetch
            ResultSet results = ps.executeQuery();
            while (results.next() == true) {
                JSONObject row = new JSONObject();
                row.put("ProName", results.getString(1));
                row.put("Position", results.getString(2));
                row.put("AverageKills", results.getFloat(3));
                row.put("AverageDeaths", results.getFloat(4));
                row.put("AverageAssists", results.getFloat(5));
                row.put("KDA", results.getFloat(6)); //JSON object is created from each of the selected parts from the table
                response.add(row);  //
            }
            return response.toString(); //return to JS as a string for formatting purposes in JS
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage()); //error message for debugging
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

    @GET
    @Path("getPro/{ProName}") //getPro path specifies parameter ProName which relates to the input needed
    public String getProName(@PathParam("ProName") String ProName) {
        System.out.println("Invoked Pros.getPro()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT ProName, Position, AverageKills, AverageDeaths, AverageAssists, KDA FROM Pros WHERE ProName = ?"); //prepared statement which selects all of the fields in the Pros table given a ProName is inputted
            ps.setString(1, ProName);
            ResultSet results = ps.executeQuery();
            while (results.next() == true) {
                JSONObject row = new JSONObject(); //JSON object is formed form each data aspect sent
                row.put("ProName", results.getString(1));
                row.put("Position", results.getString(2));
                row.put("AverageKills", results.getFloat(3));
                row.put("AverageDeaths", results.getFloat(4));
                row.put("AverageAssists", results.getFloat(5));
                row.put("KDA", results.getFloat(6));
                response.add(row);
            }
            return response.toString(); //sends a JSON object back to the JS code which consists of the data about the given ProName.
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage()); //error message if database error for debugging purposes
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

}
