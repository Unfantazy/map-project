const SavedLayerItem = ({id, title, handleChange, selectedInput}) => {
    return <button id={id} className={`FilterItem savedLayer ${selectedInput === id ? 'isActive' : ''}`} onClick={() => handleChange(id)}>
        <span>{id}. {title || 'Территория'}</span>
    </button>
}

export default SavedLayerItem