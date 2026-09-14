import React from "react";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { IconType } from "react-icons";
import { LuCalendarDays, LuListChecks, LuLogOut, LuSettings, LuSparkles, LuUser } from "react-icons/lu";
import Logo from "../Logo";
import { logOut } from "../../redux/eventActions";
import { Account } from "./context";

const NAV_ITEMS: { label: string; to: string; icon: IconType; end?: boolean }[] = [
  { label: "Upcoming", to: "/home", icon: LuListChecks, end: true },
  { label: "Calendar", to: "/home/calendar", icon: LuCalendarDays },
  { label: "Account", to: "/home/account", icon: LuSettings },
];

const NavItem: React.FC<(typeof NAV_ITEMS)[number] & { compact?: boolean }> = ({
  label,
  to,
  icon,
  end,
  compact,
}) => (
  <NavLink to={to} end={end} style={{ width: compact ? undefined : "100%", flex: compact ? 1 : undefined }}>
    {({ isActive }) => (
      <Flex
        align="center"
        direction={compact ? "column" : "row"}
        gap={compact ? 1 : 2.5}
        px={compact ? 2 : 2.5}
        py={compact ? 1.5 : 2}
        borderRadius="md"
        fontSize={compact ? "xs" : "sm"}
        fontWeight={500}
        color={isActive ? "gray.900" : "gray.600"}
        bg={isActive && !compact ? "gray.200" : "transparent"}
        _hover={{ bg: compact ? undefined : isActive ? "gray.200" : "gray.100", color: "gray.900" }}
        transition="background 120ms"
      >
        <Icon as={icon} boxSize={4} />
        {label}
      </Flex>
    )}
  </NavLink>
);

const UserMenu: React.FC<{ account: Account | null; compact?: boolean }> = ({ account, compact }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <Menu placement={compact ? "bottom-end" : "top-start"}>
      <MenuButton
        w={compact ? "auto" : "full"}
        px={compact ? 0 : 2}
        py={compact ? 0 : 1.5}
        borderRadius="md"
        _hover={{ bg: compact ? undefined : "gray.100" }}
        textAlign="left"
      >
        <HStack spacing={2.5}>
          <Avatar size="xs" bg="gray.900" color="white" name={account?.name} icon={<LuUser />} />
          {!compact && (
            <Text fontSize="sm" fontWeight={500} color="gray.700" noOfLines={1}>
              {account?.name || "My account"}
            </Text>
          )}
        </HStack>
      </MenuButton>
      <MenuList minW="200px">
        {account && (
          <Box px={3} py={2}>
            <Text fontSize="sm" fontWeight={600} noOfLines={1}>
              {account.name}
            </Text>
            <Text fontSize="xs" color="gray.500" noOfLines={1}>
              {account.email}
            </Text>
          </Box>
        )}
        {account && <MenuDivider borderColor="gray.200" my={1} />}
        <MenuItem icon={<LuSettings />} onClick={() => navigate("/home/account")}>
          Account settings
        </MenuItem>
        <MenuDivider borderColor="gray.200" my={1} />
        <MenuItem icon={<LuLogOut />} color="red.600" onClick={() => dispatch(logOut())}>
          Log out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

interface SidebarProps {
  account: Account | null;
  onOpenAssistant: () => void;
}

/** Desktop sidebar + mobile top bar / bottom tab bar. */
const Sidebar: React.FC<SidebarProps> = ({ account, onOpenAssistant }) => (
  <>
    <Box
      as="aside"
      display={{ base: "none", md: "flex" }}
      flexDirection="column"
      position="fixed"
      insetY={0}
      left={0}
      w="224px"
      bg="gray.50"
      borderRight="1px solid"
      borderColor="gray.200"
      px={3}
      py={4}
      zIndex={10}
    >
      <Box px={2} mb={6}>
        <Logo to="/home" size="sm" />
      </Box>
      <VStack spacing={0.5} align="stretch" flex={1}>
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}
      </VStack>
      <Button
        leftIcon={<LuSparkles />}
        justifyContent="flex-start"
        mb={2}
        onClick={onOpenAssistant}
      >
        Ask AI
      </Button>
      <UserMenu account={account} />
    </Box>

    <Flex
      display={{ base: "flex", md: "none" }}
      position="sticky"
      top={0}
      zIndex={10}
      h="56px"
      px={4}
      align="center"
      justify="space-between"
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
    >
      <Logo to="/home" size="sm" />
      <HStack spacing={2}>
        <IconButton aria-label="Ask AI" icon={<LuSparkles />} variant="minimal" size="sm" onClick={onOpenAssistant} />
        <UserMenu account={account} compact />
      </HStack>
    </Flex>

    <Flex
      display={{ base: "flex", md: "none" }}
      position="fixed"
      bottom={0}
      insetX={0}
      zIndex={10}
      bg="white"
      borderTop="1px solid"
      borderColor="gray.200"
      px={2}
      py={1.5}
    >
      {NAV_ITEMS.map((item) => (
        <NavItem key={item.to} {...item} compact />
      ))}
    </Flex>
  </>
);

export default Sidebar;
