import { api } from "../api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const useUpdateUserAvatar = (userId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (formData: FormData) => api.put(`/users/avatar`, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userById", userId] });
    },
  });

  return {
    updateUserAvatar: mutation.mutate,
    isLoading: mutation.isPending,
  };
};
