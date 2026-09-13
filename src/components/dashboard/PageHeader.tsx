import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => (
  <Flex
    align={{ base: "flex-start", sm: "center" }}
    justify="space-between"
    direction={{ base: "column", sm: "row" }}
    gap={4}
    mb={8}
  >
    <Box>
      <Heading as="h1" fontSize="xl">
        {title}
      </Heading>
      {subtitle && (
        <Text fontSize="sm" color="gray.500" mt={1}>
          {subtitle}
        </Text>
      )}
    </Box>
    {actions && <Flex gap={2}>{actions}</Flex>}
  </Flex>
);

export default PageHeader;
