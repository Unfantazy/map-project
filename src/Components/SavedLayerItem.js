const SavedLayerItem = ({id, handleChange, selectedInput}) => {
    return <button className={`FilterItem ${selectedInput === id ? 'isActive' : ''}`} onClick={() => handleChange(id)}>
        <span>{id}. Тестовый слой</span>
    </button>
}

export default SavedLayerItem