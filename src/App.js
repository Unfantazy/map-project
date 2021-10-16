import './App.scss';
import FiltersMenu from "./Components/FiltersMenu";

const App = ()  => {
  return (
      <div className='App'>
          {/*<LayersFilters />*/}
          <FiltersMenu/>
          <div className={'Map'}>
          {/*<Livemap />*/}
          </div>
      </div>
  );
}

export default App;
