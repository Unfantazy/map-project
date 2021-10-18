
const InfoBlockItem = ({title, items}) => {
    return (
        <div className='InfoBlockItem'>
            <div className={'InfoBlockItem__title'}>{title}</div>
            <div className={'InfoBlockItem__items'}>
                <ul>
                    {items.map(item => <li className={'InfoBlockItem__item'}>{item}</li> )}

                </ul>
            </div>
        </div>
    );
}

export default InfoBlockItem;
