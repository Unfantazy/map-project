import FilterSelect from "./FilterSelect";
import {useCallback} from "react";
import {mapAPI} from "../API/methods";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {ReactComponent as LayersIcon} from '../images/icons/layers.svg'
import {ReactComponent as ServicesIcon} from '../images/icons/services.svg'
import {ReactComponent as FiltersIcon} from '../images/icons/filters.svg'

const FiltersMenu = ({setModel, model}) => {
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
                <Tabs defaultIndex={0} onSelect={index => console.log(index)} forceRenderTabPanel>
                    <TabList>
                        <Tab>
                        <span className={'tabs-img'}>
                            <FiltersIcon/>
                        </span>
                            <span className={'d-flex align-items-center events-header__item--span'}>
                            Фильтры
                        </span>
                        </Tab>
                        <Tab>
                        <span className={'tabs-img'}>
                            <LayersIcon style={{width: 14, height: 14}}/>
                        </span>
                            <span className={'d-flex align-items-center events-header__item--span'}>
                            Слои
                        </span>
                        </Tab>
                        <Tab>
                        <span className={'tabs-img'}>
                            <ServicesIcon style={{width: 12, height: 12}}/>
                        </span>
                            <span className={'d-flex align-items-center events-header__item--span'}>
                            Инструменты
                        </span>
                        </Tab>
                    </TabList>
                    <div className='Menu-wrapper'>
                        <TabPanel>
                            <h1>Фильтры</h1>
                            <div className={'scroller menu-inner'}>
                                <FilterSelect fetchItems={fetchNames} title={'Спортивный объект'} checkbox={false}
                                              type={'obj_name'} setModel={setModel} model={model}/>
                                <FilterSelect fetchItems={fetchOrganizations} title={'Ведомственная организация'}
                                              type={'org_id'} setModel={setModel} model={model}/>
                                <FilterSelect fetchItems={fetchSportsZonesNames} title={'Спортивная зона'}
                                              checkbox={false} type={'sz_name'} setModel={setModel} model={model}/>
                                <FilterSelect fetchItems={fetchSportsZonesTypes} title={'Тип спортивной зоны'}
                                              type={'sz_type'} setModel={setModel} model={model}/>
                                <FilterSelect fetchItems={fetchSportsTypes} title={'Вид спорта'} type={'s_kind'}
                                              setModel={setModel} model={model}/>
                                <FilterSelect onlyItems={true} title={'Доступность спортивного объекта'}
                                              type={'buf'} setModel={setModel} model={model}/>
                            </div>
                            <div className={'filter-btns'}>
                                <button className={'filter-apply filter-btn'}>Применить</button>
                                <button className={'filter-reset filter-btn'}>Сбросить</button>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <h1>Слои</h1>
                            <div className={'scroller menu-inner'}>
                                <div className={'layers-control'}>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel>
                            <h1>Инструменты</h1>
                            <div className={'scroller menu-inner'}>
                                <div className={'services-control'}>
                                </div>
                            </div>
                        </TabPanel>
                    </div>
                </Tabs>
            </div>
        </>
    );
}

export default FiltersMenu;
