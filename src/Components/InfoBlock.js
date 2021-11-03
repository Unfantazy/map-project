import InfoBlockItem from "./InfoBlockItem";
import InfoProvisionBlockItem from "./InfoProvisionBlockItem";
import InfoSportBlockItem from "./InfoSportBlockItem";
import {ReactComponent as CrossIcon} from '../images/icons/cross-dark.svg'
import {RemoveSelected} from './Map'

export const infoTypes = {
    default: 0,
    object: 1,
    sports: 2,
    provision: 3,
} 

const InfoBlock = ({ data, setData }) => {
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
                return 'Суммарные показатели спортивных зон, входящих в область'; 
            case infoTypes.provision:
                return 'Средняя обеспеченность спортивной инфраструктурой по жилым домам, входящих в область';    
            default:
                return '';
        }
    }

    return (
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
                   <h3>({getSubTitle()})</h3>
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
               </div>
           </div>
        </div>
    );
}

export default InfoBlock;
