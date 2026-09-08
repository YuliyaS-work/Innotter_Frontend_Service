import React from 'react';
import { ICONS } from '../../constants/icons';
import { Button } from '.././user/Button';

export const RightPanel: React.FC = () => {
  return (
    <aside style={{ width: '20%', padding: '40px 0 0 40px', backgroundColor: '#333', borderLeft: '1px solid #eee', minHeight: '100vh', boxSizing: 'border-box' }}>
      {/* Create page button */}
      <Button 
        bgColor="#ff6b00" 
        fullWidth 
        onClick={() => alert('Create Page modal')}
      >
        Create Page
      </Button>

      {/* page list */}
      <div style={{ marginTop: '30px' }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#fff' }}>My Pages</h2>
        <p style={{ color: '#fff', fontSize: '20px' }}>No pages created yet.</p>
      </div>
    </aside>
  );
};