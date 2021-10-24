import loader from '../images/icons/loader.gif'

const Loader = ({color}) => {
    return (
        <div className={`Loader ${color}`}>
            <div className={`Loader-wrapper`}>
                <div className={'Loader__inner'}>
                    Пожалуйста, подождите, <br/>происходит обработка данных...
                    <img src={loader} alt=""/>
                </div>
            </div>
        </div>

    );
}

export default Loader;
