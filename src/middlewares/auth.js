import jwt from 'jsonwebtoken';

const setPublicKey = (nodeEnv) => {
  switch (nodeEnv) {
    case 'test':
      return process.env.JWT_PUBLIC_KEY_TEST.replace(/\\n/g, '\n');
    case 'development':
      return Buffer.from(process.env.JWT_PUBLIC_KEY_STAGING, 'base64');
    default:
      break;
  }
};

const authenticate = (req, res, next) => {
  const token = req.headers.authorization
    || req.body.token
    || req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Please provide a token',
    });
  }

  jwt.verify(
    token,
    setPublicKey(process.env.NODE_ENV),
    (error, decodedToken) => {
      if (error) {
        return res.status(401).json({
          success: false,
          error: 'Token is not valid',
        });
      }
      req.user = decodedToken;
      return next();
    },
  );
};

export default authenticate;
