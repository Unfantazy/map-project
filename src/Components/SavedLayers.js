import SavedLayerItem from "./SavedLayerItem";

const SavedLayers = ({ savedLayers, selectedInput, setSelectedInput }) => {
    const handleChange = inputValue => {
        setSelectedInput(inputValue);
    };

    if (savedLayers) {
        return savedLayers.map((layer) => <SavedLayerItem 
            id={layer.id} 
            title={layer.name} 
            handleChange={handleChange} 
            selectedInput={selectedInput}/>)
    }

    return <></>
}

export default SavedLayers