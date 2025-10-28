import { Center, Grid, GridItem } from "@chakra-ui/react";
import Header from "../../components/Header/Header";
import { useAuthContext } from "../../context/AuthContext";
import { CustomSpinner } from "../../components/Spinner/Spinner";
import { Navigate, Outlet, useParams } from "react-router";

export default function ProfileLayout() {
  const { profileId } = useParams();

  const { authUser } = useAuthContext();
  if (!authUser) {
    return <CustomSpinner />;
  }

  return (
    <Center mx={{ sm: 4 }} py={{ md: 10 }}>
      <Grid
        width={"1200px"}
        minHeight={"fit-content"}
        height={{ mdDown: "100svh", md: "calc(100vh - 80px)" }}
        templateRows="fit-content(0px) minmax(500px, auto)"
        templateAreas={`"header" "main"`}
        gap={4}
        p={4}
        className="glassmorphism"
      >
        <GridItem area="header">
          <Header />
        </GridItem>

        <GridItem area="main">
          {profileId ? (
            <Outlet />
          ) : (
            <Navigate to={`/profile/${authUser.userName}`} />
          )}
        </GridItem>
      </Grid>
    </Center>
  );
}
