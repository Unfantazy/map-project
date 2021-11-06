import {useEffect, useState} from "react";
import {includes} from "lodash";


const FilterItem = ({title, selectedBuf, setSelectedBuf, type, model, flag}) => {
    const [isActive, setIsActive] = useState((includes(selectedBuf, type)))

    useEffect(() => {
        if (!selectedBuf.length) {
            setIsActive(false)
        }
    }, [selectedBuf])

    useEffect(() => {
        setSelectedBuf(model['buf'])
    }, [flag])

    useEffect(() => {
        if((includes(selectedBuf, type))) {
            setIsActive(true)
        } else {
            setIsActive(false)
        }
    }, [model])

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
