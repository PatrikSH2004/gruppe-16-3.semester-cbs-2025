//Inportering af npm dotenv modulet.
require('dotenv').config();

/*Objekt som indeholder alt relevant data,
til forbindelsen med databasen, uden at man skal kunne
se oplysningerne imellem forskellige dokumenter, hvor objektet importeres.*/
const passwordConfig = {
    server: process.env.DB_SERVER,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    options: {
        encrypt: true
    }
};

//Objektet til configuration for at tilgå og redigere i databasen eksporteres her.
module.exports = passwordConfig;