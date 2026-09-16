import { useEffect, useState } from "react";
import { getUserById, patchUserById, UserResponse } from "../../api/user";

export const useEditUserData = (
  userId: string,
  onSuccess: () => Promise<void>,
  onClose: () => void
) => {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [formData, setFormData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getUserById(userId);
        setUser(data);

        setFormData({
          name: data.name,
          surname: data.surname,
          username: data.username,
          email: data.email,
          phone_number: data.phone_number || "",
          group_id: (data as any).group_id ?? null,
          is_blocked: data.is_blocked,
          roles_id: (data.roles || []).map((r: any) => r.id),
        });
      } catch {
        setError("Failed to load user");
      }
    };

    load();
  }, [userId]);

  const toggleRole = (roleId: number) => {
    setFormData((prev: any) => {
      const hasRole = prev.roles_id.includes(roleId);
      const newRoles = hasRole
        ? prev.roles_id.filter((id: number) => id !== roleId)
        : [...prev.roles_id, roleId];

      return { ...prev, roles_id: newRoles };
    });
  };

  const submit = async () => {
    if (!user || !formData) return;

    setSaving(true);
    setError(null);

    const changed: any = {};
    const keys = [
      "name",
      "surname",
      "username",
      "email",
      "phone_number",
      "group_id",
      "is_blocked",
    ];

    keys.forEach((key) => {
      if (formData[key] !== (user as any)[key]) {
        changed[key] = formData[key];
      }
    });

    const originalRoles = (user.roles || []).map((r: any) => r.id);
    if (JSON.stringify(originalRoles) !== JSON.stringify(formData.roles_id)) {
      changed.roles_id = formData.roles_id;
    }

    if (Object.keys(changed).length === 0) {
      setSaving(false);
      onClose();
      return;
    }

    try {
      await patchUserById(user.id, changed);
      await onSuccess();
      onClose();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : detail?.msg || "Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return { user, formData, setFormData, toggleRole, submit, saving, error };
};
