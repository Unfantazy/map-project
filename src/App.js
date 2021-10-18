import './App.scss';
import FiltersMenu from "./Components/FiltersMenu";
import Livemap from "./Components/Map";
import InfoBlock from "./Components/InfoBlock";

const App = () => {
    return (
        <div className='App'>
            {/*<LayersFilters />*/}
            <FiltersMenu/>
            <div className={'Map'}>
                <Livemap/>
            </div>
            <InfoBlock />
        </div>
    );
}

export default App;
