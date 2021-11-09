
import { useState } from 'react';
import './App.css';


function App() {
  
  const [className, setclassName] = useState('randomImg');
  var audio = new Audio('kiss.wav');
  var audio1 = new Audio('happy.wav');

  return (
    <div className="App">
      <header className="App-header">
     <img src={process.env.PUBLIC_URL + '/hieu.png'}  className={className} onAnimationEndCapture={()=>{setclassName('stay')
     audio1.pause();
     audio.play();
    }} style={{left : 100, marginTop: -400}}/>

     <img src={process.env.PUBLIC_URL + '/ha.png'}  className={className} onAnimationEndCapture={()=>{setclassName('stay')
    }} style={{right : 100, marginTop: -400}}/>

        <div><img src={process.env.PUBLIC_URL + '/bob.png'} className="App-logo" alt="logo" />
        <img src={process.env.PUBLIC_URL + '/mo.png'} className="App-logo" alt="logo1" /></div>
        
        
        <p>
          Ấn vào đây này
        </p>
        <div id="heart" class='button' onClick={()=>{
          setclassName('dropping')
          audio1.play()
        }}></div>
      </header>
    </div>
  );
}

export default App;
