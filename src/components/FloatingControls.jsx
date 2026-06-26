import { useNavigate, useLocation } from "react-router-dom";
import "../styles/FloatingControls.css";

const FloatingControls = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const showBack = location.pathname !== "/";

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="floating-controls">

      {showBack && (
        <button onClick={() => navigate(-1)}>
          ← Back
        </button>
      )}

      <button onClick={scrollToTop}>
        ↑ Top
      </button>

      <button onClick={scrollToBottom}>
        ↓ Down
      </button>

    </div>
  );
};

export default FloatingControls;