function NumKey({value, onNumKeyClick, className}) {
    return <button className={className} onClick={onNumKeyClick}>{value}</button>;
}
export default NumKey;