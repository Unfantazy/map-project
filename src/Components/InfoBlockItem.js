
const InfoBlockItem = ({ name, organization, accessibility, kinds, zones, types }) => {
    console.log(zones)
    return (
        <>
        <div className='InfoBlockItem'>
            <div className={'InfoBlockItem__title'}>Наименование:</div>
            <div className={'InfoBlockItem__items'}>
                <ul>
                    <li className={'InfoBlockItem__item'}>{name}</li>
                </ul>
            </div>
        </div>
            <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Ведомство:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        <li className={'InfoBlockItem__item'}>{organization}</li>
                    </ul>
                </div>
            </div>
            <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Спортивные зоны:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        {zones.map(zone => <li className={'InfoBlockItem__item'}>{zone}</li>) }
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
            <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Виды спортивных услуг:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        {kinds.map(kind => <li className={'InfoBlockItem__item'}>{kind}</li>) }
                    </ul>
                </div>
            </div>
            <div className='InfoBlockItem'>
                <div className={'InfoBlockItem__title'}>Доступность:</div>
                <div className={'InfoBlockItem__items'}>
                    <ul>
                        <li className={'InfoBlockItem__item'}>{accessibility}</li>
                    </ul>
                </div>
            </div>
        </>
    );
}

export default InfoBlockItem;
