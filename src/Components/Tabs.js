import React, { useCallback } from 'react';
import { NavLink } from "react-router-dom";

const Tabs = () => {
    const renderTab = useCallback((tab, text) => (
        <div className="basic__tabs-item events-header__item" >
            <NavLink
                exact
                to={`/mainsite/events/edit/`}
                activeClassName='active'
                className='basic__tabs-item--link events-header__item--link'
                style= {{ cursor: loading && 'wait' }}
            >
                <span className={'d-flex align-items-center events-header__item--span'}>
                    {text}
                </span>
            </NavLink>
        </div>
    ), []);

    return (
        <header className="basic__tabs-header">
            {renderTab( 'filter', 'Фильтры')}
            {renderTab("layers", 'Слои')}
            {renderTab("services", 'Услуги на выполнение')}
        </header>
    );
};

export default Tabs;
