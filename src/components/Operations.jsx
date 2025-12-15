function Operations({currentState, handleState}) {

    function startNewGame() {
        if (confirm('Start new game?')) {
            localStorage.clear();
            handleState('playerList', '');
        }
  }



    return (
        <button className='newGame' onClick={startNewGame}>New Game</button>
    )
}

export default Operations;