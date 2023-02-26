// (5) create class with properties identical to db table, assign zero-values for best practice
import { UploadedFile } from "express-fileupload";

export default class Vacation {
  v_id: number;
  description?: string;
  destination: string;
  image?: string;
  start_date: Date;
  end_date: Date;
  price: number;
  likes?: number;
  is_liked?: boolean;
  actual_image: UploadedFile | null;
}
