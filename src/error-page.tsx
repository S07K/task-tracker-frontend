import { useEffect } from "react";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./components/Logo";

export default function ErrorPage() {
  const navigate = useNavigate();

  // Redirect after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home", { replace: true });
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Flex minH="100vh" direction="column" align="center" justify="center" bg="gray.50" px={4} textAlign="center">
      <Logo />
      <Text mt={12} fontSize="sm" fontWeight={600} color="gray.500" letterSpacing="0.08em">
        404 ERROR
      </Text>
      <Heading as="h1" fontSize={{ base: "3xl", md: "4xl" }} mt={2} fontWeight={700}>
        This page does not exist.
      </Heading>
      <Text color="gray.500" mt={3} maxW="md">
        The page you're looking for couldn't be found. Redirecting you in a few seconds…
      </Text>
      <Button as={Link} to="/home" variant="primary" mt={8}>
        Take me home
      </Button>
    </Flex>
  );
}
