import React, {useEffect, useState} from 'react';
import {ReactComponent as IIcon} from "../images/icons/i.svg";
import {ReactComponent as CrossIcon} from "../images/icons/cross-dark.svg";
import InfoBlockItem from "./InfoBlockItem";

const Hint = ({isHintShown, setIsHintShown}) => {

    if (isHintShown) {
        return <div className='InfoBlock HintBlock'>
            <div className={'InfoBlock__wrapper'}>
                <div className={'InfoBlock__top'}>
                    <button className={'InfoBlock__close'}
                            id={'close-info'}
                            onClick={(e) => {
                                setIsHintShown(false)
                            }}
                    >
                        <CrossIcon/>
                    </button>
                    <h1 className={'InfoBlock__title'}>Подсказка</h1>
                </div>

                <div className="InfoBlock__inner scroller">
                    <div className={'HintBlock__text'}>Для получения атрибутов спортивной инфраструктуры или показателей
                        обеспеченности населения
                        на определенной территории:
                    </div>
                    <ul className={'HintBlock__list'}>
                        <li className={'HintBlock__item'}>1. На вкладке "Фильтры" определите критерии для требуемых
                            спортивных объектов
                        </li>
                        <li className={'HintBlock__item'}>2. На вкладке "Слои" выберите необходимую тепловую карту</li>
                        <li className={'HintBlock__item'}>3. На вкладке "Инструменты" с помощью инструментов выделите
                            необходимую область
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    }

    return <div className='hint-icon'
                onClick={() => {
                    setIsHintShown(true)
                }}
    ><IIcon/></div>
};

export default Hint;
