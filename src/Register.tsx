import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { GrFormNextLink } from "react-icons/gr";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormHelperText,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import axios, { all } from "axios";
axios.defaults.baseURL = import.meta.env.VITE_USER_API_URL;

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  // const allState = {name, email, password, confirmPassword};

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showError = ({ name, email, password, confirmPassword }: any) => {
    if (!name) {
      setNameError("Name is required");
    } else {
      setNameError("");
    }

    if (!email) {
      setEmailError("Email is required");
    } else if (!validateEmail(email)) {
      setEmailError("Email is Invalid");
    } else {
      setEmailError("");
    }

    if (!password) {
      setPasswordError("Password is required");
    } else {
      setPasswordError("");
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Reenter password");
    } else {
      setConfirmPasswordError("");
    }

    if (password != confirmPassword || !confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleRegister = async () => {
    // Handle user registration logic here
    setIsLoading(true);
    showError({ name, email, password, confirmPassword });
    if (!name || !email || !password || !confirmPassword || !validateEmail(email) || (password != confirmPassword || !confirmPassword)) {
      setIsLoading(false);
    } else {
      const res: any = await axios.post("/registerUser", {
        name,
        email,
        password,
      });
      if(res.data && res.data.error) {
        toast.error(res.data.error.message);
        setIsLoading(false);
        return;
      } else if (res.data && res.data.message) {
        toast.success(
          res.data.message
        );
        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");
        setIsLoading(false);
        setIsRegistered(true);
      }
    }
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
      <Toaster />
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
          {isRegistered && (
            <Box pb={4}>
              <Box pt={4} _hover={{ color: "#66aae3" }} width={"fit-content"}>
                <Link
                  to="/login"
                  style={{
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  Go to Login <GrFormNextLink />
                </Link>
              </Box>
            </Box>
          )}
          {!isRegistered && (
            <>
              <Box fontSize="xl" fontWeight="bold" pt={4} pb={4}>
                Register
              </Box>
              <FormControl id="name" pb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  required
                  type="name"
                  value={name}
                  onChange={(e) => {
                    // showError({
                    //   ...allState,
                    //   name: e.target.value
                    // });
                    setName(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRegister();
                  }}
                />
                {nameError && (
                  <FormHelperText style={{ color: "#e54e4e" }}>
                    {nameError}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl id="email" pb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => {
                    // showError({
                    //   ...allState,
                    //   email: e.target.value
                    // });
                    setEmail(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRegister();
                  }}
                />
                {emailError && (
                  <FormHelperText style={{ color: "#e54e4e" }}>
                    {emailError}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl id="password" pb={4}>
                <FormLabel>Password</FormLabel>
                <Input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => {
                    // showError({
                    //   ...allState,
                    //   password: e.target.value
                    // });
                    setPassword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRegister();
                  }}
                />
                {passwordError && (
                  <FormHelperText style={{ color: "#e54e4e" }}>
                    {passwordError}
                  </FormHelperText>
                )}
              </FormControl>
              <FormControl id="confirmPassword" pb={4}>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  required
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    // showError({
                    //   ...allState,
                    //   confirmPassword: e.target.value
                    // });
                    setConfirmPassword(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRegister();
                  }}
                />
                {confirmPasswordError && (
                  <FormHelperText style={{ color: "#e54e4e" }}>
                    {confirmPasswordError}
                  </FormHelperText>
                )}
              </FormControl>
              <Box pb={4}>
                <Button
                  colorScheme="blue"
                  onClick={handleRegister}
                  isLoading={isLoading}
                >
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
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default Register;
