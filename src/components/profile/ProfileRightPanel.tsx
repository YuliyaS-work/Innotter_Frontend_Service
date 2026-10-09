import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button_profile';
import { CreatePageModal } from '../page/CreatePageModal';
import { PageResponse } from '../../api/content';
import '../../styles/common/RightPanel.scss';

interface ProfileRightPanelProps {
  myPages?: PageResponse[];
  onPageCreated?: (newPage: PageResponse) => void;
}

export const ProfileRightPanel: React.FC<ProfileRightPanelProps> = ({
  myPages = [],
  onPageCreated,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSuccess = (newPage: PageResponse) => {
    setIsCreateModalOpen(false);
    if (onPageCreated) {
      onPageCreated(newPage);
    } else {
      navigate(`/page/${newPage.id}`);
    }
  };

  return (
    <>
      <Button
        bgColor="#ff6b00"
        fullWidth
        onClick={() => setIsCreateModalOpen(true)}
      >
        Create Page
      </Button>

      <div style={{ marginTop: '30px' }}>
        <h2 className="right-panel-title">My Pages</h2>
        {myPages.length > 0 ? (
          <ul className="pages-list">
            {myPages.map((page) => (
              <li
                key={page.id}
                className="page-item"
                onClick={() => navigate(`/page/${page.id}`)}
              >
                <span className="page-name">{page.name}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="right-panel-text">No pages created yet.</p>
        )}
      </div>

      {isCreateModalOpen && (
        <CreatePageModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
};