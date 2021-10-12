package com.David.Group.springboot.controller;

import static utils.Constants.*;
import static utils.Constants.TiingoToken;
import static utils.Utils.getCurrentDate;


import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.*;


import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.web.bind.annotation.*;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import models.Business;
import java.time.format.DateTimeFormatter;  
import java.time.LocalDateTime;    


@CrossOrigin(origins = origins)
@RestController
@RequestMapping("/api")
public class FavoriteController {
	
	private final JdbcTemplate jdbcTemplate;

	public FavoriteController(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	@PostMapping("/addFavorite")
	public void InsertFavorite(@RequestBody LinkedHashMap params) {
		String url = dbAddress_nopass;
		DriverManagerDataSource dataSource = new DriverManagerDataSource(url, "root", "root");
		SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(dataSource).withTableName("Favorite");
		Map<String, Object> parameters = (LinkedHashMap)params.get("params");
		int return_value = simpleJdbcInsert.execute(parameters);
		System.out.println("VALUE RETURNED IS :" + return_value);
	}

	@PostMapping("/popFavorite")
	public void PopFavorite(@RequestBody LinkedHashMap params) {
		String SQL = "delete from Favorite where userID = ? and Ticker = ?";
		Map<String, Object> parameters = (LinkedHashMap)params.get("params");
		this.jdbcTemplate.update(SQL, parameters.get("userID"), parameters.get("Ticker"));
		System.out.println("Deleted Record with ID = " + params );
		return;
	}

	@GetMapping("/getFavorite")
	public String getFavorite(@RequestParam int userID) {
		StringBuilder result = new StringBuilder("[");
		var businesses = new ArrayList<>(this.jdbcTemplate.queryForList("SELECT * FROM Favorite WHERE userID = " + userID));
		for (int i = 0; i < businesses.size(); i++)
		{
			String ticker = (String) businesses.get(i).get("Ticker");
			result.append(tiingoCall(ticker));
			if(i!=businesses.size()-1) {
				result.append(',');
			}
		}
		result.append(']');
		return result.toString();
	}

	@GetMapping("/getStock")
	public String getStock(@RequestParam int userID) {
		StringBuilder result = new StringBuilder("[");
		var businesses = new ArrayList<>(this.jdbcTemplate.queryForList("SELECT * FROM stocks WHERE userID = " + userID));
		for (int i = 0; i < businesses.size(); i++)
		{
			String ticker = (String) businesses.get(i).get("Ticker");
			String tiingo = tiingoCall(ticker);
			result.append(tiingo.substring(0,tiingo.length()-1));
			result.append(", \"total\":" + businesses.get(i).get("Total")+ ", \"quantity\": "+ businesses.get(i).get("Quantity")+"}");
			if(i!=businesses.size()-1) {
				result.append(',');
			}
		}
		result.append(']');
		return result.toString();
	}



	@PostMapping ("/buysell")
	public void buy (@RequestBody LinkedHashMap params)
	{
		Map<String, Object> parameters = (LinkedHashMap)params.get("params");
		String sql = "INSERT INTO Stocks (userID, Ticker, Quantity, Total) \n" +
				"VALUES (?, ?, ?, ?) \n" +
				"ON DUPLICATE KEY UPDATE Quantity = Quantity + VALUES(Quantity), Total = Total + VALUES(Total);";
		jdbcTemplate.update(sql, parameters.get("userID"), parameters.get("ticker"), parameters.get("quantity"), parameters.get("total"));
		String SQL = "delete from stocks where userID = ? and Quantity = 0";
		this.jdbcTemplate.update(SQL, parameters.get("userID"));
		sql = "INSERT INTO users (userID, balance) \n" +
				"VALUES (?, ?) \n" +
				"ON DUPLICATE KEY UPDATE balance = balance-VALUES(balance);";
		System.out.println(jdbcTemplate.update(sql, parameters.get("userID"), parameters.get("total")));

	}

	private String tiingoCall(String ticker){
		try {
			String Meta = getMeta(ticker);
			String daily = getDaily(ticker);
			String latest = getLatest(ticker);
			Meta = Meta.substring(0,Meta.length()-1)+',';
			daily = daily.substring(2,daily.length()-2)+',';
			latest = latest.substring(2,latest.length()-1);
			System.out.println(Meta + daily);
			return Meta + daily + latest;
		}
		catch (Exception e)
		{
			System.out.println(e.getMessage());
			return "Invalid Ticker";
		}
	}

	private String getMeta(String ticker) throws IOException {
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

	private String getDaily(String ticker) throws IOException {
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

	private String getLatest(String ticker) throws IOException {
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








