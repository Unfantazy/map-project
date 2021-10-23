import InfoAreaBlockItem from "./InfoAreaBlockItem";
import {ReactComponent as CrossIcon} from '../images/icons/cross-dark.svg'

const InfoAreaBlock = ({ areaData, setAreaData }) => {
    return (
        <div className='InfoBlock'>
           <div className={'InfoBlock__wrapper'}>
               <div className={'InfoBlock__top'}>
                   <button className={'InfoBlock__close'}
                           id={'close-info'}
                   onClick={(e) => {
                       setAreaData([]);
                   }}
                   >
                       <CrossIcon />
                   </button>
                   <h1 className={'InfoBlock__title'}>Средняя обеспеченность спортивной инфраструктурой<br/> по жилым домам, входящих в область</h1>
               </div>

               <div className="InfoBlock__inner scroller">
                   {areaData.map(item => {
                       return <InfoAreaBlockItem
                           count={item.sport_zones_provision}
                           types={JSON.parse(item.sport_zones_types)}
                           square={item.sport_square_provision}
                           kinds={item.sport_kinds_provision}
                           population={item.population}
                           sumSquare={item.sport_square_sum}
                       />
                   })}
               </div>
           </div>
        </div>
    );
}

export default InfoAreaBlock;
