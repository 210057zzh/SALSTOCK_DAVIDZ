package models;

public class Review {
	private String message;
	private int rating;
	private int time;
	private String userID;
	private String username;
	private int numReviews;
	
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public int getRating() {
		return rating;
	}
	public void setRating(int rating) {
		this.rating = rating;
	}
	public int getTime() {
		return time;
	}
	public void setTime(int time) {
		this.time = time;
	}
	public String getUserID() {
		return userID;
	}
	public void setUserID(String userID) {
		this.userID = userID;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public int getNumReviews() {
		return numReviews;
	}
	public void setNumReviews(int numReviews) {
		this.numReviews = numReviews;
	}
	@Override
	public String toString() {
		return "Review [message=" + message + ", rating=" + rating + ", time=" + time + ", userID=" + userID
				+ ", username=" + username + ", numReviews=" + numReviews + "]";
	}
	
	
}
