const ddbClient = require('../libs/ddbClient');
const { ScanCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

// Import required AWS SDK clients and commands for Node.js.
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("./../libs/s3Client"); // Helper function that creates an Amazon S3 service client module.

const getAllTransfers = async(event) => {
  const resp = { statusCode: 200 };
  try {
    let obn = event.queryStringParameters
      ? event.queryStringParameters.originBankName 
      : undefined;

    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
    };

    if (obn) {
      params['FilterExpression'] = `contains(originBankName,:obn)`;
      params['ExpressionAttributeValues'] = {":obn": {S: obn}};
    }
    
    let { Items } = await ddbClient.send(new ScanCommand(params));
    Items = Items.map((item) => unmarshall(item));

    if (!Items.length) {
      const bucketParams = {
        Bucket: "bucket-ruben",
        Key: "transfers_back_test.json",
      };

      // Create a helper function to convert a ReadableStream to a string.
      const streamToString = (stream) =>
        new Promise((resolve, reject) => {
          const chunks = [];
          stream.on("data", (chunk) => chunks.push(chunk));
          stream.on("error", reject);
          stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
        });
  
      // Get the object} from the Amazon S3 bucket. It is returned as a ReadableStream.
      const data = await s3Client.send(new GetObjectCommand(bucketParams));
      
      // Convert the ReadableStream to a string.
      const bodyContents = await streamToString(data.Body);
      
      const body = JSON.parse(bodyContents);
      
      await Promise.all(
        await body.map(async(el) => {
          const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Item: {
              ...marshall(el)
            },
          };
          await ddbClient.send(new PutItemCommand(params));
        })
      );
    }
    
    ({Items} = await ddbClient.send(new ScanCommand(params)));
    
    resp.body = JSON.stringify({
      message: "Successfully retrieved all Transfers.",
      data: Items.map((item) => unmarshall(item)),
    });

  } catch (e) {
    console.error(e);
    resp.statusCode = 500;
    resp.body = JSON.stringify({
        message: "Failed to retrieve Transfers.",
        errorMsg: e.message,
        errorStack: e.stack,
    });
  }
  return resp;
};

module.exports = { getAllTransfers };