import Header from "@/components/Header/Header";
import { Box, Center, Grid, GridItem } from "@chakra-ui/react";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box mx={{ sm: 4 }} py={10}>
      <Center>
        <Grid
          width={"1200px"}
          minHeight={"fit-content"}
          height={"calc(100vh - 80px)"}
          templateRows="fit-content(0px) minmax(500px, auto)"
          templateColumns="30% auto"
          templateAreas={`"header header" "sidebar main"`}
          gap={4}
          p={4}
          className="glassmorphism"
        >
          <GridItem area="header" colSpan={2}>
            <Header />
          </GridItem>

          {children}
        </Grid>
      </Center>
    </Box>
  );
}
