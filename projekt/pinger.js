const https = require("https");
require('dotenv').config();

// Simple GET request ping
const pingGet = (targetHost) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    console.log("Sent ping");
    const req = https.get(targetHost, (res) => {
      res.on("data", (chunk) => {
        // console.log("Received", chunk.toString());
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log("GET request to", targetHost, "took", responseTime, "ms");
      });
      res.on("end", resolve);
    });

    req.on("error", (error) => {
      console.error("Error:", error.message);
      reject(error);
    });
  });
};

// Simple POST request ping
const pingPost = (targetHost, path, data) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      hostname: targetHost,
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const startTime = Date.now();
    console.log("Sent POST ping");

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log("POST request to", targetHost + path, "took", responseTime, "ms");
        console.log("Response from POST request:", responseBody);
        resolve();
      });
    });

    req.on("error", (error) => {
      console.error("Error:", error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};

// Afhenter session cookie fra response headers
function getCookieFromResponse(res) {
  const raw = res.headers['set-cookie'];
  if (!raw) return '';
  const cookie = raw.find(c => c.startsWith('connect.sid='));
  return cookie ? cookie.split(';')[0] : '';
};

// Bruger den fundte cookie fra funktionen ovenfor til at sende en POST request med cookie header
const pingPostWithCookie = (targetHost, path, data, cookie, method = 'POST') => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);

    const options = {
      hostname: targetHost,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        // En spread operator tilføjer cookie header kun hvis cookie er defineret
        ...(cookie ? { Cookie: cookie } : {})
      }
    };

    const startTime = Date.now();
    console.log(`Sent ${method} ping`);

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      res.on('end', () => {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`${method} request to`, targetHost + path, "took", responseTime, "ms");
        console.log("Response:", responseBody);
        resolve({ res, responseBody });
      });
    });

    req.on("error", (error) => {
      console.error("Error:", error.message);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
};

// Konfiguration af pinger testen

// Test 1
const pinger1 = "https://sejcbsprojekt.app";

// Test 2
const pingerHost = "sejcbsprojekt.app";
const pingerPath = "/customerLogin";
const jsonData = { userMail: process.env.PINGER_MAIL, userPassword: process.env.PINGER_PASSWORD };

// Test 3
const firmLoginPath = "/firmLogin";
const createRewardPath = "/createReward";
const firmLoginData = { firmMail: process.env.PINGER_FIRM_MAIL, firmPassword: process.env.PINGER_FIRM_PASSWORD };

const rewardData = {
  name: "Test Reward",
  description: "Test beskrivelse",
  condition: 5,
  quotas: 10
};

// Selve algoritmen til pinger testen.
const test = async function() {
  console.log("\nTest nr. 1 (Frontpage):");
  await pingGet(pinger1);
  console.log("\nTest nr. 2: (Customer Login):");
  await pingPost(pingerHost, pingerPath, jsonData);
  console.log("\nTest nr. 3: (Firm Login)");
  const loginResult = await pingPostWithCookie(pingerHost, firmLoginPath, firmLoginData, null, 'POST');
  const cookie = getCookieFromResponse(loginResult.res);
  if (!cookie) {
    console.error("No session cookie received. Cannot proceed.");
    return;
  };
  console.log("\nTest nr. 4: (Creating reward)");
  await pingPostWithCookie(pingerHost, createRewardPath, rewardData, cookie, 'POST');
};
test();