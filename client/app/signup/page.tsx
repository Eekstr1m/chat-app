"use client";
import AuthForm from "@/components/AuthForm/AuthForm";
import { useAuthContext } from "@/context/AuthContext";
import { handleAuthRedirect } from "@/utils/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Center, Spinner } from "@chakra-ui/react";
import { GridItem } from "@chakra-ui/react";

export default function Page() {
  const { authUser, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    handleAuthRedirect(authUser, router);
  }, [authUser, router]);

  return (
    <>
      {loading ? (
        <GridItem area="main">
          <Center h="100vh">
            <Spinner size="xl" />
          </Center>
        </GridItem>
      ) : (
        <AuthForm
          type="Signup"
          fields={[
            "firstName",
            "lastName",
            "userName",
            "email",
            "password",
            // "confirmPassword",
          ]}
        />
      )}
    </>
  );
}
