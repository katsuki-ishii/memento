import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const createDocumentClient = () => {
  const client = new DynamoDBClient({});
  return DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
  });
};

let documentClient;

const getDocumentClient = () => {
  if (!documentClient) {
    documentClient = createDocumentClient();
  }
  return documentClient;
};

const getTableName = () => {
  const tableName = process.env.DDB_TABLE_NAME;
  if (!tableName) {
    const err = new Error('DDB_TABLE_NAME is not set');
    err.statusCode = 500;
    throw err;
  }
  return tableName;
};

export { getDocumentClient, getTableName };
