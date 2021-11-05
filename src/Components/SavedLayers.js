import {useEffect, useState} from "react";


const SavedLayers = () => {
    const [isActive, setIsActive] = useState(true);
    var savedLayers = localStorage.getItem('saved_layers');
    if (savedLayers)
    {
        var layers = Array.from(JSON.parse(savedLayers))
        const onFilterItemClick = () => {
            setIsActive(!isActive);     
        }

        return layers.map((layer) => 
                <button className={`FilterItem ${isActive ? 'isActive' : ''}`} onClick={() => onFilterItemClick()}>
                    <span>{layer.id}. Тестовый слой</span>
                </button>)
    }

    return <></>
}

export default SavedLayers