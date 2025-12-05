const https = require("https");

const pingGet = (targetHost) => {
  const startTime = Date.now();
  console.log("Sent ping");
  const req = https.get(targetHost, (res) => {
    res.on("data", (chunk) => {
      // console.log("Received", chunk.toString());
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      console.log("GET request to", targetHost, "took", responseTime, "ms");   
    });
  });

  req.on("error", (error) => {
    console.error("Error:", error.message);
  });
};

const pinger1 = "https://sejcbsprojekt.app/customerLogin";

// Kald funktionen ping() med parameter
pingGet(pinger1);