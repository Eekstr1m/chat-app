import { useLogout } from "../../hooks/useLogout";
import { Spinner } from "@chakra-ui/react";
import { CiLogout } from "react-icons/ci";

export default function LogOut() {
  const { logout, isLoading } = useLogout();
  return (
    <>
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <CiLogout onClick={() => logout()} cursor={"pointer"} size={"2rem"} />
      )}
    </>
  );
}
