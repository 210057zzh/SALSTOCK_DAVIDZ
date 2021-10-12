package com.David.Group.springboot.controller;

import static utils.Constants.dbAddress_nopass;
import static utils.Constants.googleClientId;
import static utils.Constants.origins;
import static utils.Utils.getCurrentDate;
import static utils.Utils.queryUser;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.stream.Collectors;
import java.util.*;


import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import models.Business;
import models.User;

import java.time.format.DateTimeFormatter;  
import java.time.LocalDateTime; 

/**
 * @author 21005
 */
@CrossOrigin(origins = origins)
@RestController
@RequestMapping("/api")
public class SignupController {	
	private final JdbcTemplate jdbcTemplate;

	public SignupController(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}
	
	@PostMapping("/signup")
	public String signup(@RequestBody String[] credentials) {
		
		//first make sure that the user isnt already in the database
		boolean registered = doesUserExist(credentials);
		
		if(registered) {
			System.out.println("User already exists");
			return "{\"successful\": false, \"error\": \"User already exists\"}"; 
		}
		
		System.out.println("signing up "+credentials[0]+credentials[1]);
		
		boolean success = addUser(credentials[0], credentials[1], false);
		
		if(success) {
			int userId = getUserInfo(credentials[0], credentials[1]).getUserID();
			return "{\"successful\": true, \"userId\": "+userId+", \"username\":\""+credentials[0]+"\"}";
		}else {
			return "{\"successful\": false, \"error\": \"Unspecified\"}";
		}		
				
	}
	
	@PostMapping("/googlesignup")
	public String googlesignup(@RequestBody String idTokenString) throws GeneralSecurityException, IOException {
		System.out.println("google sign up");
		int token=-1;
		String retString="";
		GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new JacksonFactory())
				// Specify the CLIENT_ID of the app that accesses the backend:
				.setAudience(Collections.singletonList(googleClientId)).build();
		GoogleIdToken idToken = verifier.verify(idTokenString);
		if (idToken != null) {
			Payload payload = idToken.getPayload();
			// Get profile information from payload
			String userId = payload.getSubject();
			String email = payload.getEmail();
			//Check if they are already registered
			boolean registered = doesUserExist(new String[] {email, userId});
			if(registered) {
				System.out.println("User already exists");
				return "{\"successful\": false, \"error\": \"User already exists\"}"; 
			}
			
			boolean success = addUser(email, userId, true);
			
			if(success) {
				int id = getUserInfo(email, userId).getUserID();
				return "{\"successful\": true, \"userId\": "+id+", \"username\":\""+email+"\"}";
			}else {
				return "{\"successful\": false, \"error\": \"Unspecified\"}";
			}	
			

		} else {
			System.out.println("Invalid ID token.");
			return "{\"successful\": false, \"error\": \"Invalid\"}"; 
		}
						
	}
	
	public boolean doesUserExist(String[] credentials) {
		var users =  this.jdbcTemplate.queryForList("SELECT userID FROM Users WHERE username=\""+credentials[0]+"\"").stream()
				.map(m -> m.values().toString())
				.collect(Collectors.toList());
		
		if(users.size()>0) {
			return true;
		}
		
		return false;
	}
	
	public boolean addUser(String username, String password, boolean googleuser) {
		String url = dbAddress_nopass;
		DriverManagerDataSource dataSource = new DriverManagerDataSource(url, "root", "root");
		SimpleJdbcInsert simpleJdbcInsert = new SimpleJdbcInsert(dataSource).withTableName("Users");
		Map<String, Object> parameters = new HashMap<String, Object>();
		parameters.put("username", username);
		parameters.put("password", password);
		parameters.put("isGoogle", googleuser);
		parameters.put("balance",50000);
		int return_value = simpleJdbcInsert.execute(parameters);
		if(return_value>=1) {
			return true;
		}else {
			return false;
		}	
	}
	
	//Returns a User with a real id or an id of -1
	public User getUserInfo(String username, String password) {
		var users = new ArrayList<>(this.jdbcTemplate.queryForList("SELECT * FROM Users WHERE username=\"" + username + "\""));
				
		if(users.size()>=1) {
			return queryUser(users);
		}else {//failed
			return new User(-1);
		}
	}
	
	//Returns a User with a real id or an id of -1
	public User getUserInfo(int userID) {
		var users = new ArrayList<>(this.jdbcTemplate.queryForList("SELECT * FROM Users WHERE userID=\"" + userID + "\""));
				
		if(users.size()>=1) {
			return queryUser(users);
		}else {//failed
			return new User(-1);
		}
	}

}
