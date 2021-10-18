import InfoBlockItem from "./InfoBlockItem";

const InfoBlock = () => {
    const items = [
        { id: 1, title: 'Наименование:', items: ['Спортивный комплекс высшего учебного заведения'] },
        { id: 2, title: 'Ведомство:', items: ['Минобрнауки России'] },
        { id: 3, title: 'Спортивные зоны:', items: ['зал тренажерный 2 шт.', 'городок тренажерный (воркаут) нового типа 2 шт.', 'площадка для игры в футбол'] },
        { id: 4, title: 'Типы спортивных зон:', items: ['зал тренажерный 2 шт.', 'городок тренажерный (воркаут) нового типа 2 шт.', 'площадка для игры в футбол'] },
        { id: 5, title: 'Виды спортивных услуг:', items: ['Тяжелая атлетика', 'Воркаут', 'Футбол', 'Общая физическая подготовка', 'Пауэрлифтинг'] },
        { id: 6, title: 'Доступность:', items: ['Окружная (3000 м)'] },
    ]
    return (
        <div className='InfoBlock'>
           <div className={'InfoBlock__wrapper'}>
               <h1 className={'InfoBlock__title'}>Информация по спортивному объекту</h1>
               <div className="InfoBlock__inner scroller">
                   {items.map(item => {
                       return <InfoBlockItem
                           key={item.id}
                           title={item.title}
                           items={item.items}
                       />
                   })}
               </div>
           </div>
        </div>
    );
}

export default InfoBlock;
