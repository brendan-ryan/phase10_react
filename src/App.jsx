import PlayerList from './components/PlayerList';
import Round from './components/Round';
import NumKey from  './components/NumKey';
import {useState} from 'react';
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
  const [phase, setPhase] = useState('PlayerInput');
  const [playerIndex, setPlayerIndex] = useState(0);
  const [dealerIndex, setDealerIndex] = useState(0);
  const [maxPhase, setMaxPhase] = useState(2);
  const [winner, setWinner] = useState('');

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
  if (phase === 'PlayerInput') {
    return (
      <>
      <div className="firstscreen">
        <div className="wrapper">
          <div className="playerlist">
            <PlayerList playerList={playerList} allFields={true}/>
          </div>
          <div>
            <label>
              Player Name 
                          </label>

              <input 
                value = {playerName}
                onLoad={setFocus}
                ref={inputRef}
                onChange={e => {
                  setPlayerName(e.target.value);
                }}
              />
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
      </div>
      </>
    );
  }
  if (phase === 'Round') {
    const currentDealer = playerList[dealerIndex].name;
    return (
      <div>
        <Round dealer={currentDealer} playerList={playerList} />

        <button
          className="endRound"
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
      <div>
        <div>
        <PlayerList playerList={playerList} allFields={true}/>
        </div>
        <div>
          <button
              className="playerAdvance"
              disabled>
              Did {currentPlayer} Phase?
          </button>
        </div>
        <div>
          <button
            className="yesNo"
            onClick={() => handleYesNo('Yes')}>
              Yes
          </button>
          <button
            className="yesNo"
            onClick={() => handleYesNo('No')}>
              No
          </button>
        </div>
      </div>
      </>
    )
  }

  if (phase === 'Score Input') {
    let currentPlayer = playerList[playerIndex].name;
    return (
      <>
        <PlayerList playerList={playerList} allFields={true}/>

        <button
            className="playerPoints"
            readOnly
            disabled>
            {currentPlayer}'s Points
        </button>

        <input 
          value = {playerScore}
        />

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
      </>
    )
  }

  if (phase === 'Final Score') {
    return (
      <>
        Winner: {winner}
        <PlayerList playerList={playerList} allFields={true}/>
      </>
    )
  }
}


