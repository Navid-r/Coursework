package controllers;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class Played {
    @GET
    @Path("Playlist")
    public String UsersList() {
        System.out.println("Invoked Playeds.PlayedsList()");
        JSONArray response = new JSONArray();
        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT TeamID, MatchID FROM Played");
            ResultSet results = ps.executeQuery();
            while (results.next()==true) {
                JSONObject row = new JSONObject();
                row.put("TeamID", results.getInt(1));
                row.put("MatchID", results.getInt(2));
                response.add(row);
            }
            return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

}
