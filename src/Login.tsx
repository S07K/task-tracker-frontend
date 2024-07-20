import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormHelperText,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { setToken, setUser } from "./redux/eventActions";
import { useDispatch, useSelector } from "react-redux";
axios.defaults.baseURL = import.meta.env.VITE_USER_API_URL;

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const showError = ({ email, password }: any) => {

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
  };

  const handleLogin = async () => {
    // Add your login logic here
    setIsLoading(true);
    showError({ email, password });
    if (!email || !password || !validateEmail(email)) {
      setIsLoading(false);
    } else {
      const res: any = await axios.post("/login", {
        email,
        password,
      });
      if (res.data && res.data?.token) {
        const { token, userId } = res.data;
        dispatch(setToken(token));
        dispatch(setUser(userId));
        toast.success("Login Successful");
        setIsLoading(false);
      } else if (res.data && res.data.error) {
        toast.error(res.data.error.message);
        setIsLoading(false);
      } else {
        toast.error("Something went wrong, Please try again later");
        setIsLoading(false);
      }
    }
  };

  return (
    <>
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
            //   textAlign={"center"}
            style={{
              color: "var(--lightPrimayBGColor)",
              fontFamily: "Montserrat SemiBold",
              fontSize: "24px",
              borderRadius: "12px 12px 0 0",
              padding: "20px",
            }}
          >
            <Link to={"/"}>Task Tracker</Link>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleLogin();
                }}
              />
              {passwordError && (
                <FormHelperText style={{ color: "#e54e4e" }}>
                  {passwordError}
                </FormHelperText>
              )}
            </FormControl>
            <Box pb={4}>
              <Button
                colorScheme="blue"
                onClick={handleLogin}
                isLoading={isLoading}
              >
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
    </>
  );
};

export default Login;
