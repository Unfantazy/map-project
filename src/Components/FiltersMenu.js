import FilterSelect from "./FilterSelect";
import {useCallback} from "react";
import {mapAPI} from "../API/methods";
import Tabs from "./Tabs";
import {Route, Switch} from "react-router-dom";
import FilterItem from "./FilterItem";

const FiltersMenu = () => {
    const layersNames = [
        {id: 1, name: 'Спортивные объекты'},
        {id: 2, name: 'Тепловая карта населения'},
        {id: 3, name: 'Тепловая карта спорт. объектов'},
        {id: 4, name: 'Тепловая карта населения и спорт объектов'},
    ]

    const fetchSportsTypes = useCallback((filter) => {
        return mapAPI.getSportsTypes('kind_sport', filter)
    }, [])

    const fetchSportsZonesTypes = useCallback((filter) => {
        return mapAPI.getSportsZonesTypes('type_zone', filter)
    }, [])

    const fetchSportsZonesNames = useCallback((filter) => {
        return mapAPI.getSportsZonesNames('name_zone', filter)
    }, [])

    const fetchOrganizations = useCallback((filter) => {
        return mapAPI.getOrganizations('name_organization', filter)
    }, [])

    const fetchNames = useCallback((filter) => {
        return mapAPI.getNames('name_object', filter)
    }, [])

    return (
        <>
            <div className={`Menu`}>
                <Tabs/>
                <div className='Menu-wrapper'>
                    <Switch>
                        <Route exact path={'/filter'} render={() => (
                            <>
                                <h1>Фильтры</h1>
                                <div className={'scroller menu-inner'}>
                                    <FilterSelect fetchItems={fetchNames} title={'Спортивный объект'}/>
                                    <FilterSelect fetchItems={fetchOrganizations} title={'Ведомственная организация'}/>
                                    <FilterSelect fetchItems={fetchSportsZonesNames} title={'Спортивная зона'}/>
                                    <FilterSelect fetchItems={fetchSportsZonesTypes} title={'Тип спортивной зоны'}/>
                                    <FilterSelect fetchItems={fetchSportsTypes} title={'Вид спорта'}/>
                                    <FilterSelect onlyItems={true} title={'Доступность спортивного объекта'}/>
                                </div>
                            </>
                        )}/>

                        <Route exact path={'/layers'} render={() => (
                            <>
                                <h1>Слои</h1>
                                <div className={'scroller menu-inner'}>
                                    <div className={'menu-inner'}>
                                        <div className={'layers'}>
                                            {layersNames.map(layer => <FilterItem
                                                key={layer.id}
                                                name={layer.name}
                                            />)}

                                        </div>
                                    </div>
                                </div>
                            </>
                        )}/>

                        <Route exact path={'/services'} render={() => (
                            <>
                                <h1>Инструменты</h1>
                                <div className={'scroller menu-inner'}>
                                </div>
                            </>
                        )}/>

                    </Switch>

                    <div className={'filter-btns'}>
                        <button className={'filter-apply filter-btn'}>Применить</button>
                        <button className={'filter-reset filter-btn'}>Сбросить</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FiltersMenu;
