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

    //Metode til at sende customer data til databasen.
    async createCustomer(name, email, password) {
        try {
            // Specificer vores query elementer.
            const request = await this.poolconnection.request();
            request.input('brugerName', mssql.VarChar(name.length), name);
            request.input('brugerEmail', mssql.VarChar(email.length), email);
            request.input('brugerPassword', mssql.VarChar(password.length), password);

            // Afsender vores query request til databasen.
            const result = await request.query(`
                INSERT INTO dis.bruger (brugerNavn, brugerMail, brugerAdgangKode)
                VALUES (@brugerName, @brugerEmail, @brugerPassword)
            `);

            return result.rowsAffected[0];

        } catch (error) {
            console.error("Fejl ved håndtering af query request til createCustomer metoden", error);
        };

    };

    async createFirm(firmName, firmMail, firmPassword) {
        try {
            // Specificer vores query elementer.
            const request = await this.poolconnection.request();
            request.input('firmName', mssql.VarChar(firmName.length), firmName);
            request.input('firmEmail', mssql.VarChar(firmMail.length), firmMail);
            request.input('firmPassword', mssql.VarChar(firmPassword.length), firmPassword);

            // Afsender vores query request til databasen.
            const result = await request.query(`
                INSERT INTO dis.virksomhed (virkNavn, virkMail, virkAdgangKode)
                VALUES (@firmName, @firmEmail, @firmPassword)
            `);

            return result.rowsAffected[0];

        } catch (error) {
            console.error("Fejl ved håndtering af query request til createFirm metoden", error);
        };
    };

    async findUserMatch(inputMail, inputPassword) {
        try {
            // Specificer vores query elementer.
            const request = await this.poolconnection.request();
            request.input('inputMail', mssql.VarChar(inputMail.length), inputMail);
            request.input('inputPassword', mssql.VarChar(inputPassword.length), inputPassword);

            // Afsender vores query request til databasen.
            const result = await request.query(`
                SELECT * FROM dis.bruger
                WHERE brugerMail = @inputMail AND brugerAdgangKode = @inputPassword
            `);

            return result.recordsets[0];

        } catch (error) {
            console.error("Fejl ved håndtering af query request til findUserMatch metoden", error);
        };
    };

    async findFirmMatch(inputMail, inputPassword) {
        try {
            // Specificer vores query elementer.
            const request = await this.poolconnection.request();
            request.input('inputMail', mssql.VarChar(inputMail.length), inputMail);
            request.input('inputPassword', mssql.VarChar(inputPassword.length), inputPassword);

            // Afsender vores query request til databasen.
            const result = await request.query(`
                SELECT * FROM dis.virksomhed
                WHERE virkMail = @inputMail AND virkAdgangKode = @inputPassword
            `);

            return result.recordsets[0];

        } catch (error) {
            console.error("Fejl ved håndtering af query request til findFirmMatch metoden", error);
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