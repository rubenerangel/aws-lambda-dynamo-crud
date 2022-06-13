const ddbClient = require('./../libs/ddbClient');
const { DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const { marshall } = require('@aws-sdk/util-dynamodb');

const deleteTransfer = async(event) => {
  const resp = { statusCode: 200 };

    try {
        const params = {
            TableName: process.env.DYNAMODB_TABLE_NAME,
            Key: marshall({ id: event.pathParameters.id }),
        };
        const deleteResult = await ddbClient.send(new DeleteItemCommand(params));

        resp.body = JSON.stringify({
            message: "Successfully deleted Transfer.",
            deleteResult,
        });
    } catch (e) {
        console.error(e);
        resp.statusCode = 500;
        resp.body = JSON.stringify({
            message: "Failed to delete Transfer.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }

    return resp;
};

module.exports = { deleteTransfer };