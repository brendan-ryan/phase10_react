import PlayerList from './components/PlayerList';
import Round from './components/Round';
import NumKey from  './components/NumKey';
import {useState, useEffect} from 'react';
import {useRef} from 'react';
import './App.css';

export default function App() {
  
  /**
   * The player list lives in the Parent (here) and the values
   * are passed to the child (PlayerList), which is responsible
   * for rendering the list.
   */
  const [playerName, setPlayerName] = useState('');
  const [playerScore, setPlayerScore] = useState(0);
  const [playerList, setPlayerList] = useState([]);
  const [phase, setPhase] = useState('Loading');
  const [playerIndex, setPlayerIndex] = useState(0);
  const [dealerIndex, setDealerIndex] = useState(0);
  const [maxPhase, setMaxPhase] = useState(11);
  const [winner, setWinner] = useState('');

  // localStorage.clear();

  // useEffect(() => {
  //   console.log('useEffect - assigning state variables from localStorage');

  //   const playerList = localStorage.getItem('playerList');
  //   playerList && setPlayerList(JSON.stringify(playerList));

  //   const phase = localStorage.getItem('phase');
  //   phase && setPhase(phase);

  //   const playerIndex = localStorage.getItem('playerIndex');
  //   playerIndex && setPlayerIndex(playerIndex);

  //   const dealerIndex = localStorage.getItem('dealerIndex');
  //   dealerIndex && setDealerIndex(dealerIndex);
  // }, [1]);

  // useEffect(() => {
  //   console.log('Setting playerList');
  //   localStorage.setItem('playerList', JSON.stringify(playerList));
  //   console.log('localStorage.playerList: ' + localStorage.getItem('playerList'));
  // }, [playerList]);
  // useEffect(() => {
  //   console.log('Setting phase');
  //   localStorage.setItem('phase', phase);
  //   console.log('localStorage.phase: ' + localStorage.getItem('phase'));
  // }, [phase]);
  // useEffect(() => {
  //   console.log('Setting playerIndex');
  //   localStorage.setItem('playerIndex', playerIndex);
  // }, [playerIndex]);
  // useEffect(() => {
  //   console.log('Setting dealerList');
  //   localStorage.setItem('dealerIndex', dealerIndex);
  // }, [dealerIndex]);

  const inputRef = useRef(null);

  function setFocus() {
    inputRef.current.focus();
  }

  // Event Handler
  function handleStartGame() {
    setPhase('Round');
  }

  // Event Handler
  function handleEndRound() {
    setPhase('PhaseInput');
  }

  // Event Handler
  function handleYesNo(choice) {
    if (choice === 'Yes') {
      updatePlayerStat('phase', 0);
    }
    setPhase('Score Input');
  }


  function incrementPlayerIndex() {
    if (playerIndex === playerList.length - 1) {
      return 0;
    } else {
      return (playerIndex + 1);
    }
  }

  // Pure Function - Return boolean isGameOver
  function isGameOver() {
    return (
      playerList.some((nextPlayer) => nextPlayer.phase === maxPhase)
    );
  }

  /**
   * Need to handle ties
   */
  function findWinner() {
    let lowScore = 9999;
    let winnerName;
    playerList.map((player) => {
      if (Number(player.phase) === maxPhase && player.points < lowScore) {
        winnerName = player.name;
        lowScore = player.points;
      }
    });
    setWinner(winnerName);
  }

  // Set State
  function updatePlayerStat(stat, score) {
    let newPlayerList = [...playerList];
    if (stat === 'phase') {
      newPlayerList[playerIndex].phase += 1;
    } else {
      newPlayerList[playerIndex].points += score;
    }
    setPlayerList(newPlayerList);
  }

  // Event Handler
  function handleAddPlayer(e) {
    e.preventDefault();
    if (playerName) {
      setPlayerList([
      ...playerList,
      {name: playerName, phase: 1, points: 0}
    ]);
    inputRef.current.focus(); // Set's focus to the input field after each click
    setPlayerName(""); // Because the state variable is bound to the input field, I can just clear this value
    }
  }

  // Event Handler
  function handleNumKeyClick(num) {
    if (num == '<-') {
      let scoreString = playerScore.toString().slice(0, playerScore.toString().length-1);
      setPlayerScore(Number(scoreString));
    } else {
      const newVal = playerScore.toString().concat(num);
      setPlayerScore(Number(newVal));
    }
  }

  function findDealerIndex(previous) {
    if (previous < (playerList.length - 1)) {
      return (previous + 1);
    } else {
      return 0;
    }
  }

  function handleEnterClick() {
    updatePlayerStat('score', playerScore);
    setPlayerScore(0);

    const newPlayerIndex = incrementPlayerIndex();
    setPlayerIndex(newPlayerIndex);

    if (newPlayerIndex === 0 && isGameOver()) {
      findWinner();
      setPhase('Final Score');
      return;
    }

    if (newPlayerIndex === 0) {
      const newDealerIndex = findDealerIndex(dealerIndex);
      setDealerIndex(newDealerIndex);
      setPhase('Round');
    } else {
      setPhase('PhaseInput');
    }
  }

  // Game Boards
  if (phase === 'Loading') {
    setTimeout(() => { 
      setPhase('PlayerInput'); 
    }, 3000);

    return (
      <>
        <div className="boundary">
          
          <div className="centered-component">
            <p className="splashText">Phase 10</p>
          </div>
        </div>
      </>
        
    );
  }
  if (phase === 'PlayerInput') {
    return (
      <>
      <div className="boundary">
          <div className="playerlist">
            <PlayerList playerList={playerList} allFields={true}/>
          </div>
          <div className="input">

            <div>
              <label>
                Player Name 
              </label>
            </div>
            <div>
                <input 
                  value = {playerName}
                  onLoad={setFocus}
                  ref={inputRef}
                  onChange={e => {
                    setPlayerName(e.target.value);
                  }}
                />
            </div>
          </div>

            <div>
              <button
                className="add-player"
                onClick={handleAddPlayer}>
                  Add Player
              </button>
            </div>
            <div>
              <button
                className="start-game"
                onClick={handleStartGame}>
                  Start Game
              </button>
            </div>

        </div>
      </>
    );
  }
  if (phase === 'Round') {
    const currentDealer = playerList[dealerIndex].name;
    return (
      <div className="boundary">
        <div className="playerlist">
          <Round dealer={currentDealer} playerList={playerList} />
        </div>

        <button
          className="playerAdvance"
          onClick={handleEndRound}>
            End Round
        </button>

      </div>

    )
  }

  if (phase === 'PhaseInput') {
    let currentPlayer = playerList[playerIndex].name;
    return (
      <>
        <div className="boundary">
          <div className="wrapper">
            <div className="playerlist">
              <PlayerList playerList={playerList} allFields={true}/>
            </div>
            <div>
              <button
                  className="player-phase"
                  disabled>
                  Did {currentPlayer} Phase?
              </button>
              <div>
                <button
                  className="yes-button"
                  onClick={() => handleYesNo('Yes')}>
                    Yes
                </button>
                <button
                  className="no-button"
                  onClick={() => handleYesNo('No')}>
                    No
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (phase === 'Score Input') {
    let currentPlayer = playerList[playerIndex].name;
    return (
      <>
        <div className="boundary">
          <div className="wrapper">
            <div className="playerlist">
              <PlayerList playerList={playerList} allFields={true}/>
            </div>

            <div>
              <button
                  className="playerAdvance"
                  readOnly
                  disabled>
                  {currentPlayer}'s Points
              </button>
            </div>

            <div className="score-input-container">

              <input className="input-field" value = {playerScore} readOnly/>

              <div className="NumKey-row">
                <NumKey value={1} onNumKeyClick={() => handleNumKeyClick(1)} />
                <NumKey value={2} onNumKeyClick={() => handleNumKeyClick(2)} />
                <NumKey value={3} onNumKeyClick={() => handleNumKeyClick(3)} />
              </div>
              <div className="NumKey-row">
                <NumKey value={4} onNumKeyClick={() => handleNumKeyClick(4)} />
                <NumKey value={5} onNumKeyClick={() => handleNumKeyClick(5)} />
                <NumKey value={6} onNumKeyClick={() => handleNumKeyClick(6)} />
              </div>
              <div className="NumKey-row">
                <NumKey value={7} onNumKeyClick={() => handleNumKeyClick(7)} />
                <NumKey value={8} onNumKeyClick={() => handleNumKeyClick(8)} />
                <NumKey value={9} onNumKeyClick={() => handleNumKeyClick(9)} />
              </div>
              <div className="NumKey-row">
                <NumKey value={'ENTER'} onNumKeyClick={() => handleEnterClick()} />
                <NumKey value={0} onNumKeyClick={() => handleNumKeyClick(0)} />
                <NumKey value={'<-'} onNumKeyClick={() => handleNumKeyClick('<-')} />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (phase === 'Final Score') {
    return (
      <>
      <div className="boundary">
          <div className="wrapper">
            <div className="playerlist">
              Winner: {winner}
              <PlayerList playerList={playerList} allFields={true}/>
            </div>
          </div>
        </div>
      </>
    )
  }
}


