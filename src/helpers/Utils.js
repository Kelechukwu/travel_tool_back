import shortid from 'shortid';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class Utils {
  static generateUniqueId() {
    return shortid.generate();
  }

  static generateTestToken(payload) {
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY_TEST.replace(/\\n/g, '\n'),
      { algorithm: 'RS256' },
    );
    return token;
  }
}

export default Utils;
