const ddbClient = require('./../libs/ddbClient');
const { GetItemCommand  } = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

const getTransfer = async(event) => {
  const resp = { statusCode: 200 };

  try {
    const params = {
      TableName: process.env.DYNAMODB_TABLE_NAME,
      Key: marshall({id: event.pathParameters.id}),
    }

    const { Item } = await ddbClient.send(new GetItemCommand(params));

    console.log({Item})

    resp.body = JSON.stringify({
      message: "Successfully retrivied Transfer",
      data: (Item) ? unmarshall(Item) : {},
      rawData: Item,
    });
  } catch (e) {
    console.error(e);
    resp.statusCode = 500;
    resp.body = JSON.stringify({
        message: "Failed to retrieve Transfer.",
        errorMsg: e.message,
        errorStack: e.stack,
    });
  }
  return resp;
};

module.exports = { getTransfer };