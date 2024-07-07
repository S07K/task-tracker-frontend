import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_USER_API_URL;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    // Add your login logic here
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      p={4}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <VStack
        spacing={4}
        width={"100%"}
        style={{
          borderRadius: "12px",
          boxShadow: "0px 0px 14px 2px #9595954a",
        }}
      >
        <Box
          width={"100%"}
          backgroundColor={"#1E1E1E"}
          //   textAlign={"center"}
          style={{
            color: "var(--lightPrimayBGColor)",
            fontFamily: "Montserrat SemiBold",
            fontSize: "24px",
            borderRadius: "12px 12px 0 0",
            padding: "20px",
          }}
        >
          Task Tracker
        </Box>
        <Box
          width={"100%"}
          fontSize="xl"
          fontWeight="bold"
          style={{
            padding: "0 20px 20px 20px",
          }}
        >
          <Box fontSize="xl" fontWeight="bold" pt={4} pb={4}>
            Login
          </Box>
          <FormControl id="email" pb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" pb={4}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
          <Box pb={4}>
            <Button colorScheme="blue" onClick={handleLogin}>
              Login
            </Button>
            <Box mt={2} _hover={{ color: "#66aae3" }} width={"fit-content"}>
              <Link
                to="/register"
                style={{
                  fontSize: "16px",
                }}
              >
                Don't have an account?
              </Link>
            </Box>
            <Box mt={2} _hover={{ color: "#66aae3" }} width={"fit-content"}>
              <Link
                to="/forgot-password"
                style={{
                  fontSize: "16px",
                }}
              >
                Forgot Password?
              </Link>
            </Box>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default Login;
