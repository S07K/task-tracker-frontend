import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_USER_API_URL;

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    // Handle user registration logic here
    console.log("Registering user Name:", name);
    console.log("Registering user Email:", email);
    console.log("Registering user Password:", password);
    const res: any = await axios.post("/registerUser", {
      name,
      email,
      password
    });
    console.log("Regiter User Response", res.data);
    // if (res.data && res.data.events) {
    // }
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
            Register
          </Box>
          <FormControl id="name" pb={4}>
            <FormLabel>Name</FormLabel>
            <Input
              type="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </FormControl>
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
            <Button colorScheme="blue" onClick={handleRegister}>
              Register
            </Button>
            <Box pt={4} _hover={{ color: "#66aae3" }} width={"fit-content"}>
              <Link
                to="/login"
                style={{
                  fontSize: "16px",
                }}
              >
                Already a user?
              </Link>
            </Box>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default Register;
