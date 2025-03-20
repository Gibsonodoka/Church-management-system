import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Unauthorized Access</h4>
        <p>You do not have permission to view this page.</p>
        <hr />
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Go Back to Home
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;