import './PlayerList.css';

function PlayerList({playerList, allFields}) {    
    const playerRows = [];

    if (!playerList || playerList.length === 0) {
        return null;
    } else {
        return (
        <>
            <table className="tableHeader">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Phase</th>
                        {allFields && <th>Points</th>}
                    </tr>
                </thead>
                <tbody>
                    {playerList.map((player, index) => (
                        <Player key={index} playerRow={player} allFields={allFields}/>
                    ))}
                </tbody>
            </table>
        </>
        );

    }
}

function Player({playerRow, allFields}) {
    return (
        <tr className="tableHeader">
            <td>{playerRow.name}</td>
            <td>{playerRow.phase}</td>
            {allFields && <td>{playerRow.points}</td>}
        </tr>
    );
}


export default PlayerList;