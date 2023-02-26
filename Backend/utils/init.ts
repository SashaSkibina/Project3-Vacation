import dal_mySQL from "./dal_mySQL";

//const createSchema = "CREATE SCHEMA IF NOT EXISTS p3vacation;"
//const useDefault = "USE p3vacation;"

const createVacations = "CREATE TABLE IF NOT EXISTS vacations (v_id INT NOT NULL AUTO_INCREMENT, description VARCHAR(255) NULL, destination VARCHAR(45) NOT NULL, image VARCHAR(255) NULL DEFAULT 'default.jpg', start_date DATE NOT NULL, end_date DATE NOT NULL, price DECIMAL(10,2) NOT NULL, PRIMARY KEY (v_id));"
const createUsers = "CREATE TABLE IF NOT EXISTS users (user_id INT NOT NULL AUTO_INCREMENT, f_name VARCHAR(45) NOT NULL, l_name VARCHAR(45) NOT NULL, user_name VARCHAR(45) NOT NULL, user_pass VARCHAR(45) NOT NULL, user_role ENUM('0', '1') NOT NULL DEFAULT '1',PRIMARY KEY (`user_id`));"
const createLikes = "CREATE TABLE IF NOT EXISTS vacations_users (id INT NOT NULL AUTO_INCREMENT, user_id INT NOT NULL, v_id INT NOT NULL, PRIMARY KEY (id), INDEX user_id_idx (user_id ASC), INDEX v_id_idx (v_id ASC), CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT v_id FOREIGN KEY (v_id) REFERENCES vacations (v_id) ON DELETE NO ACTION ON UPDATE NO ACTION);"
const createView = "CREATE OR REPLACE VIEW `p3vacation`.`vacation_card` AS SELECT `vacations`.*, COUNT(`vacations_users`.`user_id`) as 'likes' FROM `vacations` LEFT JOIN `vacations_users` ON `vacations_users`.`v_id` = `vacations`.`v_id` GROUP BY `vacations`.`v_id`;"

const createData1 = "INSERT INTO users (f_name, l_name, user_name, user_pass) VALUES ('Adam', 'Adams', 'Addy', '1234');"
const createData2 = "INSERT INTO p3vacation.users (f_name, l_name, user_name, user_pass) VALUES ('Bob', 'Brown', 'Bobby', '4321');"
const createData3 = "INSERT INTO p3vacation.users (f_name, l_name, user_name, user_pass, user_role) VALUES ('Sasha', 'Sasha', 'Admin', 'Admin', '0');"
const createData4 = "INSERT INTO `p3vacation`.`users` (`f_name`, `l_name`, `user_name`, `user_pass`) VALUES ('Dan', 'Duddle', 'Danny', '1111');"

const sqlInit = async () => {
    // await dal_mySQL.execute(createSchema);
    // await dal_mySQL.execute(useDefault);

    await dal_mySQL.execute(createVacations);
    await dal_mySQL.execute(createUsers);
    await dal_mySQL.execute(createLikes);
    await dal_mySQL.execute(createView);

    //dummy data

    await dal_mySQL.execute(createData1);
    await dal_mySQL.execute(createData2);
    await dal_mySQL.execute(createData3);
    await dal_mySQL.execute(createData4);
}

export default sqlInit