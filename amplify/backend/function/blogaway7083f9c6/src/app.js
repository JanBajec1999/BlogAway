/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/



const AWS = require('aws-sdk')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var bodyParser = require('body-parser')
var express = require('express')

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();

let tableName = "_blogs";
if(process.env.ENV && process.env.ENV !== "NONE") {
  tableName = tableName + '-' + process.env.ENV;
}

const userIdPresent = false; // TODO: update in case is required to use that definition
const partitionKeyName = "PK";
const partitionKeyType = "S";
const sortKeyName = "SK";
const sortKeyType = "S";
const hasSortKey = sortKeyName !== "";
const path = "/comments";
const UNAUTH = 'UNAUTH';
const hashKeyPath = '/:' + partitionKeyName;
const sortKeyPath = hasSortKey ? '/:' + sortKeyName : '';
// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

// convert url string param to expected Type
const convertUrlType = (param, type) => {
  switch(type) {
    case "N":
      return Number.parseInt(param);
    default:
      return param;
  }
}

/************************************
 CREATE COMMENT
 *************************************/

app.put(path, function(req, res) {

  let putItemParams = {
    TableName: tableName,
    Item: req.body
  }
  dynamodb.put(putItemParams, (err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url, body: req.body});
    } else{
      res.json({success: 'put call succeed!', url: req.url, data: data})
    }
  });
});

/************************************
 UPDATE COMMENT
 *************************************/

app.post(path, function(req, res) {

  let clientUsername = req.apiGateway.event.requestContext.authorizer.claims['cognito:username'];

  let getItemParams = {
    TableName: tableName,
    Key: {
      PK: req.body.PK,
      SK: req.body.SK
    }
  }

  dynamodb.get(getItemParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      if (data.Item) {
        console.log(data.Item.username + " in " + clientUsername);
        if(data.Item.username === clientUsername){
          let putItemParams = {
            TableName: tableName,
            Item: req.body
          }
          dynamodb.put(putItemParams, (err, data) => {
            if(err) {
              res.statusCode = 500;
              res.json({error: err, url: req.url, body: req.body});
            } else{
              res.json({success: 'post call succeed!', url: req.url, data: data})
            }
          });
        }
      } else {
        res.json({error: "Ni Items"});
      }
    }
  });
});


/*****************************************
 GET COMMENTS OF BLOG
 *****************************************/

app.get(path, function(req, res) {

  let getItemParams = {
    TableName: tableName,
    KeyConditionExpression: "#PK = :PK and begins_with(#SK, :SK) ",
    ExpressionAttributeNames:{
      "#PK": "PK",
      "#SK": "SK"
    },
    ExpressionAttributeValues: {
      ":PK": req.query.PK,
      ":SK": "C#"
    }
  }

  dynamodb.query(getItemParams,(err, data) => {
    if(err) {
      res.statusCode = 500;
      res.json({error: 'Could not load items: ' + err});
    } else {
      if (data.Item) {
        res.json(data.Item);
      } else {
        res.json(data) ;
      }
    }
  });
});

/**************************************
 DELETE COMMENT
 ***************************************/

app.delete(path, function(req, res) {

  let removeItemParams = {
    TableName: tableName,
    Key: {
      PK: req.query.PK,
      SK: req.query.SK
    }
  }
  dynamodb.delete(removeItemParams, (err, data)=> {
    if(err) {
      res.statusCode = 500;
      res.json({error: err, url: req.url});
    } else {
      res.json({url: req.url, data: data});
    }
  });

});




app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
