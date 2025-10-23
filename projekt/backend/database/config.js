//Inportering af npm dotenv modulet.
const dotenv = require('dotenv');

if(process.env.NODE_ENV === 'development'){
    dotenv.config({ path: `.env.${process.env.NODE_ENV}`, debug: true});
};

//Login oplysninger som er relevant at anvende, for at få adgang til at redigere i databasen.
const server = 'projekter.database.windows.net';
const port = 1433;
const user = 'adminGruppe6';
const password = 'DirectUpper9876';
const database = 'databaseApp';

/*Objekt som indeholder alt relevant data,
til forbindelsen med databasen, uden at man skal kunne
se oplysningerne imellem forskellige dokumenter, hvor objektet importeres.*/
const passwordConfig = {
    server,
    port,
    user,
    password,
    database,
    options: {
        encrypt: true
    }
};

//Objektet til configuration for at tilgå og redigere i databasen eksporteres her.
module.exports = passwordConfig;