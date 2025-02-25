import { api } from "../api/api";
import { useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";

export const useUpdateMessage = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (messageId: string) => api.put(`/messages/read/${messageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  return {
    updateMessage: mutation.mutate,
    isLoading: mutation.isPending,
  };
};
