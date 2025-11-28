//Importer fra mssql som giver mulighed for at udføre forespørgsler fra scriptet her.
const mssql = require('mssql');
const { encrypt, decrypt } = require('./encryption');
const bcrypt = require('bcrypt');



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
            const encryptedEmail = encrypt(email); // Krypterer email før lagring, symetrisk kryptering
            request.input('brugerEmail', mssql.VarChar(encryptedEmail.length), encryptedEmail);
            const hashedPassword = await bcrypt.hash(password, 10); //10 salt runder 
            request.input('brugerPassword', mssql.VarChar(hashedPassword.length), hashedPassword);


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

    async createFirm(firmName, firmMail, firmPassword, logoUrl) {
        try {
            // Specificer vores query elementer.
            const request = await this.poolconnection.request();
            request.input('firmName', mssql.VarChar(firmName.length), firmName);
            const encryptedFirmMail = encrypt(firmMail);// krypterer email før lagring, symetrisk kryptering
            request.input('firmEmail', mssql.VarChar(encryptedFirmMail.length), encryptedFirmMail);
            const hashedPassword = await bcrypt.hash(firmPassword, 10); // 10 salt runder gør koden sikrere
            request.input('firmPassword', mssql.VarChar(hashedPassword.length), hashedPassword);

            request.input('logoUrl', mssql.VarChar(logoUrl.length), logoUrl);

            // Afsender vores query request til databasen.
            const result = await request.query(`
                INSERT INTO dis.virksomhed (virkNavn, virkMail, virkAdgangKode, virkBillURL)
                VALUES (@firmName, @firmEmail, @firmPassword, @logoUrl)
            `);

            return result.rowsAffected[0];

        } catch (error) {
            console.error("Fejl ved håndtering af query request til createFirm metoden", error);
        };
    };

    async findUserMatch(inputMail, inputPassword) {
        try {
            // Hent alle brugere
            const request = await this.poolconnection.request();
            const result = await request.query(`SELECT * FROM dis.bruger`);
            const users = result.recordsets[0];

            // Klassisk for-loop
            for (let i = 0; i < users.length; i++) {
                const u = users[i];

                const decryptedMail = decrypt(u.brugerMail);

                if (decryptedMail === inputMail) {
                    // Sammenlign hashed password
                    const passwordMatch = await bcrypt.compare(inputPassword, u.brugerAdgangKode);

                    if (passwordMatch) {
                        return [u]; // Returner samme format som før
                    }
                }
            }

            return []; // Ingen match

        } catch (error) {
            console.error("Fejl i findUserMatch:", error);
        }
    };



    async findFirmMatch(inputMail, inputPassword) {
        try {
            const request = await this.poolconnection.request();
            const result = await request.query(`SELECT * FROM dis.virksomhed`);
            const firms = result.recordsets[0];

            // Klassisk for-loop
            for (let i = 0; i < firms.length; i++) {
                const f = firms[i];

                const decryptedMail = decrypt(f.virkMail);

                if (decryptedMail === inputMail) {
                    const passwordMatch = await bcrypt.compare(inputPassword, f.virkAdgangKode);

                    if (passwordMatch) {
                        return [f];
                    }
                }
            }

            return [];

        } catch (error) {
            console.error("Fejl i findFirmMatch:", error);
        }
    };



    async opretReward(firmId, name, description, condition, quotas, elligible) {
        try {
            // Specificer vores query elementer.
            const request = await this.poolconnection.request();
            request.input('firmId', mssql.Int, firmId);
            request.input('name', mssql.VarChar(name.length), name);
            request.input('description', mssql.VarChar(description.length), description);
            request.input('condition', mssql.Int, condition);
            request.input('elligible', mssql.Int, elligible);
            
            if (quotas !== null) {
                request.input('quotas', mssql.VarChar(quotas.length), quotas);
            } else {
                request.input('quotas', mssql.VarChar, null);
            }

            // Afsender vores query request til databasen.
            const result = await request.query(`
                INSERT INTO dis.reward (virkID, beskrivelse, betingelse, kvoter, eligible, rewardName)
                VALUES (@firmId, @description, @condition, @quotas, @elligible, @name)
            `);

            return result.rowsAffected[0];

        } catch (error) {
            console.error("Fejl ved håndtering af query request til findFirmMatch metoden", error);
        };
    };

    async getAllRewardsByFirmId(firmId) {
        try {
            const request = await this.poolconnection.request();
            request.input('firmId', mssql.Int, firmId); 
            
            const result = await request.query(`
                SELECT * FROM dis.reward
                WHERE virkID = @firmId
            `);
            
            return result.recordsets[0];
        } catch (error) {
            console.error("Fejl ved håndtering af query request til getAllRewardsByFirmId metoden", error); 
        };
    };

    async deleteRewardById(rewardId) {
        try {
            const request = await this.poolconnection.request();
            request.input('rewardId', mssql.Int, rewardId);

            const result = await request.query(`
                DELETE FROM dis.reward
                WHERE rewardID = @rewardId
            `);
            
            return result.rowsAffected[0];

        } catch (error) {
            console.error("Fejl ved håndtering af query request til deleteRewardById metoden", error);
        };
    };

    // Anden del, hvormed der skal håndteres customer dashboard info.

    async getCustomerDashboardInfo() {
        try {
            const request = await this.poolconnection.request();
            
            const result = await request.query(`
                SELECT r.rewardID, v.virkID,  v.virkBillURL, v.virkNavn, r.betingelse, r.beskrivelse FROM dis.virksomhed v
                JOIN dis.reward r ON v.virkID = r.virkID
            `);

            return result.recordsets[0];

        } catch (error) {
            console.error("Fejl ved håndtering af query request til getCustomerDashboardInfo metoden", error);
        };
    };

    async getAllCustomerIds() {
        try {
            const request = await this.poolconnection.request();
            
            const result = await request.query(`
                SELECT brugerID FROM dis.bruger
            `);

            return result.recordsets[0].map(row => row.brugerID);
        } catch (error) {
            console.error("Fejl ved håndtering af query request til getAllCustomerIds metoden", error);
        };
    };

    async lockUserReward(brugerId, rewardId) {
        try {
            const request = await this.poolconnection.request();
            request.input('brugerId', mssql.Int, brugerId);
            request.input('rewardId', mssql.Int, rewardId);
            const result = await request.query(`
                INSERT INTO dis.brugerRewards (brugerID, rewardID, counter, udløbsdato)
                VALUES (@brugerId, @rewardId, 0, DATEADD(MONTH, 6, GETDATE()))
            `);
            return result.rowsAffected[0];
        } catch (error) {
            console.error("Fejl ved håndtering af query request til lockUserReward metoden", error);
        };
    };

    async getLatestRewardIdByFirmId(firmId) {
        try {
            const request = await this.poolconnection.request();
            request.input('firmId', mssql.Int, firmId);
            const result = await request.query(`
                SELECT TOP 1 rewardID FROM dis.reward
                WHERE virkID = @firmId
                ORDER BY rewardID DESC
            `);
            if (result.recordsets[0].length > 0) {
                return result.recordsets[0][0].rewardID;
            } else {
                return null;
            }  
        } catch (error) {
            console.error("Fejl ved håndtering af query request til getLatestRewardIdByFirmId metoden", error);
        };
    };

    async deleteUserRewards(targetID) {
        try {
            const request = await this.poolconnection.request();
            request.input('rewardId', mssql.Int, targetID);
            const result = await request.query(`
                DELETE FROM dis.brugerRewards
                WHERE rewardID = @rewardId
            `);
            return result.rowsAffected[0];
        } catch (error) {
            console.error("Fejl ved håndtering af query request til deleteUserRewards metoden", error);
        };
    };

    async counter(brugerId, rewardId) {
        try {
            const request = await this.poolconnection.request();
            request.input('brugerId', mssql.Int, brugerId);
            request.input('rewardId', mssql.Int, rewardId);
            const result = await request.query(`
                UPDATE dis.brugerRewards
                SET counter = counter + 1
                WHERE brugerID = @brugerId AND rewardID = @rewardId
            `);
            return result.rowsAffected[0];
        } catch (error) {
            console.error("Fejl ved håndtering af query request til counter metoden", error);
        };
    };

    async getNewestCustomerId() {
        try {
            const request = await this.poolconnection.request();

            const result = await request.query(`
                SELECT MAX(brugerID) AS lastID FROM dis.bruger;
            `);

            return result.recordsets[0];

        } catch (error) {
            console.error("Fejl ved håndtering af query request til getNewestCustomerId metoden", error);
        };
    };

    async getAllRewardId() {
        try {
            const request = await this.poolconnection.request();

            const result = await request.query(`
                SELECT rewardID FROM dis.reward;
            `);

            return result.recordsets[0];

        } catch (error) {
            console.error("Fejl ved håndtering af query request til getAllRewardId metoden", error);
        };
    };

    async countersById(brugerId) {
        try {
            const request = await this.poolconnection.request();
            request.input('brugerId', mssql.Int, brugerId);
            
            const result = await request.query(`
                SELECT rewardID, counter FROM dis.brugerRewards
                WHERE brugerID = @brugerId;
            `);

            return result.recordsets[0];

        } catch (error) {
            console.error("Fejl ved håndtering af query request til countersById metoden", error);
        };
    };

    async counterAndCondition(brugerId, rewardId) {
        try {
            const request = await this.poolconnection.request();
            request.input('brugerId', mssql.Int, brugerId);
            request.input('rewardId', mssql.Int, rewardId);
            const result = await request.query(`
                SELECT br.counter, r.betingelse FROM dis.brugerRewards br
                JOIN dis.reward r ON br.rewardID = r.rewardID
                WHERE br.brugerID = @brugerId AND br.rewardID = @rewardId;
            `);
            return result.recordsets[0];
        } catch (error) {
            console.error("Fejl ved håndtering af query request til counterAndCondition metoden", error);
        };
    };

    async deleteUserReward(brugerId, rewardId) {
        try {
            const request = await this.poolconnection.request();
            request.input('brugerId', mssql.Int, brugerId);
            request.input('rewardId', mssql.Int, rewardId);
            const result = await request.query(`
                DELETE FROM dis.brugerRewards
                WHERE brugerID = @brugerId AND rewardID = @rewardId;
            `);
            return result.rowsAffected[0];
        } catch (error) {
            console.error("Fejl ved håndtering af query request til deleteUserReward metoden", error);
        };
    };

    async getVirkNavnByRewardId(rewardId) {
        try {
            const request = await this.poolconnection.request();
            request.input('rewardId', mssql.Int, rewardId);
            
            const result = await request.query(`
                SELECT v.virkNavn FROM dis.virksomhed v
                JOIN dis.reward r ON v.virkID = r.virkID
                WHERE r.rewardID = @rewardId
            `);

            return result.recordsets[0][0]?.virkNavn || null;

        } catch (error) {
            console.error("Fejl ved håndtering af query request til getVirkNavnByRewardId metoden", error);
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