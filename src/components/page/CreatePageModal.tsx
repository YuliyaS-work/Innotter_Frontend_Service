import React, { useState, FormEvent } from 'react';
import { createPage, PageResponse } from '../../api/content';
import { Button } from '../common/Button_profile';
import '../../styles/page/CreatePageModal.scss';

interface CreatePageModalProps {
  onClose: () => void;
  onSuccess: (newPage: PageResponse) => void;
}

export const CreatePageModal: React.FC<CreatePageModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);

      const newPage = await createPage({
        name: name.trim(),
        description: description.trim(),
      });

      onSuccess(newPage);
      onClose();
    } catch (err: any) {
      console.error('Failed to create page:', err);
      setError(err?.response?.data?.detail || 'Failed to create page. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="edit-modal-overlay" onClick={onClose}>
      <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
        <div className="edit-modal-header">
          <h3 className="edit-modal-title">Create New Page</h3>
          <button className="edit-modal-close" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="edit-modal-error">{error}</div>}

        <form className="edit-modal-form" onSubmit={handleSubmit}>
          <div className="edit-field">
            <label>Page Name</label>
            <input
              type="text"
              placeholder="Enter page name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="edit-field">
            <label>Description</label>
            <textarea
              placeholder="Describe your page..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div className="edit-modal-actions">
            <button
              type="button"
              className="edit-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <Button
              bgColor="#ff6b00"
              type="submit"
              disabled={isSubmitting || !name.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Page'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};