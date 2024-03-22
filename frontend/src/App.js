import Navbar from './components/navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './Home';
import './App.css';
import './style.css'
// import ExampleComponent from './ExampleComponent';

function App(){

  return(
    <Router>
    <div className="App">
      <div className="navbar">
        <Navbar />        
      </div>
      <div className="content">
        {/* <ExampleComponent></ExampleComponent> */}
        <Home />
      </div>
    </div>
    </Router>
  );
}

export default App;