import { createRemoteJWKSet, jwtVerify } from 'jose';

const getIssuer = (region, poolId) => `https://cognito-idp.${region}.amazonaws.com/${poolId}`;

const getJwks = (issuer) => {
  const url = new URL(`${issuer}/.well-known/jwks.json`);
  return createRemoteJWKSet(url);
};

const getBearerToken = (headers = {}) => {
  const raw = headers.Authorization || headers.authorization;
  if (!raw) return null;
  const [type, value] = raw.split(' ');
  if (type !== 'Bearer' || !value) return null;
  return value;
};

const verifyAccessToken = async (token) => {
  if (!token) {
    const error = new Error('Missing access token');
    error.statusCode = 401;
    throw error;
  }

  const region = process.env.COGNITO_USER_POOL_REGION || process.env.AWS_REGION;
  const poolId = process.env.COGNITO_USER_POOL_ID;
  const clientId = process.env.COGNITO_USER_POOL_CLIENT_ID;

  if (!region || !poolId || !clientId) {
    return { payload: { sub: 'dev-user', bypassed: true }, bypassed: true };
  }

  const issuer = getIssuer(region, poolId);
  const jwks = getJwks(issuer);
  const { payload } = await jwtVerify(token, jwks, { issuer, audience: clientId });
  return { payload };
};

export { getBearerToken, verifyAccessToken };
