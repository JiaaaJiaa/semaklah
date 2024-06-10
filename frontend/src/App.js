import { useEffect } from 'react';
import Navbar from './components/navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './Home';
import './style.css'
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for react-toastify

function App(){

  useEffect(() => {
    document.title = 'SemakLah';
  }, []);

  return(
    <Router>
      <div className="App">
        <div className="navbar">
          <Navbar />        
        </div>
        <div className="h-auto min-h-screen bg-cyan-50">
          <Home />
        </div>
        <ToastContainer position="bottom-right"/> {/* Add ToastContainer here */}
      </div>
    </Router>
  );
}

export default App;