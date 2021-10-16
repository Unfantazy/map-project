import FilterSelect from "./FilterSelect";
import {useCallback} from "react";
import {mapAPI} from "../API/methods";


const FiltersMenu = () => {
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
            <div className='Menu-wrapper'>
                <h1>Фильтры</h1>
                <div className={'scroller menu-inner'}>
                <FilterSelect fetchItems={fetchNames} title={'Спортивный объект'}/>
                <FilterSelect fetchItems={fetchOrganizations} title={'Ведомственная организация'}/>
                <FilterSelect fetchItems={fetchSportsZonesNames} title={'Спортивная зона'}/>
                <FilterSelect fetchItems={fetchSportsZonesTypes} title={'Тип спортивной зоны'}/>
                <FilterSelect fetchItems={fetchSportsTypes} title={'Вид спорта'}/>
                <FilterSelect onlyItems={true} title={'Доступность спортивного объекта'}/>
                </div>
            </div>
        </div>
        </>
    );
}

export default FiltersMenu;
