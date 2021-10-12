package com.David.Group.springboot.controller;

import static utils.Constants.dbAddress;
import static utils.Constants.origins;
import static utils.Utils.queryBusinesses;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.stream.Collectors;

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
public class HomePageController {
	
	private final JdbcTemplate jdbcTemplate;

	public HomePageController(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@GetMapping("/businesses")
	public String getSearchResponse(@RequestParam String search) {
		var businesses =  this.jdbcTemplate.queryForList("SELECT * FROM Businesses WHERE name LIKE \"%"+search+"%\" OR business_type LIKE \"%"+search+"%\" OR address LIKE \"%"+search+"%\" or phone_number LIKE \"%"+search+"%\"").stream()
				.collect(Collectors.toList());
		
		// Jsonifies and returns results or "NO RESULTS"
		if (businesses.size() == 0) {
			return "NO RESULTS";
		}

		Gson gson = new GsonBuilder().create();

		String resultsString = gson.toJson(businesses);

		System.out.println(resultsString);

		return resultsString;

	}
}
