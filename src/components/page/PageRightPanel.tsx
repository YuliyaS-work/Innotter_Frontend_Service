import React from 'react';
import { PageResponse } from '../../api/content';

import { Button } from '../common/Button_profile';
import { ProfileRightPanel } from '../profile/ProfileRightPanel';

interface PageRightPanelProps {
  currentPage: PageResponse;
  isOwner: boolean;
  myPages?: PageResponse[];
  onAddPostClick: () => void;
  onDeletePageClick?: () => void;
  onPageCreated?: (newPage: PageResponse) => void;
}

export const PageRightPanel: React.FC<PageRightPanelProps> = ({
  isOwner,
  myPages = [],
  onAddPostClick,
  onDeletePageClick,
  onPageCreated,
}) => {
  return (
    <div className="page-right-panel-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Buttons for page management, only for owner */}
      {isOwner && (
        <div className="owner-actions-block" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Button 
            bgColor="#666" 
            fullWidth 
            onClick={onAddPostClick}
          >
            Create Post
          </Button>

          <Button 
            bgColor="#dc3545" 
            fullWidth 
            onClick={onDeletePageClick || (() => console.log('Delete page clicked'))}
          >
            Delete Page
          </Button>
        </div>
      )}

      {/*  'Create Page' and 'My Pages' list */}
      <ProfileRightPanel 
        myPages={myPages} 
        onPageCreated={onPageCreated} 
      />
    </div>
  );
};