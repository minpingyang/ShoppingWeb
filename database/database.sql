CREATE TABLE account_table(
	user_id serial NOT NULL,
	fname varchar(200) NOT NULL,
	lname varchar(200) NOT NULL, 
	email varchar(200) NOT NULL,
	pwd varchar(500) NOT NULL,
	salt varchar(500) NOT NULL,
	PRIMARY KEY(user_id, email)
);

CREATE TABLE in_cart(
	item_id int NOT NULL, 
	user_id int NOT NULL,
	email varchar(200) NOT NULL,
	quantity int NOT NULL,
	FOREIGN KEY(user_id, email) REFERENCES account_table(user_id, email),
	FOREIGN KEY(item_id) REFERENCES items(item_id)
);

CREATE TABLE items(
	item_id serial NOT NULL,
	cat_id int NOT NULL,
	"new" boolean NOT NULL,
	item_name varchar(200) NOT NULL,
	brand varchar(200) NOT NULL,
	img varchar(200) NOT NULL,
	price double precision NOT NULL,
	rating int NOT NULL,
	CONSTRAINT CHK_items CHECK (rating <= 5), 
	PRIMARY KEY(item_id),
	FOREIGN KEY(cat_id) REFERENCES category(cat_id)
);

CREATE TABLE orders(
	order_id serial NOT NULL,
	order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	email varchar(200) NOT NULL,
	status varchar(200) NOT NULL DEFAULT 'Shipped',
	PRIMARY KEY(order_id)
);

CREATE TABLE order_details(
	orderdetail_id serial NOT NULL,
	order_id int NOT NULL,
	item_id int NOT NULL,
	quantity int NOT NULL,
	PRIMARY KEY(orderdetail_id),
	FOREIGN KEY(order_id) REFERENCES orders(order_id)
		ON DELETE CASCADE,
	FOREIGN KEY(item_id) REFERENCES items(item_id)
);

INSERT INTO items (cat_id, new, item_name, brand, img, price, rating) VALUES
(1, TRUE, 'Old Skool Black', 'Adidas', '../image/M-Boots.jpg', 150.00, 5),
(1, TRUE, 'Bob', 'Adidas', '../image/M-Boots2.jpg', 99.99, 4),
(1, FALSE, 'Swift Run', 'Nike', '../image/M-Boots3.jpg', 149.99, 4),
(1, TRUE, 'Chuck Taylor All Star', 'New Balance', '../image/M-Sandals1.jpg', 139.99, 1),
(1, FALSE, 'Old Skool White', 'Nike', '../image/M-Sandals2.jpg', 100.00, 3),
(1, FALSE, 'One Star', 'Adidas', '../image/M-Sandals3.jpg', 55.00, 2),
(1, FALSE, 'Mens 248', 'Nike', '../image/M-Shoes1.jpg', 76.99, 4),
(1, TRUE, 'Mens Air Max 200 Essential', 'New Balance', '../image/M-Sports.jpg', 55.00, 5),
(1, FALSE, 'Central Max', 'Adidas', '../image/M-Sports1.jpg', 111.00, 2),
(1, FALSE, 'The One', 'Vans', '../image/M-Sports2.jpg', 133.00, 3);

INSERT INTO items (cat_id, new, item_name, brand, img, price, rating) VALUES
(2, TRUE, 'Tough', 'Adidas', '../image/W-Boots1.jpg', 37.00, 5),
(2, TRUE, 'Light Brown Premium', 'Timberland', '../image/W-Boots2.jpg', 122.00, 3),
(2, FALSE, 'Soft Grey', 'Adidas', '../image/W-Boots3.jpg', 109.99, 4),
(2, FALSE, 'Grey Simple', 'Dazie', '../image/W-Heels3.jpg', 104.00, 3),
(2, FALSE, 'Gazelle', 'Adidas', '../image/W-Sports.jpg', 57.00, 2),
(2, TRUE, 'Swift Run', 'Adidas', '../image/W-Sports2.jpg', 60.00, 4),
(2, FALSE, 'Air Zoom', 'Nike', '../image/W-Sports3.jpg', 50.00, 3);

INSERT INTO items (cat_id, new, item_name, brand, img, price, rating) VALUES
(3, TRUE, 'Old Skool Kids', 'Adidas', '../image/C-Shoes2.jpg', 38.00, 3),
(3, FALSE, 'Neon Sandal', 'Vans', '../image/C-Shoes4.jpg', 29.00, 2);

CREATE TABLE category(
	cat_id serial NOT NULL,
	category varchar(100) NOT NULL,
	PRIMARY KEY(cat_id)
);

INSERT INTO category (cat_id, category) VALUES
('1', 'men'),
('2', 'women'),
('3', 'kids');