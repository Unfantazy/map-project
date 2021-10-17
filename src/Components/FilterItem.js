import {useState} from "react";


const FilterItem = ({name,}) => {
    const [isActive, setIsActive] = useState(false)
    const onFilterItemClick = () => {
        setIsActive(!isActive)
    }
    return (
        <button className={`FilterItem ${isActive ? 'isActive' : ''}`} onClick={() => onFilterItemClick()}>
            <span>{name}</span>
        </button>
    );
}

export default FilterItem;
