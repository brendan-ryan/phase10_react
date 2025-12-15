import './App.css';
import Operations     from './components/Operations';
import ViewContainer  from './components/ViewContainer';
import {useState} from 'react';

export default function App() {
  let gameStats = {
    playerName: '',
    playerScore: 0,
    playerList: [],       // Object props: name, phase, points
    phase: 'Loading',
    playerIndex: 0,
    dealerIndex: 0,
    maxPhase: 11,
    winner: ''
  }
    // localStorage.clear();

    /**
     * One state variable that holds the object
     */
    const playerList = localStorage.getItem('playerList');
    if (playerList && playerList.includes('name')) {
      let phase = localStorage.getItem('phase') ? localStorage.getItem('phase') : 'Loading';
      let playerIndex = localStorage.getItem('playerIndex') ? Number(localStorage.getItem('playerIndex')) : 0;
      let dealerIndex = localStorage.getItem('dealerIndex') ? Number(localStorage.getItem('dealerIndex')) : 0;

      gameStats = {...gameStats, 
        'phase': phase, 
        'playerIndex': playerIndex,
        'dealerIndex': dealerIndex,
        'playerList': JSON.parse(playerList)};
    }

    const [state, setState] = useState(gameStats);
    
    function handleState(stateProp, value) {
      if (stateProp === 'playerList' && value === '') {
        gameStats = {...gameStats, 
        'phase': 'PlayerInput', 
        'playerIndex': 0,
        'dealerIndex': 0,
        'playerList': []};

        setState(gameStats);
      } else {
        setState(prev => ({ // Added 
          ...prev,
          [stateProp]: value
        }));
      }
    }
  
  return (
    <>
      <div className="ops-div">
      <Operations
        className="ops"
        currentState={state} 
        handleState={handleState}/>

      </div>
      <ViewContainer
        currentState={state} 
        handleState={handleState}/>
    </>
  );
}