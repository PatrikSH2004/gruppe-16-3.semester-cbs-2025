//Importer fra mssql som giver mulighed for at udføre forespørgsler fra scriptet her.
const mssql = require('mssql');

class Database{
    //Variable som kun anvendes i scopet inden for Database klassen.
    config = {};
    poolconnection = null;
    connected = false;

    //Laver config ud fra vores oplysninger i config.js.
    constructor(config){
        this.config = config;
    };

    //Metode til at oprette en forbindelse til databasen.
    async connect(){
        try{
            this.poolconnection = await mssql.connect(this.config);
            this.connected = true;
            console.log("Forbindelsen til databasen er oprettet.");
            return this.poolconnection;
        }catch(error){
            console.error("Fejl ved oprettelse af forbindelse til databasen:", error);
            this.connected = false;
        };
    };

    //Metode til at stoppe forbindelsen til databasen.
    async disconnect(){
        try{
            if(this.connected){
                await this.poolconnection.close();
                this.connected = false;
                console.log("forbindelsen til databasen er afsluttet.");
            }; 
        }catch(error){
            console.error("Fejl ved afslutning af forbindelsen til databasen:", error);
        };
    };

};

/*
En funktion som opretter et database klasse-objekt og forbinder til databasen,
idet funktionen kaldes. Dertil returneres database objektet.
*/
const createDatabaseConnection = async (passwordConfig) => {
    let database = new Database(passwordConfig);
    await database.connect();
    return database;
};

//Hertil eksporteres funktionen så klasse-objektet kan oprettes fra andres scripts.
module.exports = createDatabaseConnection;