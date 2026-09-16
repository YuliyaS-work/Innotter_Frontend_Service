import { UsersPage } from "./UsersPage";
import '../../styles/users/UsersPage.scss';
import '../../styles/users/UserInfoModal.scss';
import '../../styles/users/EditUserModal.scss';

export const AdminPage = () => (
  <UsersPage role="ADMIN" title="Users List (Admin View)" showEdit={true}/>
);