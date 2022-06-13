const ddbClient = require('./../libs/ddbClient');
const { UpdateItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const updateTransfer = async(event) => {
  const resp = { statusCode: 200 }

  try {
    const body = JSON.parse(event.body);
    const objKeys = Object.keys(body);
    const params = {
        TableName: process.env.DYNAMODB_TABLE_NAME,
        Key: marshall({ id: event.pathParameters.id }),
        UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
        ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
            ...acc,
            [`#key${index}`]: key,
        }), {}),
        ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
            ...acc,
            [`:value${index}`]: body[key],
        }), {})),
    };
    const updateResult = await ddbClient.send(new UpdateItemCommand(params));

    resp.body = JSON.stringify({
        message: "Successfully updated Transfer.",
        updateResult,
    });
  } catch (e) {
    console.error(e);
    resp.statusCode = 500;
    resp.body = JSON.stringify({
        message: "Failed to update Transfer.",
        errorMsg: e.message,
        errorStack: e.stack,
    });
  }

  return resp;
};

module.exports = { updateTransfer };
