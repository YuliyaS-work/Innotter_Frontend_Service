import { UsersPage } from "./UsersPage";
import '../../styles/user/UsersPage.scss';
import '../../styles/user/UserInfoModal.scss';
import '../../styles/user/EditUserModal.scss';

export const AdminPage = () => (
  <UsersPage role="ADMIN" title="Users List (Admin View)" showEdit={true}/>
);