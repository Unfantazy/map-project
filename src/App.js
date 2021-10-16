import './App.scss';
import FiltersMenu from "./Components/FiltersMenu";
import Livemap from "./Components/Map";

const App = () => {
    return (
        <div className='App'>
            {/*<LayersFilters />*/}
            <FiltersMenu/>
            <div className={'Map'}>
                <Livemap/>
            </div>
        </div>
    );
}

export default App;
