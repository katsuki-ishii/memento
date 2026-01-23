import { GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { getDocumentClient, getTableName } from './ddb.js';

const buildKey = (sub) => ({
  pk: `USER#${sub}`,
  sk: 'SETTINGS',
});

const getSettingsItem = async (sub) => {
  const command = new GetCommand({
    TableName: getTableName(),
    Key: buildKey(sub),
  });
  const { Item } = await getDocumentClient().send(command);
  return Item || null;
};

const updateSettingsItem = async (sub, updates, now) => {
  const expressionNames = {
    '#updatedAt': 'updatedAt',
    '#createdAt': 'createdAt',
  };
  const expressionValues = {
    ':updatedAt': now,
    ':createdAt': now,
  };
  const setExpressions = [];

  Object.entries(updates).forEach(([key, value]) => {
    const nameKey = `#${key}`;
    const valueKey = `:${key}`;
    expressionNames[nameKey] = key;
    expressionValues[valueKey] = value;
    setExpressions.push(`${nameKey} = ${valueKey}`);
  });

  setExpressions.push('#updatedAt = :updatedAt');
  setExpressions.push('#createdAt = if_not_exists(#createdAt, :createdAt)');

  const command = new UpdateCommand({
    TableName: getTableName(),
    Key: buildKey(sub),
    UpdateExpression: `SET ${setExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionNames,
    ExpressionAttributeValues: expressionValues,
    ReturnValues: 'ALL_NEW',
  });

  const { Attributes } = await getDocumentClient().send(command);
  return Attributes || null;
};

export { getSettingsItem, updateSettingsItem };
