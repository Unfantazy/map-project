import SavedLayerItem from "./SavedLayerItem";
import {useState} from "react";


const SavedLayers = ({ savedLayers }) => {
    const [selectedInput, setSelectedInput] = useState(0);

    const handleChange = inputValue => {
        setSelectedInput(inputValue);
    };

    if (savedLayers) {
        return savedLayers.map((layer) => <SavedLayerItem id={layer.id} title={layer.name} handleChange={handleChange} selectedInput={selectedInput}/>)
    }

    return <></>
}

export default SavedLayers