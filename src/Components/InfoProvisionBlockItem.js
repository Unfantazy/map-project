import getNoun from '../Helpers/stringHelper'

const InfoProvisionBlockItem = ({ zones, zonesProv, types, kinds, kindsProv, population, square, squareProv }) => {
    const hasData = zones || zonesProv || types || kinds || kindsProv || population || square || squareProv;
    return (
        <>        
        {!hasData && <div className='InfoBlockItem__empty'>Данные отсутствуют</div>}
        {hasData && <>
            {population && <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Население:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        <li className={'InfoBlockItem__item'}>{population.toLocaleString()} {getNoun(Number(population), 'человек', 'человека', 'человек')}</li>
                    </ul>
                </div>
            </div>
            }
             {zones && zonesProv && <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Количество спортивных зон:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        <li className={'InfoBlockItem__item'}>{zones.toLocaleString()}  {getNoun(Number(zones), 'зона', 'зоны', 'зон')}</li>
                        <li className={'InfoBlockItem__subitem'}>({zonesProv.toLocaleString()} {getNoun(Number(zonesProv), 'зона', 'зоны', 'зон')} на 100 000 человек)</li>
                    </ul>
                </div>
            </div>
            }
            {square && squareProv && <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Площадь спортивных зон:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        <li className={'InfoBlockItem__item'}>{square.toLocaleString()}  кв. м</li>
                        <li className={'InfoBlockItem__subitem'}>({squareProv.toLocaleString()} кв. м на 100 000 человек)</li>
                    </ul>
                </div>
            </div>
            }
            {!!kinds && kindsProv && <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Видов спортивных услуг:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        <li className={'InfoBlockItem__item'}>{kinds.toLocaleString()} {getNoun(Number(kinds), 'услуга', 'услуги', 'услуг')}</li>
                        <li className={'InfoBlockItem__subitem'}>({kindsProv.toLocaleString()} {getNoun(Number(kindsProv), 'услуга', 'услуги', 'услуг')} на 100 000 человек)</li>
                    </ul>
                </div>
            </div>
            }
            {kinds === 0 && <div className='InfoBlockItem__empty'>Спортивная инфраструктура отсутствует</div>}
            {types && <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Типы спортивных зон:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        {types.map(type => <li className={'InfoBlockItem__item'}>{type}</li>) }
                    </ul>
                </div>
            </div>
            }
        </> }
    </>);
}

export default InfoProvisionBlockItem;
