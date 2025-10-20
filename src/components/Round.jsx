import PlayerList from "./PlayerList";

function Round({dealer, playerList}) {
    return (
        <>
            <div>Dealer: {dealer}</div>
            <PlayerList playerList={playerList} allFields={false}/>
        </>
    )
}

export default Round;