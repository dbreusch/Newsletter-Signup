//jshint esversion:6
require('dotenv').config()
const express = require('express');
const https = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

const localPort = 3000;

// index.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// post
app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const eMail = req.body.email;

  const data = {
    members: [{
      email_address: eMail,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/4729d12209";

  const options = {
    method: "POST",
    auth: process.env.API_KEY
  };

  const request = https.request(url, options, function(response) {
    response.on("data", function(data) {

      // -- not sure why but statusCode always shows Success...
      // statusCode = response.statusCode;
      // console.log(statusCode);
      // if (statusCode === 200) {

      // ...so I use total_created instead!
      parsed = JSON.parse(data);
      totalCount = parsed.total_created;
      if (totalCount === 1) {
        res.sendFile(__dirname + "/success.html");
        console.log("Success");
      } else {
        res.sendFile(__dirname + "/failure.html");
        console.log("Failure");
      }

    });

  });

  request.write(jsonData);

  request.end();

});

app.post("/failure", function(req,res) {
  res.redirect("/");
});

// start server locally
// app.listen(localPort, function() {
//   console.log("Server started on port " + localPort);
// });

// start server on Heroku
// app.listen(process.env.PORT, function() {
//   console.log("Server started on port " + process.env.PORT);
// });

// start server on Heroku OR locally
app.listen(process.env.PORT || localPort, function() {
  console.log("Server started...");
});

// API Key
// 7ef85752b1b809d3ddce03c09220b264-us10

// List id
// 4729d12209
