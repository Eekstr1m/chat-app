import { api } from "../api/api";
import { toaster } from "../components/ui/toaster";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useDeleteMessage = (messageId: string) => {
  const mutation = useMutation({
    // mutationKey: ["deleteMessage", receiverId],
    mutationFn: async () => {
      const response = await api.delete("/messages/delete/" + messageId);
      return response.data;
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toaster.create({
        description: error.response?.data?.error || "An error occurred",
        type: "error",
      });
    },
  });

  return {
    deleteMessage: mutation.mutate,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};
