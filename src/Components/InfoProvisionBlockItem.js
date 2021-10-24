
const InfoAreaBlockItem = ({ count, types, square, kinds, population, sumSquare }) => {
    return (
        <>
        <div className='InfoBlockItem'>
            <div className={'InfoBlockItem__title'}>Количество спортивных зон:</div>
            <div className={'InfoBlockItem__items'}>
                <ul>
                    <li className={'InfoBlockItem__item'}>{count.toLocaleString()} зон на 100 000 человек</li>
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
                        <li className={'InfoBlockItem__item'}>{kinds.toLocaleString()} услуг на 100 000 человек</li>
                    </ul>
                </div>
            </div>
            <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Население:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        <li className={'InfoBlockItem__item'}>{population.toLocaleString()} человек</li>
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
        </>
    );
}

export default InfoAreaBlockItem;
