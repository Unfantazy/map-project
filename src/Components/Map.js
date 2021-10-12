//{ title } - деструктуризация объекта props
//Можем передавать просто Map = (props) и обращаться к полю title через props.title

//Js код встраивается в JSX(html) через { here your code }
import {useState} from "react";
import Counter from "./Counter";

const Map = ({title}) => {
    //useState - хук Локального Состояния, принимается в себя Массив значений:
   const [count, setCount] = useState(0)
    // 1 значение count - initialState(Начальное значение)
    // 2 значение setCount - функция, которая изменяет initialState
    return (
        <div>
            <h1>{title}</h1>
            <Counter count={count} setCount={setCount}/>
        </div>
    );
}

//Смотри Компонент Counter

export default Map;
