import React from 'react';
import style from './Header.module.css';
import ButtonStyle from './Button.module.css';

const Header: React.FC = () => {
    return (
        <header className={style.headerWrapper}>
            <span className={style.logo}>Task Tracker</span>
            <section>
                <button className={ButtonStyle.primaryMediumButton}>Create Task</button>
            </section>
        </header>
    );
};

export default Header;