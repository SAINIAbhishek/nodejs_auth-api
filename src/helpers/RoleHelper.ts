import Role, { RoleModel, RoleNameEnum } from '../models/RoleModel';

const sanitizedRoles = (roles: Role[] = []): Role[] => {
  return roles.map((role) => {
    return {
      _id: role._id,
      name: role.name,
      permissions: role.permissions,
    };
  });
};

const findByName = async (
  name: RoleNameEnum,
  selectFields = ''
): Promise<Role | null> => {
  return await RoleModel.findOne({ name: name })
    .select(selectFields)
    .lean()
    .exec();
};

export default {
  sanitizedRoles,
  findByName,
};
