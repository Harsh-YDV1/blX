function HeritageCard({ name, state, desc }) {
  return (
    <div className="content-card">
      <h4>{name}</h4>
      <small>{state}</small>
      <p>{desc}</p>
    </div>
  );
}
export default HeritageCard;
