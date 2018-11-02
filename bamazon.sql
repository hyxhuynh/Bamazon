DROP DATABASE IF EXISTS bamazon_DB;
CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Blade of the Ruined King", "Weapons", 3200, 6);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Infinity Edge", "Weapons", 3400, 4);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Adaptive Helm", "Health", 2800, 28);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Guardian's Orb", "Health", 950, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Aegis of the Legion", "Armor", 1100, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Forgefire Cape", "Armor", 3900, 21);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Randuin's Omen", "Armor", 2900, 31);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Archangel's Staff", "Mana", 3200, 12);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Luden's Echo", "Mana", 3200, 45);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Dark Seal", "Mana", 350, 50);

-- Quick view of the table
SELECT * FROM products;