//(1)
class Config {
    //what port the backend app uses?
    //use port 3001 unless there exists a preconfigured port
    public port = process.env.PORT || 3100;
    
    //how to connect to our database?
    //public mySQLHost = "localhost";   //local
    public mySQLHost = "db";            //docker

    public mySQLPort = 3306;
    public mySQLUser = "root";
    public mySQLPassword = "12345678";
    public mySQLdb = "p3vacation";
}

const config = new Config()
export default config;