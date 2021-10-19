import InfoBlockItem from "./InfoBlockItem";

const InfoBlock = ({ data }) => {
    return (
        <div className='InfoBlock'>
           <div className={'InfoBlock__wrapper'}>
               <h1 className={'InfoBlock__title'}>Информация по спортивному объекту</h1>
               <div className="InfoBlock__inner scroller">
                   {data.map(item => {
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
               </div>
           </div>
        </div>
    );
}

export default InfoBlock;
