import SavedLayerItem from "./SavedLayerItem";


const SavedLayers = () => {
    const savedLayers = localStorage.getItem('saved_layers');
    if (savedLayers) {
        const layers = Array.from(JSON.parse(savedLayers))

        return layers.map((layer) => <SavedLayerItem id={layer.id}/>)
    }

    return <></>
}

export default SavedLayers