import React from "react";
import style from "./Header.module.css";
import ButtonStyle from "./Button.module.css";
import { setToken, setUser, toggleCreateModal } from "../redux/eventActions";
import { useDispatch, useSelector } from "react-redux";
import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  WrapItem,
} from "@chakra-ui/react";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const isCreateModalOpen = useSelector(
    (state: any) => state.event.isCreateModalOpen
  );
  const openAddEventForm = () => {
    if (!isCreateModalOpen) {
      dispatch(toggleCreateModal(true));
    }
  };

  const logOut = () => {
    dispatch(setToken(""))
    dispatch(setUser(""))
    window.location.reload()
  }
  return (
    <header className={style.headerWrapper}>
      <span className={style.logo}><Link to={"/home"}>Task Tracker</Link></span>
      <Box className={style.rightSection}>
        <Button
          variant="brandPrimary"
          onClick={openAddEventForm}
          className={ButtonStyle.primaryMediumButton}
        >
          Create Task
        </Button>
        <Menu>
          <MenuButton>
            <WrapItem>
              <Avatar
                bg={"#333"}
                icon={<AiOutlineUser fontSize='1.5rem' />}
                src=""
              />
            </WrapItem>
          </MenuButton>
          <MenuList>
            <MenuGroup title="Profile">
              <MenuItem>My Account</MenuItem>
              <MenuItem color={"#e54e4e"} _hover={{backgroundColor: "#e54e4e", color: "#fff"}} onClick={logOut}>Log out</MenuItem>
            </MenuGroup>
            {/* <MenuDivider /> */}
            {/* <MenuGroup title="Help">
                        <MenuItem>Docs</MenuItem>
                        <MenuItem>FAQ</MenuItem>
                    </MenuGroup> */}
          </MenuList>
        </Menu>
      </Box>
    </header>
  );
};

export default Header;
