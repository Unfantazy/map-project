import getNoun from '../Helpers/stringHelper'

const InfoProvisionBlockItem = ({ count, types, square, kinds, population, sumSquare }) => {
    const hasData = count && types && square && kinds && population && sumSquare;
    return (
        <>        
        {!hasData && <div className='InfoBlockItem__empty'>Данные отсутствуют</div>}
        {hasData && <>
            <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Количество спортивных зон:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        <li className={'InfoBlockItem__item'}>{count.toLocaleString()} {getNoun(Number(count), 'зона', 'зоны', 'зон')} на 100 000 человек</li>
                    </ul>
                </div>
            </div>
            <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Площадь спортивных зон:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        <li className={'InfoBlockItem__item'}>{square.toLocaleString()} кв. м на 100 000 человек</li>
                    </ul>
                </div>
            </div>
            <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Видов спортивных услуг:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        <li className={'InfoBlockItem__item'}>{kinds.toLocaleString()} {getNoun(Number(kinds), 'услуга', 'услуги', 'услуг')} на 100 000 человек</li>
                    </ul>
                </div>
            </div>
            <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Население:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        <li className={'InfoBlockItem__item'}>{population.toLocaleString()} {getNoun(Number(kinds), 'человек', 'человека', 'человек')}</li>
                    </ul>
                </div>
            </div>
            <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Суммарная площадь спортивных зон:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        <li className={'InfoBlockItem__item'}>{sumSquare.toLocaleString()}  кв. м</li>
                    </ul>
                </div>
            </div>
            <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Типы спортивных зон:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        {types.map(type => <li className={'InfoBlockItem__item'}>{type}</li>) }
                    </ul>
                </div>
            </div>
        </> }
    </>);
}

export default InfoProvisionBlockItem;
