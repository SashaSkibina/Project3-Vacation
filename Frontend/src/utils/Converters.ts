export const formatSqlDate = (date: string) => {
  const tempDate = date.split("T")[0].split("-")
      
  return (
      tempDate[2]
      + "/" 
      + tempDate[1] 
      + "/" 
      + tempDate[0]
  );
}

export const toSqlDATE = (date: string) => {
  let newDate = date;
  if (newDate.includes("/")) {
    const [day, month, year] = date.split('/');
    newDate = new Date(`${year}-${month}-${day}`).toISOString().slice(0, 10);
  }
  return newDate;
}