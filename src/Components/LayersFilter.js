import LayerButton from "./LayerButton";


const LayersFilter = () => {
    return (
        <>
            <div className={'LayersFilter'}>
                <LayerButton title={'Население'}/>
                <LayerButton title={'Объекты'}/>
            </div>
        </>
    );
}

export default LayersFilter;
