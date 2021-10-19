import React, {useCallback} from 'react';
import {NavLink} from "react-router-dom";
// import FiltersIcon from '../images/filters.png'
// import LayersIcon from '../images/layers.png'
// import ServicesIcon from '../images/services.png'
import {ReactComponent as LayersIcon} from '../images/icons/layers.svg'
import {ReactComponent as ServicesIcon} from '../images/icons/services.svg'
import {ReactComponent as FiltersIcon} from '../images/icons/filters.svg'

const Tabs = () => {
    const renderTab = useCallback((tab, text, icon) => (
        <div className={`tabs-item`}>
            <NavLink
                exact
                to={`/${tab}`}
                activeClassName='tabs-item__link---active'
                className='tabs-item--link'
                activeStyle={{  }}
                // style= {{ cursor: loading && 'wait' }}
            >
                <span className={'tabs-img'}>
                    {icon}
                </span>
                <span className={'d-flex align-items-center events-header__item--span'}>
                    {text}
                </span>
            </NavLink>
        </div>
    ), []);

    return (
        <header className="tabs-header">
            {renderTab('', 'Фильтры', <FiltersIcon />)}
            {renderTab("layers", 'Слои', <LayersIcon style={{width: 15, height: 15}}/>)}
            {renderTab("services", 'Инструменты', <ServicesIcon/>)}
        </header>
    );
};

export default Tabs;
