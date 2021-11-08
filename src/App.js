
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div><img src={process.env.PUBLIC_URL + '/bob.png'} className="App-logo" alt="logo" />
        <img src={process.env.PUBLIC_URL + '/mo.png'} className="App-logo" alt="logo1" /></div>
        <p>
          Em Hà iu ngủ ngon
        </p>
      </header>
    </div>
  );
}

export default App;
