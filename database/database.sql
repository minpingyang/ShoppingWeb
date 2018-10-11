CREATE TABLE account_table(
	fname text,
	lname text,
	email varchar(320),
	pwd varchar(320)
);

CREATE TABLE in_cart(
	item_id int NOT NULL, 
	user_id int NOT NULL,
	count int NOT NULL,
	FOREIGN KEY(item_id) REFERENCES items(item_id)
);

CREATE TABLE items(
	item_id serial NOT NULL,
	name varchar(200) NOT NULL,
	img varchar(200) NOT NULL,
	price varchar(50) NOT NULL
	PRIMARY KEY(item_id)
);

CREATE TABLE category(
	cat_id serial NOT NULL,
	category varchar(100) NOT NULL,
	PRIMARY KEY(cat_id)
);

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
