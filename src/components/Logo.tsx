import React from "react";
import { Box, HStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

interface LogoProps {
  to?: string;
  size?: "sm" | "md";
}

export const LogoMark: React.FC<{ boxSize?: number }> = ({ boxSize = 7 }) => (
  <Box
    boxSize={boxSize}
    bg="gray.900"
    borderRadius="md"
    display="flex"
    alignItems="center"
    justifyContent="center"
    flexShrink={0}
  >
    <svg width="60%" height="60%" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.5 8.5l3 3 6-7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Box>
);

const Logo: React.FC<LogoProps> = ({ to = "/", size = "md" }) => (
  <Link to={to}>
    <HStack spacing={2}>
      <LogoMark boxSize={size === "sm" ? 6 : 7} />
      <Text
        fontWeight={700}
        fontSize={size === "sm" ? "md" : "lg"}
        letterSpacing="-0.03em"
        color="gray.900"
      >
        Task Tracker
      </Text>
    </HStack>
  </Link>
);

export default Logo;
