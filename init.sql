CREATE SCHEMA IF NOT EXISTS p3vacation;

USE p3vacation;

CREATE TABLE IF NOT EXISTS vacations (v_id INT NOT NULL AUTO_INCREMENT, description VARCHAR(255) NULL, destination VARCHAR(45) NOT NULL, image VARCHAR(255) NULL DEFAULT 'default.jpg', start_date DATE NOT NULL, end_date DATE NOT NULL, price DECIMAL(10,2) NOT NULL, PRIMARY KEY (v_id));
CREATE TABLE IF NOT EXISTS users (user_id INT NOT NULL AUTO_INCREMENT, f_name VARCHAR(45) NOT NULL, l_name VARCHAR(45) NOT NULL, user_name VARCHAR(45) NOT NULL, user_pass VARCHAR(45) NOT NULL, user_role ENUM('0', '1') NOT NULL DEFAULT '1',PRIMARY KEY (`user_id`));
CREATE TABLE IF NOT EXISTS vacations_users (id INT NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, v_id INT NOT NULL, PRIMARY KEY (id), INDEX user_id_idx (user_id ASC), INDEX v_id_idx (v_id ASC), CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT v_id FOREIGN KEY (v_id) REFERENCES vacations (v_id) ON DELETE NO ACTION ON UPDATE NO ACTION);
-- CREATE TABLE IF NOT EXISTS vacations_users (id INT NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, v_id INT NOT NULL, PRIMARY KEY (id), INDEX user_id_idx (user_id ASC) VISIBLE, INDEX v_id_idx (v_id ASC) VISIBLE, CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT v_id FOREIGN KEY (v_id) REFERENCES `p3vacation`.`vacations` (v_id) ON DELETE NO ACTION ON UPDATE NO ACTION);
CREATE OR REPLACE VIEW `p3vacation`.`vacation_card` AS SELECT `vacations`.*, COUNT(`vacations_users`.`user_id`) as 'likes' FROM `vacations` LEFT JOIN `vacations_users` ON `vacations_users`.`v_id` = `vacations`.`v_id` GROUP BY `vacations`.`v_id`;

INSERT INTO users (f_name, l_name, user_name, user_pass) VALUES ('Adam', 'Adams', 'Addy', '1234');
INSERT INTO users (f_name, l_name, user_name, user_pass) VALUES ('Bob', 'Brown', 'Bobby', '4321');
INSERT INTO users (f_name, l_name, user_name, user_pass, user_role) VALUES ('Sasha', 'Sasha', 'Admin', 'Admin', '0');
INSERT INTO users (`f_name`, `l_name`, `user_name`, `user_pass`) VALUES ('Dan', 'Duddle', 'Danny', '1111');