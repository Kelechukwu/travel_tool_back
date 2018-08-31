const mockAuthenticate = (req, res, next) => {
  const user = { UserInfo: { id: '-LJV4b1QTCYewOtk5F63' } };
  req.user = user;
  next();
};

const middleware = {
  authenticate: jest.fn(mockAuthenticate),
  Validator: {
    validateGetRequests: jest.fn(),
    validateCreateRequests: jest.fn(),
    validateUser: jest.fn(),
    validateAddRole: jest.fn(),
    validateUserRole: jest.fn(),
    checkEmail: jest.fn()
  }
};

export default middleware;
