import { UsersPage } from "./UsersPage";
import '../../styles/user/UsersPage.scss';
import '../../styles/user/UserInfoModal.scss';

export const ModeratorPage = () => (
  <UsersPage role="MODERATOR" title="Group Users (Moderator View)" showEdit={false}/>
);