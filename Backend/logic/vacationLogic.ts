//(6)

import { unlink } from "fs";
import { OkPacket } from "mysql";
import Vacation from "../models/vacationModel";
import dal from "../utils/dal_mySQL";

//Add vacation - POST (for admin)
const addVacation = async (vacation: Vacation): Promise<Vacation> => {
  //apply unique name
  let imgName: string = Date.now().toString();
  if (vacation.actual_image) {
    imgName = imgName+vacation.actual_image.name;
    try {
      //save to filesystem
      vacation.actual_image.mv(`./media/${imgName}`);
      console.log('File has been saved to server!', imgName)
    } catch (error) {
      console.error(error);
    }
    vacation.actual_image = null;
  } else {
    imgName = "default.jpg"
  }
  //install uuid and change to generic file name
  
  const sql = `
      INSERT INTO vacations VALUES 
      (DEFAULT,
      '${vacation.description}',
      '${vacation.destination}',
      '${imgName}',
      '${vacation.start_date}',
      '${vacation.end_date}',
      ${vacation.price}
      )`;
  let response: OkPacket;
  try {
    response = await dal.execute(sql);
    vacation.v_id = response.insertId;  
    vacation.image = imgName;
  } catch (error) {
      console.error(error);
  }         
  return vacation;
};

//Edit vacation - PUT (for admin)  (!!!) IF NOT WORKING add , before WHERE clause
//gets a vacation with of w/o each of the fields (incl. actual_image)
const editVacation = async (vacation: Vacation): Promise<Vacation> => {
let imgName: string = ""
  //if new img was provided
  if (vacation.actual_image){
    //retrieve old image name
    const oldName = await dal.execute(`
      SELECT image 
      FROM vacations 
      WHERE v_id = ${vacation.v_id}`);

    switch (oldName[0].image) {
      case ('default.jpg'):
        //apply unique name
        imgName = Date.now().toString()+vacation.actual_image.name;
        console.log(imgName);
        break;
        //use old name
      default:
        imgName = oldName[0].image;
        break;
    }
    vacation.actual_image.mv(`./media/${imgName}`);
  }

  const sql = `
        UPDATE vacations 
        SET description = '${vacation.description}',
        destination = '${vacation.destination}',
        image = '${imgName}',
        start_date = '${vacation.start_date}',
        end_date = '${vacation.end_date}',
        price = ${vacation.price}
        WHERE v_id = ${vacation.v_id}
        `;
  await dal.execute(sql); 
  return vacation;
};

//Delete vacation - DELETE (for admin)
const deleteVacation = async (id: number): Promise<void> => {
  const imgName = await dal.execute(`
      SELECT image 
      FROM vacations 
      WHERE v_id = ${id}`);
  console.log(imgName);
  if (imgName[0].image !== "default.jpg") {
    //delete image (accept from default)
    unlink(`./media/${imgName[0].image}`,() => console.log(imgName[0].image + "deleted from fs"))
  }
  const deleteChild = `DELETE FROM vacations_users WHERE v_id = ${id}`;
  await dal.execute(deleteChild);
  const sql = `
        DELETE FROM vacations WHERE v_id=${id}`;
  const response = await dal.execute(sql);
};

//Get all - sorted by Date (for all roles)
const getVacationCards = async (user_id:number): Promise<Vacation[]> => {
  const sql = `SELECT vacation_card.*, 
                MAX (CASE WHEN vacations_users.user_id = ${user_id} 
                  THEN vacations_users.user_id 
                  ELSE 0 
                  END) as is_liked
                  FROM vacation_card
                  LEFT JOIN vacations_users 
                    ON vacation_card.v_id = vacations_users.v_id
                  GROUP BY vacation_card.v_id
              `
  const vacations = await dal.execute(sql);
  return vacations;
};

//Get only vacations followed by user
const getFavorites = async (user_id:number): Promise<Vacation[]> => {
    const sql = `
        SELECT * FROM vacation_card
        JOIN vacations_users
        ON vacation_card.v_id = vacations_users.v_id
        WHERE vacations_users.user_id = ${user_id}
        `;
        
    const favorites = await dal.execute(sql);
    if (favorites.length === 0) {
        throw new Error('There are no vacations marked as "Followed"');
    }
    return favorites;
};

export default {
  addVacation,
  deleteVacation,
  editVacation,
  getVacationCards,
  getFavorites
};

/*
SELECT COUNT(column_name)
FROM likesTable
WHERE v_id=this vacation;
*/
/*
INSERT INTO vacations (likes_num, column1, column2, column3, ...)
SELECT COUNT v_id, column1, column2, column3, ...
FROM likes
WHERE v_id = this vacation id value;
*/
// https://www.w3schools.com/sql/sql_insert_into_select.asp
