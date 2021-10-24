import {useEffect, useState} from "react";
import {includes} from "lodash";


const FilterItem = ({title, selectedBuf, setSelectedBuf, type}) => {
    const [isActive, setIsActive] = useState(true)

    useEffect(() => {
        if (!selectedBuf.length) {
            setIsActive(false)
        }
    }, [selectedBuf])

    const onFilterItemClick = () => {
        setIsActive(!isActive)
        if (!includes(selectedBuf, type)) {
            setSelectedBuf([
                ...selectedBuf,
                type
            ])
        } else {
            setSelectedBuf(selectedBuf.filter(item => item !== type))
        }
    }

    return (
        <button className={`FilterItem ${isActive ? 'isActive' : ''}`} onClick={() => onFilterItemClick()}>
            <span>{title}</span>
        </button>
    );
}

export default FilterItem;
