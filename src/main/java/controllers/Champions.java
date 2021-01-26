package controllers;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
@Path("champions/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Champions { //class called Champions for each of the Java classes for the Champions functions for modularity
    @GET
    @Path("championslist") //API path in order to communicate with JS
    public String championsList() {  //championsList class for listing all of the team data
        System.out.println("Invoked Champions.championsList()");  //invokes for debugging
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT ChampionName, Position, Wins, Losses, WinRate FROM Champions"); //prepare statement to fetch all data for champions list
            ResultSet results = ps.executeQuery();
            while (results.next() == true) {
                JSONObject row = new JSONObject();
                row.put("ChampionName", results.getString(1));
                row.put("Position", results.getString(2));
                row.put("Wins", results.getInt(3));
                row.put("Losses", results.getInt(4));
                row.put("WinRate", results.getInt(5)); //JSON object is created from each of the selected parts from the table
                response.add(row);  //
            }
            return response.toString(); //return to JS as a string for formatting purposes in JS
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage()); //error message for debugging
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

    @GET
    @Path("getChampion/{ChampionName}") //getChampion path specifies parameter TeamName which relates to the input needed
    public String getChampionName(@PathParam("ChampionName") String ChampionName) {
        System.out.println("Invoked Champions.getChampion()"); //invokes for debugging
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT ChampionName, Position, Wins, Losses, WinRate FROM Champions WHERE ChampionName = ?"); //prepared statement which selects all of the fields in the Champions table given a ChampionName is inputted
            ps.setString(1, ChampionName);
            ResultSet results = ps.executeQuery();
            while (results.next() == true) {
                JSONObject row = new JSONObject(); //JSON object is formed form each data aspect sent
                row.put("ChampionName", results.getString(1));
                row.put("Position", results.getString(2));
                row.put("Wins", results.getInt(3));
                row.put("Losses", results.getInt(4));
                row.put("WinRate", results.getInt(5));
                response.add(row);
            }
            return response.toString(); //sends a JSON object back to the JS code which consists of the data about the given ChampionName.
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage()); //error message if database error for debugging purposes
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

}