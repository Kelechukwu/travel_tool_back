/* eslint no-unused-vars: 0 */
/* MODULE MOCKS */

export const mockRouterMiddleware = () => (
  jest.doMock('../../../../middlewares')
);

export const mockApprovals = () => jest.doMock('../../approvals', () => ({
  __esModule: true,
  default: {
    getUserApprovals: jest.fn((req, res, next) => res.send({})),
    updateRequestStatus: jest.fn((req, res, next) => res.send({})),
  }
}));
