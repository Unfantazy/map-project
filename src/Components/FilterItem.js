import {useState} from "react";


const FilterItem = ({name, }) => {
    const [isActive, setIsActive] = useState(false)
    const onFilterItemClick = () => {
        setIsActive(!isActive)
    }
    return (
        <div className={`FilterItem ${isActive ? 'isActive' : ''}`} onClick={() => onFilterItemClick()}>
            <span>{name}</span>
        </div>
    );
}

export default FilterItem;
