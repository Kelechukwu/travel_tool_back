import models from '../../database/models';

const { Op } = models.Sequelize;
const { sequelize } = models;

export function createSubquery(req, limit, offset, modelName) {
  const { status } = req.query;
  const userId = req.user.UserInfo.id;

  let userIdColName = 'userId';
  if (modelName === 'Approval') userIdColName = 'approverId';

  let subQuery = {
    where: { [userIdColName]: userId },
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  };
  if (!status) return subQuery;

  let queryLogic;
  if (status === 'past') queryLogic = { [Op.ne]: 'Open' };
  else queryLogic = { [Op.iLike]: status };

  // construct status subquery
  const statusWhereQuery = sequelize.where(
    sequelize.cast(sequelize.col(`${modelName}.status`), 'varchar'),
    queryLogic
  );

  // join the queries
  subQuery = {
    ...subQuery,
    where: sequelize.and(subQuery.where, statusWhereQuery)
  };
  return subQuery;
}


export const countByStatus = async (model, userId) => {
  let userIdColName = 'userId';
  if (model.name === 'Approval') userIdColName = 'approverId';

  const openRecords = await model.count({
    where: {
      status: 'Open',
      [userIdColName]: userId,
    },
  });

  const pastRecords = await model.count({
    where: {
      status: { [Op.ne]: 'Open' },
      [userIdColName]: userId,
    },
  });

  const count = {
    open: openRecords,
    past: pastRecords,
  };

  return count;
};
