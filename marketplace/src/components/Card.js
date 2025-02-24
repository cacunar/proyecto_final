import { useNavigate } from "react-router-dom";
import "../styles/card.css";

function Card({ id, title, price, image }) {
  const navigate = useNavigate();

  // 🔹 Formato de precio en CLP
  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="card">
      <img src={image} alt={title} className="card-img" />
      <div className="card-body">
        <h3>{title}</h3>
        <p className="card-price">{formatPrice(price)}</p>
        <button onClick={() => navigate(`/post/${id}`)}>Ver más</button>
      </div>
    </div>
  );
}

export default Card;
