package utils;

import static utils.Constants.dbAddress;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

import models.Business;
import models.User;

public class Utils {

	public static ArrayList<Business> queryBusinesses(ResultSet rs) throws SQLException {
		ArrayList<Business> results = new ArrayList<>();

		while (rs.next()) {
			/*int businessID = rs.getInt("businessID");
			int ownerID = rs.getInt("ownerID");
			String name = rs.getString("name");
			String phone_number = rs.getString("phone_number");
			int startHour = rs.getInt("startHour");
			int endHour = rs.getInt("endHour");
			String description = rs.getString("description");
			int cost = rs.getInt("cost");
			int average_rating = rs.getInt("average_rating");
			String address = rs.getString("address");
			String business_type = rs.getString("business_type");

			Business business = new Business(businessID, ownerID, name, phone_number, startHour, endHour, description,
					cost, average_rating, address, business_type);
			results.add(business);
*/
			results.add(queryBusiness(rs));
		}

		// Sets number of reviews each business has
		/*for (Business b : results) {
			b.setNumReviews(calculateReviews(b.getBusinessId()));
		}
*/
		return results;

	}
	public static Business queryBusiness(ResultSet rs) throws SQLException {
		while(rs.next()) {
			int businessID = rs.getInt("businessID");
			int ownerID = 0; //PLACE HOLDER VALUE UNTIL DB GETS FIXED rs.getInt("ownerID");
			String name = rs.getString("name");
			String phone_number = rs.getString("phone_number");
			int startHour = rs.getInt("startHour");
			int endHour = rs.getInt("endHour");
			String description = rs.getString("description");
			int cost = rs.getInt("cost");
			int average_rating = rs.getInt("average_rating");
			String address = rs.getString("address");
			String business_type = rs.getString("business_type");
			Business business = new Business(businessID, ownerID, name, phone_number, startHour, endHour, description,
					cost, average_rating, address, business_type);
			business.setNumReviews(calculateReviews(business.getBusinessId()));
			return business;
		}
		return new Business();
	}

	public static int calculateReviews(int businessId) {
		Connection conn = null;
		PreparedStatement ps = null;
		ResultSet rs2 = null;

		int count = 0;

		try {
			conn = DriverManager.getConnection(dbAddress);

			ps = conn.prepareStatement("SELECT COUNT(reviewId) from Reviews where businessID=?");
			ps.setInt(1, businessId);

			rs2 = ps.executeQuery();

			while (rs2.next()) {
				try {
					count = rs2.getInt(1);
				} catch (SQLException sqle) {
					// TODO handle
					System.out.println(sqle.getMessage());
				}

			}

		} catch (SQLException sqle) {
			// TODO handle
			System.out.println(sqle.getMessage());
		} finally {
			try {
				if (rs2 != null) {
					rs2.close();
				}
				if (ps != null) {
					ps.close();
				}
				if (conn != null) {
					conn.close();
				}
			} catch (SQLException sqle) {
				// TODO handle
				System.out.println(sqle.getMessage());
			}
		}

		return count;
	}

	public static ArrayList<Business> getPlaceholderBusinesses() {
		ArrayList<Business> results = new ArrayList<>();


		int businessID = 2;
		int ownerID = -1;
		String name = "Dale\'s Plumbing Services";
		String phone_number = "(123) 123-4566";
		int startHour = -1;
		int endHour = -1;
		String description = "This is Dale’s plumbing services ad description.  I offer better plumbing than Bob.  I have a 5-star rated service on Sprout and 44 reviews.  Contact me at the phone number.";
		int cost = -1;
		int average_rating = 5;
		String address = "1235 Fake Street";
		String business_type = "store";

		Business business = new Business(businessID, ownerID, name, phone_number, startHour, endHour, description, cost,
				average_rating, address, business_type);
		business.setNumReviews(44);
		results.add(business);


		businessID = 1;
		ownerID = -1;
		name = "Bob\'s Plumbing Services";
		phone_number = "(123) 456-7891";
		startHour = -1;
		endHour = -1;
		description = "This is Bob’s plumbing services ad description. I offer the best plumbing in town. I have a 4-star rated service on Sprout and 24 reviews. service on Sprout and 24 reviews. Contact me at the listed phone number of at my address. Although I am already done with my description, I am going to keep writing. you will see how it will not go past the second line even if I keep writing. Look!. I\'ll start to count to 15. One, two, three, four, five six, seven, eight, nine, ten, eleven, twelve, thirteen, fourteen, fifteen!";
		cost = -1;
		average_rating = 4;
		address = "1234 Fake Street";
		business_type = "store";

		business = new Business(businessID, ownerID, name, phone_number, startHour, endHour, description, cost,
				average_rating, address, business_type);
		business.setNumReviews(24);
		results.add(business);


		businessID = 3;
		ownerID = -1;
		name = "Jim\'s Plumbing Services";
		phone_number = "(123) 456-8234";
		startHour = -1;
		endHour = -1;
		description = "This is Jim’s plumbing services ad description.  I offer the worst plumbing in town.  I have a 1-star rated service on Sprout and 24 reviews.  Contact me at the phone number.";
		cost = -1;
		average_rating = 1;
		address = "9876 Fake Street";
		business_type = "store";

		business = new Business(businessID, ownerID, name, phone_number, startHour, endHour, description, cost,
				average_rating, address, business_type);
		business.setNumReviews(36);
		results.add(business);

		return results;
	}
	public static String getCurrentDate() {       
		SimpleDateFormat formatter = new SimpleDateFormat("YYYY-MM-DD");  
	    Date date = new Date();
	    return formatter.format(date);
	} 
	
	public static User queryUser(List<Map<String, Object>> users) {
		try {
			int actual_userID = (int) users.get(0).get("userID");
			String actual_username = (String) users.get(0).get("username");
			String actual_password = (String) users.get(0).get("password");
			boolean isGoogle = (boolean) users.get(0).get("isGoogle");
			BigDecimal balance = (BigDecimal) users.get(0).get("balance");
			User user = new User(actual_userID, actual_username, actual_password, isGoogle, balance);
			System.out.println(user);
			return user;
		}catch(Exception e) {
			return new User(-1);
		}
	}

}
