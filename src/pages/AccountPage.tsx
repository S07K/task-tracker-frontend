import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Skeleton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { LuLogOut, LuUser } from "react-icons/lu";
import PageHeader from "../components/dashboard/PageHeader";
import { useDashboard } from "../components/dashboard/context";
import { usersApi } from "../lib/api";
import { logOut } from "../redux/eventActions";

const MIN_PASSWORD_LENGTH = 8;

interface SettingsCardProps {
  title: string;
  description: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  as?: React.ElementType;
  onSubmit?: (e: React.FormEvent) => void;
}

/** cal.com-style settings section: bordered card with a header and a gray action footer. */
const SettingsCard: React.FC<SettingsCardProps> = ({ title, description, footer, children, as, onSubmit }) => (
  <Box
    as={as}
    onSubmit={onSubmit}
    noValidate={as === "form" ? true : undefined}
    border="1px solid"
    borderColor="gray.200"
    borderRadius="xl"
    overflow="hidden"
    bg="white"
  >
    <Box px={{ base: 4, sm: 6 }} pt={5} pb={1}>
      <Text fontWeight={600}>{title}</Text>
      <Text fontSize="sm" color="gray.500" mt={0.5}>
        {description}
      </Text>
    </Box>
    <Box px={{ base: 4, sm: 6 }} py={5}>
      {children}
    </Box>
    {footer && (
      <Flex
        justify="flex-end"
        align="center"
        gap={3}
        px={{ base: 4, sm: 6 }}
        py={3}
        bg="gray.50"
        borderTop="1px solid"
        borderColor="gray.200"
      >
        {footer}
      </Flex>
    )}
  </Box>
);

const errorMessage = (error: any, fallback: string) =>
  error?.response?.data?.error?.message || error?.message || fallback;

const ProfileSection: React.FC = () => {
  const { account, setAccount } = useDashboard();
  const toast = useToast();
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (account) setName(account.name);
  }, [account]);

  const trimmed = name.trim();
  const nameError = !trimmed ? "Name is required" : trimmed.length > 100 ? "Name must be 100 characters or fewer" : "";
  const isDirty = Boolean(account) && trimmed !== account?.name;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (nameError || !isDirty) return;
    setIsSaving(true);
    try {
      const res: any = await usersApi.patch("/me", { name: trimmed });
      if (!res.data?.user) throw new Error(res.data?.error?.message || "Something went wrong");
      setAccount(res.data.user);
      setSubmitted(false);
      toast({ status: "success", title: "Profile updated", duration: 2500 });
    } catch (error: any) {
      toast({ status: "error", title: "Couldn't update profile", description: errorMessage(error, "Please try again") });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsCard
      as="form"
      onSubmit={handleSave}
      title="Profile"
      description="Manage how your name appears across Task Tracker."
      footer={
        <Button type="submit" variant="primary" isLoading={isSaving} isDisabled={!isDirty}>
          Save changes
        </Button>
      }
    >
      {!account ? (
        <Stack spacing={4}>
          <Skeleton h="56px" w="56px" borderRadius="full" startColor="gray.100" endColor="gray.200" />
          <Skeleton h="36px" borderRadius="md" startColor="gray.100" endColor="gray.200" />
          <Skeleton h="36px" borderRadius="md" startColor="gray.100" endColor="gray.200" />
        </Stack>
      ) : (
        <Stack spacing={5}>
          <HStack spacing={4}>
            <Avatar size="lg" bg="gray.900" color="white" name={trimmed || account.name} icon={<LuUser />} />
            <Box minW={0}>
              <Text fontWeight={600} noOfLines={1}>
                {trimmed || account.name}
              </Text>
              <Text fontSize="sm" color="gray.500" noOfLines={1}>
                {account.email}
              </Text>
            </Box>
          </HStack>
          <FormControl isInvalid={submitted && Boolean(nameError)}>
            <FormLabel>Full name</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxW={{ md: "420px" }} />
            <FormErrorMessage fontSize="xs">{nameError}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input value={account.email} isReadOnly bg="gray.50" color="gray.600" maxW={{ md: "420px" }} />
            <FormHelperText fontSize="xs" color="gray.500">
              Your email is used to sign in and can't be changed here.
            </FormHelperText>
          </FormControl>
        </Stack>
      )}
    </SettingsCard>
  );
};

const PasswordSection: React.FC = () => {
  const toast = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const errors = {
    current: !currentPassword ? "Enter your current password" : "",
    next: !newPassword
      ? "Enter a new password"
      : newPassword.length < MIN_PASSWORD_LENGTH
        ? `Use at least ${MIN_PASSWORD_LENGTH} characters`
        : newPassword === currentPassword
          ? "New password must be different from the current one"
          : "",
    confirm: confirmPassword !== newPassword ? "Passwords do not match" : "",
  };
  const hasErrors = Object.values(errors).some(Boolean);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) return;
    setIsSaving(true);
    try {
      const res: any = await usersApi.patch("/me/password", { currentPassword, newPassword });
      if (res.data?.error) throw new Error(res.data.error.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSubmitted(false);
      toast({ status: "success", title: "Password updated", duration: 2500 });
    } catch (error: any) {
      toast({ status: "error", title: "Couldn't update password", description: errorMessage(error, "Please try again") });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SettingsCard
      as="form"
      onSubmit={handleSave}
      title="Password"
      description="Change the password you use to sign in."
      footer={
        <Button type="submit" variant="primary" isLoading={isSaving}>
          Update password
        </Button>
      }
    >
      <Stack spacing={4} maxW={{ md: "420px" }}>
        <FormControl isInvalid={submitted && Boolean(errors.current)}>
          <FormLabel>Current password</FormLabel>
          <Input
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <FormErrorMessage fontSize="xs">{errors.current}</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={submitted && Boolean(errors.next)}>
          <FormLabel>New password</FormLabel>
          <Input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {submitted && errors.next ? (
            <FormErrorMessage fontSize="xs">{errors.next}</FormErrorMessage>
          ) : (
            <FormHelperText fontSize="xs" color="gray.500">
              At least {MIN_PASSWORD_LENGTH} characters.
            </FormHelperText>
          )}
        </FormControl>
        <FormControl isInvalid={submitted && Boolean(errors.confirm)}>
          <FormLabel>Confirm new password</FormLabel>
          <Input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <FormErrorMessage fontSize="xs">{errors.confirm}</FormErrorMessage>
        </FormControl>
      </Stack>
    </SettingsCard>
  );
};

const AccountPage: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <Box maxW="760px">
      <PageHeader title="Account" subtitle="Manage your profile and sign-in settings." />
      <Stack spacing={6}>
        <ProfileSection />
        <PasswordSection />
        <SettingsCard title="Session" description="Sign out of Task Tracker on this device.">
          <Button variant="destructive" leftIcon={<LuLogOut />} onClick={() => dispatch(logOut())}>
            Log out
          </Button>
        </SettingsCard>
      </Stack>
    </Box>
  );
};

export default AccountPage;
