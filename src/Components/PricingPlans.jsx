



import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import hom from "../Assets/addcarimg.png";

export default function AddPricingPlans({ phoneNumber: propPhoneNumber, rentId: proprentId, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState(null);

  // Derive phoneNumber and rentId from props, location or localStorage
  const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const rentId = proprentId || location.state?.rentId || "";

  useEffect(() => {
    if (phoneNumber) {
      axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
        phoneNumber,
        viewedFile: "Pricing Plans",
        viewTime: new Date().toISOString(),
      }).catch(() => {});
    }
  }, [phoneNumber]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetchActivePlans();
  }, []);

  // Fetch plans and inject rentId into each plan object
  const fetchActivePlans = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/active-plans`);
      // Add rentId manually into each plan to avoid undefined
      const plansWithrentId = response.data.map(plan => ({
        ...plan,
        rentId: rentId,
      }));
      setCardData(plansWithrentId);
    } catch (err) {
      setMessage({ text: "Failed to load plans", type: "error" });
    }
  };

  const confirmPlanSelection = (card, index) => {
    setSelectedPlan({ card, index });
    setShowPopup(true);
  };


const handleConfirmPlan = async () => {
  if (!selectedPlan) return;
  const { card, index } = selectedPlan;

  if (!phoneNumber || !card.rentId) {
    setMessage({ text: "Missing phone number or rentId", type: "error" });
    return;
  }

  setLoadingIndex(index);
  setShowPopup(false);

  // Navigate to PayUForm and pass all required data
  navigate("/payu-form", {
    state: {
      phoneNumber,
      rentId: card.rentId, // Pass the rentId directly
      planName: card.name,
      planId: card._id,
      amount: card.price
    }
  });
};

  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="row g-2 w-100">
          <h3 className="m-0 ms-3" style={{ fontSize: "20px" }}>Upgrade Membership</h3>
          <img src={hom} alt="pricing" className="w-100 mt-2" />

          {message && (
            <p className="text-bold mt-2" style={{ color: message.type === "success" ? "green" : "red", textAlign: "center" }}>
              {message.text}
            </p>
          )}

          <div className="text-center mb-3">
            <p className="lead mb-1 pt-3" style={{ fontSize: "16px" }}>All the plan in our Rent Pondy is having validity date for your property to be in live for promotion purpose.</p>
            {/* <p className="lead" style={{ fontSize: "16px" }}>premium subscription plans</p> */}
          </div>

          <div className="row justify-content-center">
            {cardData.map((card, index) => (
              <div key={index} className="col-12 d-flex justify-content-center mb-4 p-0">
                <div
                  className="card shadow-lg rounded-3 border-0"
                  style={{
                    width: '72%',
                    backgroundColor: '#ADD9E6',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <div className="card-body">
                    <h4 className="card-title text-start text-white"><strong>{card.name}</strong></h4>
                    <p className="text-muted text-start" style={{ fontSize: "19px" }}>{card.packageType}</p>
                    {/* <p className="text-muted text-start" style={{ fontSize: "19px" }}>UNLIMITED Property Leads</p> */}
                    <h3 className="text-start text-danger" style={{ fontSize: '1.5rem' }}>₹ {card.price} <span style={{color:'#4F4B7E', fontSize:"14px"}}>RUPEES ONLY</span></h3>
                    <p className="text-start text-white mb-4" style={{ fontSize: '14px' }}>
                      /{card.durationDays} Days / {card.numOfCars} Property {card.numOfCars > 1 ? 's' : ''}
                    </p>
                    <h3 className="mb-2 text-start text-dark" style={{ fontSize: '20px' }}> Featured Ads</h3>
                    <p className="text-muted text-start">{card.description}</p>
                    <h3 className="display-4 mb-4 text-start text-white" style={{ fontSize: '16px' }}>{card.featuredAds} FEATURED ADS</h3>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn pt-1 pb-1 ps-3 pe-3 rounded-2"
                        style={{ background: '#4F4B7E', color: '#fff', fontSize: "14px" }}
                        onClick={() => confirmPlanSelection(card, index)}
                        disabled={loadingIndex === index}
                      >
                        {loadingIndex === index ? 'Posting...' : 'pay now '}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Confirmation Modal */}
          <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
            <Modal.Body className="text-center">
              <p>Are you sure you want to select this plan?</p>
              <Button style={{ background: "#4F4B7E", fontSize: "13px", border: "none" }} onClick={handleConfirmPlan}>Yes</Button>
              <Button className="ms-3" style={{ background: "#FF0000", fontSize: "13px", border: "none" }} onClick={() => setShowPopup(false)}>No</Button>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}



