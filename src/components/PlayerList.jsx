function PlayerList({playerList, allFields}) {    
    const playerRows = [];

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

function Player({playerRow, allFields}) {
    return (
        <tr className="tableHeader">
            <td>{playerRow.name}</td>
            <td>{playerRow.phase}</td>
            {allFields && <td>{playerRow.points}</td>}
        </tr>
    );
}

    // console.log('Player List Function: ' + value);
    // players.name.map((player, index) => (
    //     console.log('Player: ' + player)));
    
    // const superList = players.map((player) => {
    //     return {name: player, phase: 1, points: 0}
    // });

    // const playerList = [
    //         {name: 'Brendan', phase: 1, points: 0},
    //     {name: 'Emily', phase: 1, points: 0},
    //     {name: 'Mia', phase: 1, points: 0},
    //     {name: 'Enzo', phase: 1, points: 0}
    // ]


export default PlayerList;