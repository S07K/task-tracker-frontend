import React, { useState } from "react";
import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Link as ChakraLink,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { LuArrowRight, LuCheck } from "react-icons/lu";
import { usersApi } from "./lib/api";
import AuthLayout from "./components/AuthLayout";

const validateEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [registeredMessage, setRegisteredMessage] = useState("");
  const toast = useToast();

  const handleRegister = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!name) nextErrors.name = "Name is required";
    if (!email) nextErrors.email = "Email is required";
    else if (!validateEmail(email)) nextErrors.email = "Email is invalid";
    if (!password) nextErrors.password = "Password is required";
    if (!confirmPassword || password !== confirmPassword) nextErrors.confirmPassword = "Passwords do not match";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setIsLoading(true);
    try {
      const res: any = await usersApi.post("/registerUser", { name, email, password });
      if (res.data?.error) {
        toast({ status: "error", title: res.data.error.message });
      } else if (res.data?.message) {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setRegisteredMessage(res.data.message);
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

  if (registeredMessage) {
    return (
      <AuthLayout title="Check your inbox" subtitle="One more step before you get started">
        <Flex direction="column" align="center" textAlign="center">
          <Flex boxSize={12} borderRadius="full" bg="green.50" color="green.600" align="center" justify="center" mb={4}>
            <Icon as={LuCheck} boxSize={6} />
          </Flex>
          <Text fontSize="sm" color="gray.600" mb={6}>
            {registeredMessage}
          </Text>
          <Button as={Link} to="/login" variant="primary" w="full" rightIcon={<LuArrowRight />}>
            Go to sign in
          </Button>
        </Flex>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Free forever. No credit card required."
      footer={
        <>
          Already have an account?{" "}
          <ChakraLink as={Link} to="/login" fontWeight={600} color="gray.900">
            Sign in
          </ChakraLink>
        </>
      }
    >
      <form onSubmit={handleRegister} noValidate>
        <Stack spacing={4}>
          <FormControl isInvalid={Boolean(errors.name)}>
            <FormLabel>Full name</FormLabel>
            <Input placeholder="John Doe" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            <FormErrorMessage fontSize="xs">{errors.name}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.email)}>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              placeholder="john.doe@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormErrorMessage fontSize="xs">{errors.email}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.password)}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormErrorMessage fontSize="xs">{errors.password}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={Boolean(errors.confirmPassword)}>
            <FormLabel>Confirm password</FormLabel>
            <Input
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FormErrorMessage fontSize="xs">{errors.confirmPassword}</FormErrorMessage>
          </FormControl>
          <Button type="submit" variant="primary" w="full" isLoading={isLoading}>
            Create account
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
};

export default Register;
