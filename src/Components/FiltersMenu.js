import FilterSelect from "./FilterSelect";
import {useCallback} from "react";
import {mapAPI} from "../API/methods";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import {ReactComponent as LayersIcon} from '../images/icons/layers.svg'
import {ReactComponent as ServicesIcon} from '../images/icons/services.svg'
import {ReactComponent as FiltersIcon} from '../images/icons/filters.svg'
import {LoadMarkers, AddLayersWithControl} from './Map'

const FiltersMenu = ({setModel, model, setIsLoading, isLoading}) => {
    const fetchSportsTypes = useCallback((filter) => {
        return mapAPI.getFilterValues('kind_sport', filter)
    }, [])

    const fetchSportsZonesTypes = useCallback((filter) => {
        return mapAPI.getFilterValues('type_zone', filter)
    }, [])

    const fetchSportsZonesNames = useCallback((filter) => {
        return mapAPI.getFilterValues('name_zone', filter)
    }, [])

    const fetchOrganizations = useCallback((filter) => {
        return mapAPI.getFilterValues('name_organization', filter)
    }, [])

    const fetchNames = useCallback((filter) => {
        return mapAPI.getFilterValues('name_object', filter)
    }, [])

    const onResetFilters = () => {
        setModel(null)
    }

    const updateMapLayers = (filterModel) =>
    {
        var params = '';
        if (filterModel.obj_name?.length > 0)
        {
            params += 'obj_name:' + filterModel.obj_name.join('\\;') + ';';
        }
        if (filterModel.org_id?.length > 0)
        {
            params += 'org_id:' + filterModel.org_id.join('\\;') + ';';
        }
        if (filterModel.sz_name?.length > 0)
        {
            params += 'sz_name:' + filterModel.sz_name.join('\\;') + ';';
        }
        if (filterModel.sz_type?.length > 0)
        {
            params += 'sz_type:' + filterModel.sz_type.join('\\;') + ';';
        }
        if (filterModel.s_kind?.length > 0)
        {
            params += 's_kind:' + filterModel.s_kind.join('\\;') + ';';
        }
        if (filterModel.buf?.length > 0)
        {
            params += 'buf:' + filterModel.buf.join('\\;') + ';';
        }

        setIsLoading(true);

        LoadMarkers(window.Markers, params);
        Promise.resolve(AddLayersWithControl(window.LeafletMap, window.Markers, params));

        setIsLoading(false);
    }

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
                                <button className={'filter-apply filter-btn'}
                                        onClick={() => updateMapLayers(model)}
                                    >Применить</button>
                                <button className={'filter-reset filter-btn'}
                                        onClick={() => onResetFilters()}
                                    >Сбросить
                                </button>
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
                            <div className={'filter-btns'}>
                                <button className={'filter-apply filter-btn'} id='layerBtn'>Рассчитать</button>
                            </div>
                        </TabPanel>
                    </div>
                </Tabs>
            </div>
        </>
    );
}

export default FiltersMenu;
