import Navbar from './components/navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './Home';
import './App.css';

function App(){

  return(
    <Router>
    <div className="App">
      <Navbar />
      <div className="content">
        <Home />
      </div>
    </div>
    </Router>
  );
}

export default App;