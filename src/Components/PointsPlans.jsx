import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const FALLBACK_PLANS = [
  { _id: 'points-100',  name: 'Starter',  price: 100, points: 100,  durationDays: 30, description: 'Great for trying things out' },
  { _id: 'points-200',  name: 'Standard', price: 200, points: 200,  durationDays: 60, description: 'Most common choice', popular: true },
  { _id: 'points-900',  name: 'Pro',      price: 900, points: 1000, durationDays: 180, description: 'Best value — 10% extra points' },
];

export default function PointsPlans() {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [cardData, setCardData] = useState(FALLBACK_PLANS);
  const [balance, setBalance] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState(null);

  const phoneNumber = location.state?.phoneNumber || localStorage.getItem('phoneNumber') || '';

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/points-plans`);
        if (!cancelled && Array.isArray(res.data) && res.data.length > 0) {
          setCardData(res.data);
        }
      } catch {
        // keep fallback
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!phoneNumber) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/points-balance/${phoneNumber}`);
        if (!cancelled) setBalance(res.data?.balance ?? 0);
      } catch {
        if (!cancelled) setBalance(0);
      }
    })();
    return () => { cancelled = true; };
  }, [phoneNumber]);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const confirmPlanSelection = (card, index) => {
    if (!phoneNumber) {
      setMessage({ text: 'Please login first', type: 'error' });
      navigate('/login');
      return;
    }
    setSelectedPlan({ card, index });
    setShowPopup(true);
  };

  const handleConfirmPlan = () => {
    if (!selectedPlan) return;
    const { card, index } = selectedPlan;
    setLoadingIndex(index);
    setShowPopup(false);

    navigate('/payu-form', {
      state: {
        phoneNumber,
        planName: card.name,
        planId: card._id,
        amount: card.price,
        points: card.points,
        planType: 'points',
      },
    });
  };

  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  ];

  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="row g-2 w-100">
          <h3 className="m-0 ms-3" style={{ fontSize: '20px' }}>Points Plans</h3>

          <div className="text-center mb-2 px-3 w-100">
            <p className="lead mb-1 pt-2" style={{ fontSize: '14px', color: '#666', fontWeight: 500, lineHeight: 1.6 }}>
              Buy points to unlock owner contact details. Each contact reveal costs <b>10 points</b>.
            </p>
            {balance !== null && (
              <div
                className="d-inline-block mt-2 px-3 py-2"
                style={{ background: '#EEF0FF', color: '#4F4B7E', borderRadius: 20, fontWeight: 600 }}
              >
                Your balance: {balance} points
              </div>
            )}
          </div>

          {message && (
            <p className="text-bold mt-2" style={{ color: message.type === 'success' ? 'green' : 'red', textAlign: 'center' }}>
              {message.text}
            </p>
          )}

          <div className="row justify-content-center w-100">
            {cardData.map((card, index) => (
              <div key={card._id || index} className="col-12 d-flex justify-content-center mb-4 p-0">
                <div
                  className="card shadow-lg rounded-4 border-0 pricing-card"
                  style={{
                    width: '72%',
                    background: gradients[index % gradients.length],
                    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: hoverIndex === index ? '0 25px 50px rgba(0,0,0,0.35)' : '0 10px 30px rgba(0,0,0,0.15)',
                    transform: hoverIndex === index ? 'translateY(-12px) scale(1.03)' : 'translateY(0) scale(1)',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                >
                  <div
                    className="card-body"
                    style={{
                      background: 'rgba(255,255,255,0.97)',
                      backdropFilter: 'blur(10px)',
                      borderRadius: 20,
                      margin: 12,
                      position: 'relative',
                      zIndex: 2,
                      padding: 24,
                    }}
                  >
                    {(card.popular || index === 1) && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -14,
                          right: 24,
                          background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                          color: '#fff',
                          padding: '8px 18px',
                          borderRadius: 25,
                          fontSize: 12,
                          fontWeight: 'bold',
                          boxShadow: '0 6px 20px rgba(255,165,0,0.5)',
                        }}
                      >
                        MOST POPULAR
                      </div>
                    )}

                    <h4 className="card-title text-start mt-1" style={{ color: '#4F4B7E', fontWeight: 'bold', fontSize: 28, marginBottom: 8 }}>
                      {card.name}
                    </h4>

                    <p className="text-start" style={{ fontSize: 15, color: '#888', marginBottom: 16, fontWeight: 500 }}>
                      {card.description || 'Points top-up'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: 8, gap: 8 }}>
                      <h2
                        className="text-start m-0"
                        style={{
                          fontSize: '2.5rem',
                          background: 'linear-gradient(135deg, #FF6B6B, #f5576c)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                          fontWeight: 'bold',
                        }}
                      >
                        ₹{card.price}
                      </h2>
                      <span style={{ fontSize: 14, color: '#999', fontWeight: 500, paddingBottom: 8 }}>one time</span>
                    </div>

                    <div
                      style={{
                        background: 'linear-gradient(135deg, rgba(102,126,234,0.08), rgba(245,87,108,0.08))',
                        padding: 14,
                        borderRadius: 14,
                        marginBottom: 20,
                        border: '1px solid rgba(102,126,234,0.15)',
                      }}
                    >
                      <h5 className="m-0 text-start" style={{ fontSize: 15, color: '#4F4B7E', fontWeight: 700, marginBottom: 8 }}>
                        What you get
                      </h5>
                      <p className="text-start m-0" style={{ color: '#555', fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>
                        • {card.points} points (≈ {Math.floor((card.points || 0) / 10)} owner contact reveals)
                      </p>
                      {card.durationDays && (
                        <p className="text-start m-0 mt-1" style={{ color: '#555', fontSize: 14, fontWeight: 500 }}>
                          • Valid for {card.durationDays} days
                        </p>
                      )}
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        className="pay-button btn pt-3 pb-3 ps-5 pe-5 rounded-pill"
                        style={{
                          background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
                          color: '#fff',
                          fontSize: 16,
                          fontWeight: 700,
                          border: 'none',
                          boxShadow:
                            hoverIndex === index && loadingIndex !== index
                              ? '0 15px 35px rgba(79,75,126,0.6)'
                              : '0 8px 20px rgba(79,75,126,0.4)',
                          transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                          cursor: loadingIndex === index ? 'not-allowed' : 'pointer',
                          opacity: loadingIndex === index ? 0.8 : 1,
                          transform: hoverIndex === index && loadingIndex !== index ? 'scale(1.08)' : 'scale(1)',
                          letterSpacing: '0.5px',
                          minWidth: 200,
                          width: '100%',
                        }}
                        onClick={() => confirmPlanSelection(card, index)}
                        disabled={loadingIndex === index}
                      >
                        {loadingIndex === index ? 'Processing...' : 'BUY POINTS'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
            <Modal.Body className="text-center" style={{ padding: 30 }}>
              <h5 style={{ marginBottom: 16, color: '#2a2a2a', fontWeight: 600 }}>Confirm Points Purchase</h5>
              {selectedPlan && (
                <p style={{ color: '#666', marginBottom: 24, fontSize: 15 }}>
                  Buy <b>{selectedPlan.card.points}</b> points for <b>₹{selectedPlan.card.price}</b>?
                </p>
              )}
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <Button
                  style={{ background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)', fontSize: 14, border: 'none', fontWeight: 600, padding: '8px 24px' }}
                  onClick={handleConfirmPlan}
                >
                  Yes, Pay Now
                </Button>
                <Button
                  style={{ background: '#E8E8E8', fontSize: 14, border: 'none', color: '#666', fontWeight: 600, padding: '8px 24px' }}
                  onClick={() => setShowPopup(false)}
                >
                  Cancel
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}
