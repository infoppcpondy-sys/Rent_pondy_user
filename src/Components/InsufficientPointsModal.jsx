import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function InsufficientPointsModal({ show, onHide, balance = 0, required = 10 }) {
  const navigate = useNavigate();

  const goToPlans = () => {
    onHide?.();
    navigate('/points-plans');
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Body className="text-center" style={{ padding: 30 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B6B, #f5576c)',
            margin: '0 auto 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 32,
            fontWeight: 'bold',
          }}
        >
          !
        </div>
        <h5 style={{ marginBottom: 8, color: '#2a2a2a', fontWeight: 700 }}>Not enough points</h5>
        <p style={{ color: '#666', marginBottom: 20, fontSize: 15 }}>
          Viewing an owner's contact details costs <b>{required} points</b>.
          <br />
          Your current balance is <b>{balance} points</b>.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Button
            style={{
              background: 'linear-gradient(135deg, #4F4B7E 0%, #764ba2 100%)',
              fontSize: 14,
              border: 'none',
              fontWeight: 600,
              padding: '8px 24px',
            }}
            onClick={goToPlans}
          >
            Buy Points Plan
          </Button>
          <Button
            style={{ background: '#E8E8E8', fontSize: 14, border: 'none', color: '#666', fontWeight: 600, padding: '8px 24px' }}
            onClick={onHide}
          >
            Cancel
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
