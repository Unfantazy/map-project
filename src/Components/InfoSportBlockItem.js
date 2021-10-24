
const InfoSportBlockItem = ({ square, types, kinds }) => {    
    const hasData = types && square && kinds;
    return (
        <>
            {!hasData && <div className='InfoBlockItem'>Данные отсутствуют</div>}
            {hasData && <>
                <div className='InfoBlockItem'>
                    <div className={'InfoBlockItem__title'}>Суммарная площадь спортивных зон:</div>
                    <div className={'InfoBlockItem__items'}>
                        <ul>
                            <li className={'InfoBlockItem__item'}>{square.toLocaleString()} кв. м</li>
                        </ul>
                    </div>
                </div>
                    <div className='InfoBlockItem'>
                        <div className={'InfoBlockItem__title'}>Типы спортивных зон:</div>
                        <div className={'InfoBlockItem__items'}>
                            <ul>
                                {types.map(type => <li className={'InfoBlockItem__item'}>{type.zone_type} {type.amount} шт.</li>) }
                            </ul>
                        </div>
                    </div>
                    <div className='InfoBlockItem'>
                        <div className={'InfoBlockItem__title'}>Видов спортивных услуг:</div>
                        <div className={'InfoBlockItem__items'}>
                            <ul>
                                {kinds.map(kind => <li className={'InfoBlockItem__item'}>{kind.zone_type} {kind.amount} шт.</li>) }
                            </ul>
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default InfoSportBlockItem;
