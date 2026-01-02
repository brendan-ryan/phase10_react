import './PlayerCard.css';

function PlayerCard({playerList}) {
    if (!playerList || playerList.length === 0) {
        return null;
    } else {
        return (
            <>
                <div>
                    {playerList.map((player, index) => (
                        <Card key={index} playerName={player.name} phaseNumber={player.phase} points={player.points}/>
                    ))}
                </div>
            </>
        )
    }
}


function Card({playerName, phaseNumber, points}) {
    const phaseNames = [
        '2 sets of 3',
        '1 set of 3 + 1 run of 4',
        '1 set of 4 + 1 run of 4',
        '1 run of 7',
        '1 run of 8',
        '1 run of 9',
        '2 sets of 4',
        '7 cards of one color',
        '1 set of 5 + 1 set of 2',
        '1 set of 5 + 1 set of 3'
    ];

    const phaseName = phaseNames[phaseNumber - 1];

    return (
        <>
            <div className="player-card">
                <div className="player-card-text">
                    <div className="card-player-name">{playerName}</div>
                    <div>Phase: {phaseNumber}</div>
                    <div>Points: {points}</div>
                    <div>{phaseName}</div>
                </div>
            </div>
        </>
    )
}

export default PlayerCard;