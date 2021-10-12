package com.David.Group.springboot.controller;

import static utils.Constants.dbAddress;
import static utils.Constants.discoverPageBusinessLimit;
import static utils.Constants.origins;
import static utils.Utils.getPlaceholderBusinesses;
import static utils.Utils.queryBusinesses;
import static utils.Utils.queryBusiness;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

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
public class UpdateBusinessController {
	
	private final JdbcTemplate jdbcTemplate;

	public UpdateBusinessController(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	@GetMapping("/updateBusiness")
	public String GetBusiness(@RequestParam int businessID, @RequestParam String name, @RequestParam String startHour, @RequestParam String endHour, @RequestParam String category, @RequestParam int cost, @RequestParam String description, @RequestParam String otherInfo, @RequestParam String phone_number, @RequestParam String website, @RequestParam String email, @RequestParam String address) {
		try {
			String updateQuery = "update Businesses set name=?, startHour=?, endHour=?, business_type=?, cost=?, description=?, otherInfo=?, phone_number=?, website=?, email=?, address=? where businessID=?";
			jdbcTemplate.update( updateQuery, name, startHour, endHour, category, cost, description, otherInfo, phone_number,website, email, address, businessID);
			//TODO this might work. might have to use preparedstatementfactorys
			return "{\"success\":true}";
		}catch(Exception e) {
			return "{\"success\":false}";
		}
	}
		
}
