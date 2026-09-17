import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUserById,
  patchUserById,
  UserResponse,
  UserPatchByAdmin,
} from "../../api/user";
import { useState, useEffect } from "react";

interface EditFormData {
  name: string;
  surname: string;
  username: string;
  email: string;
  phone_number: string;
  group_id: number | undefined; // FIX: API does not accept null
  is_blocked: boolean;
  roles_id: number[];
}

export const useEditUserData = (userId: string, onClose: () => void) => {
  const queryClient = useQueryClient();

  // 1) Load user
  const { data: user, isLoading } = useQuery<UserResponse>({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });

  // 2) Local form state
  const [formData, setFormData] = useState<EditFormData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 3) Fill form when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        surname: user.surname,
        username: user.username,
        email: user.email,
        phone_number: user.phone_number || "",
        group_id: (user as any).group_id ?? undefined,
        is_blocked: user.is_blocked,
        roles_id: (user.roles || []).map((r) => r.id),
      });
    }
  }, [user]);

  // 4) Mutation
  const mutation = useMutation({
    mutationFn: (changedFields: UserPatchByAdmin) =>
      patchUserById(userId, changedFields),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      onClose();
    },

    onError: (err: any) => {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === "string"
          ? detail
          : detail?.msg || "Failed to update user"
      );
    },
  });

  // 5) Toggle role
  const toggleRole = (roleId: number) => {
    setFormData((prev) => {
      if (!prev) return prev;

      const hasRole = prev.roles_id.includes(roleId);
      const newRoles = hasRole
        ? prev.roles_id.filter((id) => id !== roleId)
        : [...prev.roles_id, roleId];

      return { ...prev, roles_id: newRoles };
    });
  };

  // 6) Submit
  const submit = () => {
    if (!user || !formData) return;

    const changed: UserPatchByAdmin = {};

    // Compare each field individually — safest & strictest typing
    if (formData.name !== user.name) changed.name = formData.name;
    if (formData.surname !== user.surname) changed.surname = formData.surname;
    if (formData.username !== user.username) changed.username = formData.username;
    if (formData.email !== user.email) changed.email = formData.email;
    if (formData.phone_number !== user.phone_number)
      changed.phone_number = formData.phone_number;

    const oldGroup = (user as any).group_id ?? undefined;
    if (formData.group_id !== oldGroup)
      changed.group_id = formData.group_id ?? undefined;

    if (formData.is_blocked !== user.is_blocked)
      changed.is_blocked = formData.is_blocked;

    const originalRoles = (user.roles || []).map((r) => r.id);
    if (JSON.stringify(originalRoles) !== JSON.stringify(formData.roles_id)) {
      changed.roles_id = formData.roles_id;
    }

    // Nothing changed → close modal
    if (Object.keys(changed).length === 0) {
      onClose();
      return;
    }

    mutation.mutate(changed);
  };

  return {
    user,
    isLoading,
    formData,
    setFormData,
    toggleRole,
    submit,
    saving: mutation.isPending,
    error,
  };
};
