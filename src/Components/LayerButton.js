const LayerButton = ({child, title}) => {
    return (
        <div className={'LayerButton'}>
            {child || title}
        </div>

    );
}

export default LayerButton;
