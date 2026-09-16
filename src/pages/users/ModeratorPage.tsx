import { UsersPage } from "./UsersPage";
import '../../styles/users/UsersPage.scss';
import '../../styles/users/UserInfoModal.scss';

export const ModeratorPage = () => (
  <UsersPage role="MODERATOR" title="Group Users (Moderator View)" showEdit={false}/>
);