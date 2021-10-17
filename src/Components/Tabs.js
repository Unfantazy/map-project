import React, {useCallback} from 'react';
import {NavLink} from "react-router-dom";

const Tabs = () => {

    const renderTab = useCallback((tab, text) => (
        <div className={`tabs-item`}>
            <NavLink
                exact
                to={`/${tab}`}
                activeClassName='tabs-item__link---active'
                className='tabs-item--link'
                activeStyle={{  }}
                // style= {{ cursor: loading && 'wait' }}
            >
                <span className={'d-flex align-items-center events-header__item--span'}>
                    {text}
                </span>
            </NavLink>
        </div>
    ), []);

    return (
        <header className="tabs-header">
            {renderTab('', 'Фильтры')}
            {renderTab("layers", 'Слои')}
            {renderTab("services", 'Инструменты')}
        </header>
    );
};

export default Tabs;
