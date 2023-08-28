declare type TEResponse = import('express').Response

declare type TRequestUser = import('express').Request<any, any, User>
declare type TRequestCapsule = import('express').Request<any, any, Capsule>

type UsersController = {
  list_users: (req: TRequestUser, res: TEResponse) => void
  login: (req: TRequestUser, res: TEResponse) => void
  create_user: (req: TRequestUser, res: TEResponse) => void
  delete: (req: TRequestUser, res: TEResponse) => void
}

type CapsulesController = {
  create: (req: TRequestCapsule, res: TEResponse) => void
  list_capsules: (req: TRequestCapsule, res: TEResponse) => void
  get_capsule: (req: TRequestCapsule, res: TEResponse) => void
  delete: (req: TRequestCapsule, res: TEResponse) => void
}

type Controllers = {
  users: UsersController
  capsules: CapsulesController
}
