import express from 'express';
import middleware from '../../middlewares';
import validators from '../../helpers/validators';
import RequestsController from './RequestsController';
import ApprovalsController from './approvals';

const RequestsRouter = express.Router();

const { authenticate, Validator } = middleware;

RequestsRouter.get(
  '/requests',
  authenticate,
  validators,
  Validator.validateGetRequests,
  RequestsController.getUserRequests,
);

RequestsRouter.post(
  '/requests',
  authenticate,
  Validator.validateCreateRequests, // check req.body
  RequestsController.createRequest,
);

RequestsRouter.get(
  '/requests/my-approvals',
  authenticate,
  ApprovalsController.getUserApprovals,
);

export default RequestsRouter;
