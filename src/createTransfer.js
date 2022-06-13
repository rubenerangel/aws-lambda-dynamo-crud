const ddbClient = require('./../libs/ddbClient');
const { PutItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');
// import core
// const  middy = require('@middy/core');
// import some middlewares
// const jsonBodyParser = require('@middy/http-json-body-parser');
// const validator = require('@middy/validator');

const createTransfer = async(event) => {
  const resp = { statusCode: 200 };

  const promise = new Promise(async (resolve, reject) => {
    try {
      const body = JSON.parse(event.body);
      const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Item: {
          id: { S: `C${Math.floor(10000 + Math.random() * 90000)}` },
          ...marshall(body)
        },
      };
      const createResult = await ddbClient.send(new PutItemCommand(params));
  
      resp.body = JSON.stringify({
        message: "Successfully create register.",
        createResult,
        Item: unmarshall(params.Item)
      });
      resolve(resp);
    } catch (e) {
      console.error(e);
      resp.statusCode = 500;
      resp.body = JSON.stringify({
        message: "Failed to create new register.",
        errorMsg: e.message,
        errorStack: e.stack,
      });
  
      reject(resp);
    }
  });
  
  return promise;
};

// const taskSchema = {
//   type: 'object',
//   properties: {
//     body: {
//       type: 'object',
//       properties: {
//         monto: { type: 'string' },
//         originBankName: { type: 'string' },
//       },
//       required: ['monto', 'originBankName'] // Insert here all required event properties
//     }
//   }
// }

module.exports = { createTransfer };