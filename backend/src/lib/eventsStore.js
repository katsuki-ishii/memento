import { DeleteCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { getDocumentClient, getTableName } from './ddb.js';

const buildEventKey = (sub, eventId) => ({
  pk: `USER#${sub}`,
  sk: eventId,
});

const listEventsByWeek = async (sub, weekId) => {
  const command = new QueryCommand({
    TableName: getTableName(),
    IndexName: 'gsi1',
    KeyConditionExpression: 'gsi1pk = :gsi1pk and begins_with(gsi1sk, :gsi1sk)',
    ExpressionAttributeValues: {
      ':gsi1pk': `WEEK#${weekId}`,
      ':gsi1sk': `USER#${sub}#`,
    },
  });
  const { Items } = await getDocumentClient().send(command);
  return Items || [];
};

const listAllEvents = async (sub) => {
  const command = new QueryCommand({
    TableName: getTableName(),
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :sk)',
    ExpressionAttributeValues: {
      ':pk': `USER#${sub}`,
      ':sk': 'EVENT#',
    },
  });
  const { Items } = await getDocumentClient().send(command);
  return Items || [];
};

const createEvent = async (payload) => {
  const command = new PutCommand({
    TableName: getTableName(),
    Item: payload,
  });
  await getDocumentClient().send(command);
  return payload;
};

const updateEvent = async (sub, eventId, updates, now) => {
  const expressionNames = {
    '#updatedAt': 'updatedAt',
  };
  const expressionValues = {
    ':updatedAt': now,
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

  const command = new UpdateCommand({
    TableName: getTableName(),
    Key: buildEventKey(sub, eventId),
    UpdateExpression: `SET ${setExpressions.join(', ')}`,
    ExpressionAttributeNames: expressionNames,
    ExpressionAttributeValues: expressionValues,
    ConditionExpression: 'attribute_exists(pk) AND attribute_exists(sk)',
    ReturnValues: 'ALL_NEW',
  });

  const { Attributes } = await getDocumentClient().send(command);
  return Attributes || null;
};

const deleteEvent = async (sub, eventId) => {
  const command = new DeleteCommand({
    TableName: getTableName(),
    Key: buildEventKey(sub, eventId),
    ConditionExpression: 'attribute_exists(pk) AND attribute_exists(sk)',
    ReturnValues: 'ALL_OLD',
  });
  const { Attributes } = await getDocumentClient().send(command);
  return Attributes || null;
};

export { listEventsByWeek, listAllEvents, createEvent, updateEvent, deleteEvent };
