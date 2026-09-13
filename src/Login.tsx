import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link as ChakraLink,
  Stack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken, setUser } from "./redux/eventActions";
import { usersApi } from "./lib/api";
import AuthLayout from "./components/AuthLayout";

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const toast = useToast();

  const handleLogin = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const nextEmailError = !email ? "Email is required" : !validateEmail(email) ? "Email is invalid" : "";
    const nextPasswordError = !password ? "Password is required" : "";
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (nextEmailError || nextPasswordError) return;

    setIsLoading(true);
    try {
      const res: any = await usersApi.post("/login", { email, password });
      if (res.data?.token) {
        const { token, userId } = res.data;
        dispatch(setToken(token));
        dispatch(setUser(userId));
        toast({ status: "success", title: "Welcome back!", duration: 2000 });
      } else if (res.data?.error) {
        toast({ status: "error", title: res.data.error.message });
      } else {
        toast({ status: "error", title: "Something went wrong, please try again later" });
      }
    } catch (error: any) {
      toast({
        status: "error",
        title: error?.response?.data?.error?.message || "Something went wrong, please try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your schedule"
      footer={
        <>
          Don't have an account?{" "}
          <ChakraLink as={Link} to="/register" fontWeight={600} color="gray.900">
            Sign up
          </ChakraLink>
        </>
      }
    >
      <form onSubmit={handleLogin} noValidate>
        <Stack spacing={4}>
          <FormControl isInvalid={Boolean(emailError)}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="john.doe@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormErrorMessage fontSize="xs">{emailError}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(passwordError)}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormErrorMessage fontSize="xs">{passwordError}</FormErrorMessage>
          </FormControl>
          <ChakraLink
            as={Link}
            to="/forgot-password"
            fontSize="sm"
            color="gray.600"
            alignSelf="flex-end"
            mt={-1}
          >
            Forgot password?
          </ChakraLink>
          <Button type="submit" variant="primary" w="full" isLoading={isLoading}>
            Sign in
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default Login;
