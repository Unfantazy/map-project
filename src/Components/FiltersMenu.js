import FilterSelect from "./FilterSelect";


const FiltersMenu = () => {
    return (
        <>
        <div className={`Menu`}>
            <div className='Menu-wrapper'>
                <h1>Фильтры</h1>
                <div className={'scroller menu-inner'}>
                <FilterSelect
                title={'Спортивный объект'}
                />
                <FilterSelect title={'Ведомственная организация'}/>
                <FilterSelect title={'Спортивная зона'}/>
                <FilterSelect title={'Тип спортивной зоны'}/>
                <FilterSelect title={'Вид спорта'}/>
                <FilterSelect onlyItems={true} title={'Доступность спортивного объекта'}/>
                </div>
            </div>
        </div>
        </>
    );
}

export default FiltersMenu;
