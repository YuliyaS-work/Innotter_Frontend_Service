import React from "react";

export const EditUserForm = ({
  formData,
  setFormData,
  toggleRole,
  submit,
  saving,
  error,
  onClose,
}: any) => {
  return (
    <>
      <h3 className="edit-modal-title">Edit User (Admin)</h3>

      {error && <div className="edit-modal-error">{error}</div>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="edit-modal-form-two-columns"
      >
        {/* LEFT COLUMN */}
        <div className="edit-column">
          <div className="edit-field">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="edit-field">
            <label>Surname</label>
            <input
              type="text"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
            />
          </div>

          <div className="edit-field">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="edit-field">
            <label>Mobile number</label>
            <input
              type="text"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="edit-column">
          <div className="edit-field">
            <label>Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div className="edit-field">
            <label>Group ID</label>
            <input
              type="number"
              value={formData.group_id ?? ""}
              onChange={(e) => setFormData({ ...formData, group_id: Number(e.target.value) })}
            />
          </div>

          <div className="edit-field">
            <label>Status</label>
            <select
              value={formData.is_blocked ? "blocked" : "active"}
              onChange={(e) =>
                setFormData({ ...formData, is_blocked: e.target.value === "blocked" })
              }
            >
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>

          <div className="edit-field">
            <label>Roles</label>
            <div className="roles-checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={formData.roles_id.includes(2)}
                  onChange={() => toggleRole(2)}
                />
                Moderator
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={formData.roles_id.includes(3)}
                  onChange={() => toggleRole(3)}
                />
                Admin
              </label>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="edit-modal-actions-bottom">
          <button type="submit" disabled={saving} className="edit-btn-save">
            {saving ? "Saving..." : "Submit"}
          </button>

          <button type="button" onClick={onClose} className="edit-btn-cancel">
            Cancel
          </button>
        </div>
      </form>
    </>
  );
};
