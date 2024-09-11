import AWS from "aws-sdk";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export async function main(event, context) {
    const crypto = require("crypto");

    let uuid = crypto.randomUUID();
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.tableName,
        Item: {
            // The attributes of the item to be created
            userId: "123", // The id of the author
            noteId: uuid.v1(), // A unique uuid
            content: data.content, // Parsed from request body
            attachment: data.attachment, // Parsed from request body
            createdAt: Date.now(), // Current Unix timestamp
        },
    };
    
    try {
        await dynamoDb.put(params).promise();
        return {
        statusCode: 200,
        body: JSON.stringify(params.Item),
        };
        } catch (e) {
        return {
        statusCode: 500,
        body: JSON.stringify({ error: e.message }),
        };
    }
}