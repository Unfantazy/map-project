import SavedLayerItem from "./SavedLayerItem";
import {useState} from "react";


const SavedLayers = () => {
    const savedLayers = localStorage.getItem('saved_layers');
    const [selectedInput, setSelectedInput] = useState(0);

    const handleChange = inputValue => {
        setSelectedInput(inputValue);
    };

    if (savedLayers) {
        const layers = Array.from(JSON.parse(savedLayers))

        return layers.map((layer) => <SavedLayerItem id={layer.id} handleChange={handleChange} selectedInput={selectedInput}/>)
    }

    return <></>
}

export default SavedLayers