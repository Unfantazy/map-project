import loader from '../images/icons/loader.gif'

const Loader = () => {
    return (
        <div className={'Loader'}>
            <div className={'Loader-wrapper'}>
                <img src={loader} alt=""/>
                <span>Происходит загрузка данных...</span>
            </div>
        </div>

    );
}

export default Loader;
