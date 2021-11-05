import InfoBlockItem from "./InfoBlockItem";
import InfoProvisionBlockItem from "./InfoProvisionBlockItem";
import InfoSportBlockItem from "./InfoSportBlockItem";
import {ReactComponent as CrossIcon} from '../images/icons/cross-dark.svg'
import {RemoveSelected} from './Map'
import {ExportToExcel} from './ExportToExcel'
import axios from 'axios'
import {useState, useEffect} from "react";
import Wkt from 'wicket'
import L from 'leaflet';

export const infoTypes = {
    default: 0,
    object: 1,
    sports: 2,
    provision: 3,
    baseOrPopulation: 4,
} 

export const excelHeaders = {
    population: 'Население, чел.', 
    sport_zones_sum: 'Кол-во спортивных зон',
    sport_square_sum: 'Площадь спортивных зон, кв. м',
    sport_kinds_sum: 'Видов спортивных зон',
    sport_zones_provision: 'Средняя обeспеченность спортивными зонами по жилым домам, зон на 100 000 человек',
    sport_square_provision: 'Средняя обeспеченность площадью спортивных зон по жилым домам, кв. м на 100 000 человек',
    sport_kinds_provision: 'Средняя обeспеченность видами услуг по жилым домам. услуг на 100 000 человек',
    sport_zones_types: 'Типы спортивных зон',
    sport_zones_amount: 'Типы спортивных зон, кол-во',
    sport_kinds_amount: 'Виды спортивных услуг, кол-во',
}

export const FilterModelToExcel = (filterModel) =>
{
    var params = {};
    if (filterModel) {
        if (filterModel.obj_name?.length > 0) {
            params['Фильтр - Названия объектов'] = filterModel.obj_name.join('; ');
        }
        if (filterModel.org_name?.length > 0) {
            params['Фильтр - Организации'] =  filterModel.org_name.join('; ');
        }
        if (filterModel.sz_name?.length > 0) {
            params['Фильтр - Названия спортзон'] =  filterModel.sz_name.join('; ');
        }
        if (filterModel.sz_type_name?.length > 0) {
            params['Фильтр - Типы спортзон'] =  filterModel.sz_type_name.join('; ');
        }
        if (filterModel.s_kind_name?.length > 0) {
            params['Фильтр - Виды услуг'] =  filterModel.s_kind_name.join('; ');
        }
        if (filterModel.buf?.length > 0 && filterModel.buf?.length < 4) {
            params['Фильтр - Доступность'] =  filterModel.buf.join('; ');
        }
        if (filterModel.buf?.length === 4) {
            params['Фильтр - Доступность'] =  'Все';
        }
    }
    
    return params;
}

const InfoBlock = ({ data, setData, model }) => {
    const getTitle = () => {
        switch (data.type) 
        {
            case infoTypes.object:
                return 'Информация по спортивному объекту'
            case infoTypes.sports:
            case infoTypes.provision:
                return 'Анализ выбранной территории';    
            default:
                return '';
        }
    }
    const getSubTitle = () => {
        switch (data.type) 
        {
            case infoTypes.object:
                return ''
            case infoTypes.sports:
                return '(Суммарные показатели спортивных зон, входящих в область)'; 
            case infoTypes.provision:
                return '(Средняя обеспеченность спортивной инфраструктурой по жилым домам, входящих в область)';    
            default:
                return '';
        }
    }

    // excel 
    let excelData = [];
    const fileName = "territory_analysis"; // here enter filename for your excel file

    if (data.type === infoTypes.sports || data.type === infoTypes.provision) {
        const drawingLayer = window.LeafletMap.pm.getGeomanDrawLayers(true).getLayers()[0] || window.currentSelectedSavedLayer.pm.getLayers()[0];
        const shape = drawingLayer?.pm.getShape() === 'Circle' 
            ? L.PM.Utils.circleToPolygon(drawingLayer, 20) 
            : drawingLayer;
        if (shape) {
            var wkt = new Wkt.Wkt();

            excelData[0] = FilterModelToExcel(model)
            excelData[0]['geometry'] = wkt.read(JSON.stringify(shape.toGeoJSON())).write()

            for (let key in excelHeaders) {
                var header = excelHeaders[key]
                var value = data.items[0][key]
                if (value) {
                    if (key === 'sport_zones_types') {
                        excelData[0][header] = JSON.parse(value).join('; ')
                    }
                    else if (key === 'sport_zones_amount' || key === 'sport_kinds_amount') {
                        excelData[0][header] = JSON.parse(value).map(type => type.zone_type + ' ' + type.amount + ' шт.').join('; ')
                    }
                    else {
                        excelData[0][header] = value
                    }
                }
            }
        }
    }
    // excel

    return ((data.items.length > 0 || data.type === infoTypes.baseOrPopulation) &&
        <div className='InfoBlock'>
           <div className={'InfoBlock__wrapper'}>
               <div className={'InfoBlock__top'}>
                   <button className={'InfoBlock__close'}
                           id={'close-info'}
                   onClick={(e) => {
                       setData({type: infoTypes.default, items: []});
                       if (data.type === infoTypes.object) {
                            RemoveSelected(window.LeafletMap);
                        }
                   }}
                   >
                       <CrossIcon />
                   </button>
                   <h1 className={'InfoBlock__title'}>{getTitle()}</h1>
               </div>
               
               <div className={'InfoBlock__subtitle'}>
                   <h3>{getSubTitle()}</h3>
               </div>

               <div className="InfoBlock__inner scroller">
                   {data.type === infoTypes.object && data.items.map(item => {
                       return <InfoBlockItem
                           title={item.title}
                           name={item.obj_name}
                           accessibility={item.accessibility}
                           kinds={JSON.parse(item.s_kinds)}
                           types={JSON.parse(item.z_types)}
                           zones={JSON.parse(item.s_zones)}
                           organization={item.organization}
                       />
                   })}
                   {data.type === infoTypes.sports && data.items.map(item => {
                       return <InfoSportBlockItem
                           square={item.sport_square_sum}
                           types={JSON.parse(item.sport_zones_amount)}
                           kinds={JSON.parse(item.sport_kinds_amount)}
                       />
                   })}
                   {data.type === infoTypes.provision && data.items.map(item => {
                       return <InfoProvisionBlockItem
                           zones={item.sport_zones_sum}
                           zonesProv={item.sport_zones_provision}
                           types={JSON.parse(item.sport_zones_types)}
                           square={item.sport_square_sum}
                           squareProv={item.sport_square_provision}
                           kinds={item.sport_kinds_sum}
                           kindsProv={item.sport_kinds_provision}
                           population={item.population}
                       />
                   })}
                   {data.type === infoTypes.baseOrPopulation && 
                        <div className='InfoBlockItem__empty'>Для аналитики выберите тепловую карту спортивных зон или потребности в спортивных зонах </div>}
               </div>
            {/* excel */}
            <div className={'filter-btns'} >
                {(data.type === infoTypes.sports ||
                  data.type === infoTypes.provision) && Object.values(data.items[0]).find(x => x !== null && x !== 0) && <ExportToExcel 
                        apiData={excelData} 
                        fileName={fileName} />
                }
            </div>
            {/* excel */}
           </div>
        </div>
    );
}

export default InfoBlock;
