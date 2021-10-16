import FilterItem from "./FilterItem";


const LayersFilters = () => {
    const layersNames = [
        {id: 1, name: 'Спортивные объекты'},
        {id: 2, name: 'Тепловая карта населения'},
        {id: 3, name: 'Тепловая карта спорт. объектов'},
        {id: 4, name: 'Тепловая карта населения и спорт объектов'},
    ]

    return (
        <>
            <div className={`Menu LayersFilters`}>
                <div className='Menu-wrapper'>
                    <h1>Слои</h1>
                    <div className={'menu-inner'}>
                        <div className={'layers'}>
                            {layersNames.map(layer => <FilterItem
                                key={layer.id}
                                name={layer.name}
                            />)}

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LayersFilters;
