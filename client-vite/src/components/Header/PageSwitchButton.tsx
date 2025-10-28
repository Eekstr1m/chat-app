import { Box } from "@chakra-ui/react";
import { FiMessageCircle } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { useLocation } from "react-router";

export default function PageSwitchButton() {
  const location = useLocation();

  if (location.pathname.startsWith("/profile")) {
    return <NavigateToMessages />;
  }

  if (location.pathname.startsWith("/messages")) {
    return <NavigateToProfile />;
  }

  // return (
  //   <>
  //     <NavigateToMessages />
  //     <NavigateToProfile />
  //   </>
  // );
}

const NavigateToMessages = () => {
  const navigate = useNavigate();

  return (
    <Box
      _hover={{ transform: "scale(1.2)", transition: "all 0.2s linear" }}
      onClick={() => navigate("/messages")}
    >
      <FiMessageCircle cursor={"pointer"} size={"2rem"} />
    </Box>
  );
};

const NavigateToProfile = () => {
  const navigate = useNavigate();
  return (
    <Box
      _hover={{ transform: "scale(1.2)", transition: "all 0.2s linear" }}
      onClick={() => navigate("/profile")}
    >
      <IoPersonOutline cursor={"pointer"} size={"2rem"} />
    </Box>
  );
};
