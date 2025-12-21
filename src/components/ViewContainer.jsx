import PlayerList from './PlayerList';
import Round from './Round';
import NumKey from  './NumKey';
import {useState, useEffect} from 'react';
import {useRef} from 'react';
import './ViewContainer.css';


function ViewContainer({currentState, handleState}) {
  /**
   * Set state variables
   */
  useEffect(() => {

    let playerList = localStorage.getItem('playerList');
    if (playerList && playerList.includes('name')) {
        const newPlayerList = JSON.parse(playerList);
        playerList && handleState('playerList', newPlayerList);

        const phase = localStorage.getItem('phase');
        phase && handleState('phase', phase);

        const playerIndex = Number(localStorage.getItem('playerIndex'));
        playerIndex && handleState('playerIndex', playerIndex);

        const dealerIndex = Number(localStorage.getItem('dealerIndex'));
        dealerIndex && handleState('dealerIndex', dealerIndex);
    }
  }, [1]);

  /**
   * Set the localStorage value
   */
  useEffect(() => {
    if (currentState.playerList.length > 0) {
        const newPlayerListStringReplacedBackslash = JSON.stringify(currentState.playerList).replace('/\\/g', '');
        localStorage.setItem('playerList', newPlayerListStringReplacedBackslash);
    }
  }, [currentState.playerList]);
  useEffect(() => {
    localStorage.setItem('phase', currentState.phase);
  }, [currentState.phase]);
  useEffect(() => {
    localStorage.setItem('playerIndex', currentState.playerIndex);
  }, [currentState.playerIndex]);
  useEffect(() => {
    localStorage.setItem('dealerIndex', currentState.dealerIndex);
  }, [currentState.dealerIndex]);

  const inputRef = useRef(null);

  function setFocus() {
    inputRef.current.focus();
  }

  // Event Handler
  function handleStartGame() {
    // When this executes, playerList goes away in localStorage
    // However, state still has playerList with values entered
    handleState('phase', 'Round'); 
  }

  // Event Handler
  function handleEndRound() {
    handleState('phase', 'PhaseInput');
  }

  // Event Handler
  function handleYesNo(choice) {
    if (choice === 'Yes') {
      updatePlayerStat('phase', 0);
    }
    handleState('phase', 'Score Input');
  }


  function incrementPlayerIndex() {
    if (currentState.playerIndex === currentState.playerList.length - 1) {
      return 0;
    } else {
      return (currentState.playerIndex + 1);
    }
  }

  // Pure Function - Return boolean isGameOver
  function isGameOver() {
    console.log('curentState.maxPhase: ' + currentState.maxPhase);
    return (
      currentState.playerList.some((nextPlayer) => nextPlayer.phase === currentState.maxPhase)
    );
  }

  /**
   * Need to handle ties
   */
  function findWinner() {
    let lowScore = 9999;
    let winnerName;
    currentState.playerList.forEach((player) => { // we don't need .map() -- use forEach instead
      if (Number(player.phase) === currentState.maxPhase && player.points < lowScore) {
        winnerName = player.name;
        lowScore = player.points;
      }
    });
    handleState('winner', winnerName);
  }

  // Set State
  function updatePlayerStat(stat, score) {
    let newPlayerList = [...currentState.playerList];
    if (stat === 'phase') {
      newPlayerList[currentState.playerIndex].phase += 1;
    } else {
      newPlayerList[currentState.playerIndex].points += score;
    }
    handleState('playerList', newPlayerList);
  }

  // Event Handler
  function handleAddPlayer(e) {
    e.preventDefault();
    if (currentState.playerName) {
      console.log('adding player');
      console.log('before we add a player, currentState.playerList: ' + JSON.stringify(currentState.playerList));
      handleState('playerList', [
      ...currentState.playerList,
      {name: currentState.playerName, phase: 1, points: 0}
    ]);
    inputRef.current.focus(); // Set's focus to the input field after each click
    handleState('playerName', ''); // Because the state variable is bound to the input field, I can just clear this value
    }
  }

  // Event Handler
  function handleNumKeyClick(num) {
    if (num == '<-') {
      let scoreString = currentState.playerScore.toString().slice(0, currentState.playerScore.toString().length-1);
      handleState('playerScore', Number(scoreString));
      validateScoreEntry(Number(scoreString));
    } else {
      const newVal = currentState.playerScore.toString().concat(num);
      handleState('playerScore', Number(newVal));
      validateScoreEntry(Number(newVal));
    }
  }

  function validateScoreEntry(newVal) {
    console.log('newVal: ' + newVal);
    console.log('newVal % 5: ' + newVal % 5);
    if (newVal % 5 !== 0) {
        document.getElementsByClassName("enter-button")[0].disabled = true;
    } else {
        document.getElementsByClassName("enter-button")[0].disabled = false;
    }
  }

  function findDealerIndex(previous) {
    if (previous < (currentState.playerList.length - 1)) {
      return (previous + 1);
    } else {
      return 0;
    }
  }

  // take playerScore as a param, pass in call to updatePlayerStat
  function handleEnterClick() {
    updatePlayerStat('score', currentState.playerScore);
    handleState('playerScore', 0);

    const newPlayerIndex = incrementPlayerIndex();
    handleState('playerIndex', newPlayerIndex);

    if (newPlayerIndex === 0 && isGameOver()) {
      findWinner();
      handleState('phase', 'Final Score');
      return;
    }

    if (newPlayerIndex === 0) {
      const newDealerIndex = findDealerIndex(currentState.dealerIndex);
      handleState('dealerIndex', newDealerIndex);
      handleState('phase', 'Round');
    } else {
      handleState('phase', 'PhaseInput');
    }
  }

  // function startNewGame() {
  //   if (confirm('Start new game?')) {
  //     localStorage.clear();

  //     setPlayerList([]);
  //     setPhase('Loading')
  //     setPlayerIndex(0);
  //     setDealerIndex(0);
  //     setWinner('');
  //   }
  // }

  /** ********************************************************************************************* */

  // Game Boards
  if (currentState.phase === 'Loading') {
    setTimeout(() => { 
      handleState('phase', 'PlayerInput'); 
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
  if (currentState.phase === 'PlayerInput') {
    // console.log('PlayerInput phase - playerList: ' + typeof currentState.playerList);
    // console.log('PlayerInput phase - playerList isArray?: ' + Array.isArray(currentState.playerList));
    return (
      <>
      <div className="boundary">
          <div className="playerlist">
            <PlayerList playerList={currentState.playerList} allFields={true}/>
          </div>
          <div className="input">

            <div>
              <label>
                Player Name 
              </label>
            </div>
            <div>
                <input 
                  value = {currentState.playerName}
                  onLoad={setFocus}
                  ref={inputRef}
                  onChange={e => {
                    handleState('playerName', e.target.value);
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
  if (currentState.phase === 'Round') {
    const currentDealer = currentState.playerList[currentState.dealerIndex].name;
    return (
      <div className="boundary">
        <div className="playerlist">
          <Round dealer={currentDealer} playerList={currentState.playerList} />
        </div>

        <button
          className="playerAdvance"
          onClick={handleEndRound}>
            End Round
        </button>

      </div>

    )
  }

  if (currentState.phase === 'PhaseInput') {
    let currentPlayer = currentState.playerList[currentState.playerIndex].name;
    return (
      <>
        <div className="boundary">
          <div className="wrapper">
            <div className="playerlist">
              <PlayerList playerList={currentState.playerList} allFields={true}/>
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

  if (currentState.phase === 'Score Input') {
    let currentPlayer = currentState.playerList[currentState.playerIndex].name;
    // declare local variable for playerScore
    return (
      <>
        <div className="boundary">
          <div className="wrapper">
            <div className="playerlist">
              <PlayerList playerList={currentState.playerList} allFields={true}/>
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

              <input className="input-field" value = {currentState.playerScore} readOnly/>

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
                {/* handleEnterClick passes playerScore as a param */}
                <NumKey value={0} onNumKeyClick={() => handleNumKeyClick(0)} />
                <NumKey value={'<-'} onNumKeyClick={() => handleNumKeyClick('<-')} />
              </div>
              <div className="NumKey-row">
                <NumKey className="enter-button" value={'ENTER'} onNumKeyClick={() => handleEnterClick()} />
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (currentState.phase === 'Final Score') {
    return (
      <>
      <div className="boundary">
          <div className="wrapper">
            <div className="playerlist">
              Winner: {currentState.winner}
              <PlayerList playerList={currentState.playerList} allFields={true}/>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default ViewContainer;
