package com.David.Group.springboot.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Map;
import java.util.Scanner;
import java.util.stream.Collectors;

import static utils.Constants.TiingoToken;
import static utils.Constants.origins;

@CrossOrigin(origins = origins)
@RestController
@RequestMapping("/api")
public class SearchController {
    private final JdbcTemplate jdbcTemplate;
    public SearchController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    @GetMapping("/getBusiness")
    public String getSearchResponse(@RequestParam String search, @RequestParam int userID) throws IOException {
        try {
            String Meta = getMeta(search);
            if (Meta.length() == 2) {
                return "Invalid Ticker";
            }
            String daily = getDaily(search);
            if (daily.length() == 2) {
                return "Invalid Ticker";
            }
            String latest = getLatest(search);
            if (latest.length() == 2) {
                return "Invalid Ticker";
            }
            Meta = Meta.substring(0,Meta.length()-1)+',';
            daily = daily.substring(2,daily.length()-2)+',';
            latest = latest.substring(2,latest.length()-1);
            System.out.println(Meta + daily);
            if(userID!=-1) {
                String favorite = "\"favorite\": true,";
                var favorites = new ArrayList<>(this.jdbcTemplate.queryForList("SELECT * FROM Favorite where userID=" + userID + " and Ticker=\"" + search+"\""));
                if (favorites.size() == 0) {
                    favorite = "\"favorite\": false,";
                }
                System.out.println(Meta + favorite+ daily);
                return Meta + favorite+ daily +latest;
            }
            return Meta + daily + latest;
        }
        catch (Exception e)
        {
            System.out.println(e.getMessage());
            return "Invalid Ticker";
        }
    }

    public String getMeta(String ticker) throws IOException {
        String UrlString = "https://api.tiingo.com/tiingo/daily/"+ticker+'?'+TiingoToken;
        System.out.println(UrlString);
        URL url = new URL(UrlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.connect();
        Scanner scanner = new Scanner(url.openStream());
        //Write all the JSON data into a string using a scanner
        String inline = scanner.nextLine();
        //Close the scanner
        scanner.close();
        return inline;
    }

    public String getDaily(String ticker) throws IOException {
        String UrlString = "https://api.tiingo.com/tiingo/daily/"+ticker+"/prices?"+TiingoToken;
        System.out.println(UrlString);
        URL url = new URL(UrlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.connect();
        Scanner scanner = new Scanner(url.openStream());
        //Write all the JSON data into a string using a scanner
        String inline = scanner.nextLine();
        //Close the scanner
        scanner.close();
        return inline;
    }

    public String getLatest(String ticker) throws IOException {
        String UrlString = "https://api.tiingo.com/iex?tickers="+ticker+"&"+TiingoToken;
        System.out.println(UrlString);
        URL url = new URL(UrlString);
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.connect();
        Scanner scanner = new Scanner(url.openStream());
        //Write all the JSON data into a string using a scanner
        String inline = scanner.nextLine();
        //Close the scanner
        scanner.close();
        return inline;
    }
}
