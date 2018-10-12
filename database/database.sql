CREATE TABLE users(
	fname varchar(200) NOT NULL,
	lname varchar(200) NOT NULL, 
	email varchar(200) NOT NULL,
	pwd varchar(200) NOT NULL,
	PRIMARY KEY(email)
);

CREATE TABLE in_cart(
	item_id int NOT NULL, 
	user_id int NOT NULL,
	count int NOT NULL,
	FOREIGN KEY(item_id) REFERENCES items(item_id)
);

CREATE TABLE items(
	item_id serial NOT NULL,
	catg varchar(40) NOT NULL,
	'new' varchar(40) NOT NULL,
	'name' varchar(200) NOT NULL,
	brand varchar(200) NOT NULL,
	img varchar(200) NOT NULL,
	price varchar(50) NOT NULL,
	rating int NOT NULL,
	CONSTRAINT CHK_items CHECK (rating <= 5), 
	PRIMARY KEY(item_id)
);

CREATE TABLE category(
	cat_id serial NOT NULL,
	category varchar(100) NOT NULL,
	PRIMARY KEY(cat_id)
);

INSERT INTO category (cat_id, category) VALUES
('1', 'men'),
('2', 'women'),
('3', 'kids');

CREATE TABLE `items` (
  `catg` varchar(40) NOT NULL,
  `subcatg` varchar(40) NOT NULL,
  `img` varchar(30) NOT NULL,
  `itemno` varchar(30) NOT NULL,
  `price` varchar(30) NOT NULL,
  `desc` varchar(300) NOT NULL,
  `info` varchar(500) NOT NULL,
  `dat` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
