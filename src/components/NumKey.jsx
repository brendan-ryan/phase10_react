function NumKey({value, onNumKeyClick}) {
    return <button className="number" onClick={onNumKeyClick}>{value}</button>;
}
export default NumKey;