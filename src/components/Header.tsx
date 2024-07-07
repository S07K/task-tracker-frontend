import React from 'react';
import style from './Header.module.css';
import ButtonStyle from './Button.module.css';
import { toggleCreateModal } from '../redux/eventActions';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@chakra-ui/react';

const Header: React.FC = () => {
    const dispatch = useDispatch();
    const isCreateModalOpen = useSelector((state: any) => state.event.isCreateModalOpen);
    const openAddEventForm = () => {
        console.log('clicked add event form', isCreateModalOpen)
        if(!isCreateModalOpen) {
            dispatch(toggleCreateModal(true));
        }
    }
    return (
        <header className={style.headerWrapper}>
            <span className={style.logo}>Task Tracker</span>
            <section>
                <Button variant="brandPrimary" onClick={openAddEventForm} className={ButtonStyle.primaryMediumButton}>Create Task</Button>
            </section>
        </header>
    );
};

export default Header;