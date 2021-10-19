import FilterItem from "./FilterItem";

export const layersNames = [
    {id: 1, name: 'Спортивные объекты'},
    {id: 2, name: 'Зоны доступности'},
    {id: 3, name: 'Базовая карта'},
    {id: 4, name: 'Тепловая карта спортивных зон'},
    {id: 5, name: 'Тепловая карта населения'},
    {id: 6, name: 'Тепловая карта обеспеченности спортивной инфраструктурой'},
]

const LayersFilters = () => {
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
