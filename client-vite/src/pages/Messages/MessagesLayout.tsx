import { Box, Center, Grid, GridItem } from "@chakra-ui/react";
import Header from "../../components/Header/Header";
import { Outlet, useParams } from "react-router";
import SideBar from "../../components/SideBar/SideBar";
import MessageStart from "../../components/Messages/MessageStart";

export default function MessagesLayout() {
  const { messageReceiver } = useParams();

  return (
    <Box mx={{ sm: 4 }} py={{ md: 10 }}>
      <Center>
        <Grid
          width={{ mdDown: "full", md: "1200px" }}
          height={{ mdDown: "100svh", md: "calc(100vh - 80px)" }}
          minHeight={"fit-content"}
          templateRows="fit-content(0px) minmax(500px, auto)"
          templateColumns={{ md: "30% auto" }}
          templateAreas={{
            mdDown: `"header" "main"`,
            md: `"header header" "sidebar main"`,
          }}
          gap={4}
          p={4}
          className="glassmorphism"
        >
          <GridItem area="header">
            <Header />
          </GridItem>

          <GridItem hideFrom={"md"} area="main">
            {messageReceiver ? (
              <Outlet />
            ) : (
              <SideBar messageReceiver={messageReceiver} />
            )}
          </GridItem>

          <GridItem hideBelow={"md"} area="sidebar">
            <SideBar messageReceiver={messageReceiver} />
          </GridItem>

          <GridItem hideBelow={"md"} area="main">
            {messageReceiver ? <Outlet /> : <MessageStart />}
          </GridItem>
        </Grid>
      </Center>
    </Box>
  );
}
