const { default: axios } = require("axios");
const express = require("express");
const app = express();
require("dotenv").config();
const countryCodes = require("./countryCodes");
const fs = require("fs");
var json2xls = require("json2xls");
const http = require("http");

const getQuery = async () => {
  var searchQuery;

  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  readline.question("Enter the search query ", async (name) => {
    if (name) {
      var q = "";
      for (var i = 0; i < name.length; i++) {
        if (name.charAt(i) === " ") {
          q = q + "+";
        } else {
          q += name.charAt(i);
        }
      }

      var ans = [];
      var i = 0;
      for (const code in countryCodes) {
        console.log(`Fetching country ${countryCodes[code]}...`);
        var k = await axios.get(
          `https://itunes.apple.com/search?term=${q}&entity=software&country=${code}`
        );
        k = k.data.results;
        ans.push(k);

        if (code === "us") {
          console.log(ans);
        }
      }
      if (ans) {
        var xls = json2xls(ans);
        fs.writeFileSync("results.xlsx", xls, "binary", (err) => {
          if (err) {
            console.log("Error occcured", err);
          }
          console.log("saved");
        });
      }
    }

    readline.close();
  });
};

app.get("/", (req, res) => {
  res.send("Query App, use CLI get data");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
  getQuery();
});
