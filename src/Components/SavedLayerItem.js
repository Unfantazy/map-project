import {useState} from "react";


const SavedLayerItem = ({id}) => {
    const [isActive, setIsActive] = useState(true);

    const onFilterItemClick = () => {
        setIsActive(b => !b)
    }

    return <button className={`FilterItem ${isActive ? 'isActive' : ''}`} onClick={() => onFilterItemClick()}>
        <span>{id}. Тестовый слой</span>
    </button>
}

export default SavedLayerItem