import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import Logo from "./Logo";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
}

/** Centered card layout used by the login and sign-up pages. */
const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, footer, children }) => (
  <Flex minH="100vh" bg="gray.50" direction="column" align="center" justify="center" px={4} py={12}>
    <Box mb={8}>
      <Logo />
    </Box>
    <Box textAlign="center" mb={6}>
      <Heading as="h1" fontSize="2xl" fontWeight={700}>
        {title}
      </Heading>
      {subtitle && (
        <Text color="gray.500" fontSize="sm" mt={1.5}>
          {subtitle}
        </Text>
      )}
    </Box>
    <Box
      w="full"
      maxW="420px"
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="xl"
      boxShadow="sm"
      p={{ base: 6, sm: 8 }}
    >
      {children}
    </Box>
    {footer && (
      <Box mt={6} fontSize="sm" color="gray.600">
        {footer}
      </Box>
    )}
  </Flex>
);

export default AuthLayout;
