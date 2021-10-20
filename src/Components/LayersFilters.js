import FilterItem from "./FilterItem";

export const objectLayersNames = [
    {id: 1, name: 'Спортивные объекты'},
    {id: 2, name: 'Зоны доступности'}
]

export const heatLayersNames = [
    {id: 1, name: 'Базовая карта'},
    {id: 2, name: 'Тепловая карта спортивных зон'},
    {id: 3, name: 'Тепловая карта населения'},
    {id: 4, name: 'Тепловая карта обеспеченности спортивной инфраструктурой'},
]

const LayersFilters = () => {
    return (
        <>
            <div className={`Menu LayersFilters`}>
                <div className='Menu-wrapper'>
                    <h1>Слои</h1>
                    <div className={'menu-inner'}>
                        <div className={'layers'}>
                            {objectLayersNames.map(layer => <FilterItem
                                key={layer.id}
                                name={layer.name}
                            />)}
                            <div className={"line"}>
                                {heatLayersNames.map(layer => <FilterItem
                                    key={layer.id}
                                    name={layer.name}
                                />)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LayersFilters;
