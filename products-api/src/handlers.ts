import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from 'aws-sdk'
import { V4MAPPED } from "dns";
import { v4 } from "uuid";
import * as yup from "yup";

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = "ProductsTable";
const headers = {
  "content-type": "application/json",
}
const schema = yup.object().shape({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  available: yup.bool().optional(),
});

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const reqBody = JSON.parse(event.body as string);

    await schema.validate(reqBody, { abortEarly: false });
    const product = {
      ...reqBody,
      productID: v4(),
    }
    await docClient.put({
      TableName: 'ProductsTable',
      Item: product,
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(product),
    };
  } catch (e) {
    return handleError(e);
  }
};

export const getProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const id = event.pathParameters?.id

  const output = await docClient.get({
    TableName: tableName,
    Key: {
      productID: id
    }
  }).promise()

  if (!output.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: "not found" }),
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify(output.Item),
  }
}

const handleError = (e: unknown) => {
  if (e instanceof yup.ValidationError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        errors: e.errors
      })
    }
  }

  if (e instanceof SyntaxError) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: `Invalid rquest body format: "${e.message}"` }),
    }
  }

  throw e;
}
