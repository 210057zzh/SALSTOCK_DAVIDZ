package models;

import java.math.BigDecimal;

public class User {
	private int userID;
	private String username;
	private String password;
	private String idToken;
	private boolean googleUser;
	private BigDecimal balance;


	public User(int userID, String username, String password, boolean googleUser, BigDecimal balance) {
		super();
		this.userID = userID;
		this.username = username;
		this.password = password;
		this.googleUser = googleUser;
		this.balance = balance;
	}
	
	public User(int userId) {
		this.userID=userId;
	}
	
	




	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public int getUserID() {
		return userID;
	}


	public void setUserID(int userID) {
		this.userID = userID;
	}


	public String getEmail() {
		return username;
	}


	public void setEmail(String email) {
		this.username = email;
	}


	public String getIdToken() {
		return idToken;
	}


	public void setIdToken(String idToken) {
		this.idToken = idToken;
	}


	public boolean isGoogleUser() {
		return googleUser;
	}


	public void setGoogleUser(boolean googleUser) {
		this.googleUser = googleUser;
	}


	public String getPassword() {
		return password;
	}


	public void setPassword(String password) {
		this.password = password;
	}

	public BigDecimal getBalance(){return balance;}

	public void setBalance(BigDecimal balance) { this.balance = balance;}



	@Override
	public String toString() {
		return "User [userID=" + userID + ", username=" + username + ", password=" + password + ", idToken=" + idToken
				+ ", googleUser=" + googleUser + ", balance="+balance+"]";
	}
	
	
	
	
	

}
