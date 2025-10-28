import { useLogout } from "../../hooks/useLogout";
import { Button, Dialog, Portal, Spinner } from "@chakra-ui/react";
import { FiLogOut } from "react-icons/fi";

export default function LogOut() {
  const { logout, isLoading } = useLogout();

  return (
    <>
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <Dialog.Root placement={"center"}>
          <Dialog.Trigger
            _hover={{ transform: "scale(1.2)", transition: "all 0.2s linear" }}
            asChild
          >
            <FiLogOut cursor={"pointer"} size={"2rem"} />
          </Dialog.Trigger>
          <Portal>
            <Dialog.Backdrop />
            <Dialog.Positioner>
              <Dialog.Content className="glassmorphismChat" maxW="400px">
                <Dialog.Header>
                  <Dialog.Title>Are you sure you want to log out?</Dialog.Title>
                </Dialog.Header>
                <Dialog.Body>
                  <p>You will need to log in again to access your account.</p>
                </Dialog.Body>
                <Dialog.Footer>
                  <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                  </Dialog.ActionTrigger>
                  <Button colorPalette="red" onClick={() => logout()}>
                    Log Out
                  </Button>
                </Dialog.Footer>
              </Dialog.Content>
            </Dialog.Positioner>
          </Portal>
        </Dialog.Root>
      )}
    </>
  );
}
