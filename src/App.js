import './App.scss';
import Map from "./Components/Map";
import Menu from "./Components/Menu";
import { useEffect, useState } from "react";

const App = ()  => {

    const [filter, setFilter] = useState('')

  return (
      <div className='App'>
          <Menu filter={filter} setFilter={setFilter}/>
          <Map/>
      </div>
  );
}

export default App;
