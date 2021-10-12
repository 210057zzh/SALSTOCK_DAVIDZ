DROP DATABASE if exists davidz_assignment4;
CREATE DATABASE davidz_assignment4;

USE davidz_assignment4;

CREATE TABLE Users ( 
    userID int NOT NULL AUTO_INCREMENT,
    username varchar(255),
    password varchar(255),
    idToken varchar(255),
    isGoogle boolean,
    balance decimal(15,2),
    CONSTRAINT PK_Users PRIMARY KEY (userID)
);

CREATE TABLE Favorite (
    userID int NOT NULL,
    Ticker varchar(255),
    foreign key (userID) references Users(userID)
);

CREATE TABLE Stocks (
    userID int NOT NULL,
     Ticker varchar(255),
     Quantity int NOT NULL,
     Total decimal(15,2),
     primary key (userID, Ticker),
     foreign key (userID) references Users(userID)
);

