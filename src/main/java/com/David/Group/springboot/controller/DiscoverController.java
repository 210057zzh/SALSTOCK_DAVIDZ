package com.David.Group.springboot.controller;

import static utils.Constants.dbAddress;
import static utils.Constants.discoverPageBusinessLimit;
import static utils.Constants.origins;
import static utils.Utils.getPlaceholderBusinesses;
import static utils.Utils.queryBusinesses;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import models.Business;

@CrossOrigin(origins = origins)
@RestController
@RequestMapping("/api")
public class DiscoverController {

	@Autowired
	private final JdbcTemplate jdbcTemplate;

	public DiscoverController(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@GetMapping("/discover")
	public String discoverBusinesses(@RequestParam String category) {	
		System.out.println("category:" + category);
		
		for(int i =0; i<2; i++) {
			if(category==null || category=="" || i==1) {//Do this if no category was supplied or this is the second time running the loop (i.e. the loop didn't find any results the first time)
				var businesses =  this.jdbcTemplate.queryForList("SELECT * FROM Businesses ORDER BY average_rating DESC LIMIT 30").stream()
						.collect(Collectors.toList());
				
				if(businesses.size()>0) {
					Gson gson = new GsonBuilder().create();

					String resultsString = gson.toJson(businesses);

					return resultsString;
				}
			}else {
				var businesses =  this.jdbcTemplate.queryForList("SELECT * FROM Businesses WHERE business_type = \""+category+"\" ORDER BY average_rating DESC LIMIT 30").stream()
						.collect(Collectors.toList());
				if(businesses.size()>0) {
					Gson gson = new GsonBuilder().create();

					String resultsString = gson.toJson(businesses);

					return resultsString;
				}
			}
		}

		//Return the placeholder businesses

		Gson gson = new GsonBuilder().create();

		String resultsString = gson.toJson(getPlaceholderBusinesses());

		return resultsString;
	}

}
