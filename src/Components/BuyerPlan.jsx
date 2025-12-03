

import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import hom from "../Assets/addcarimg.png";
import { FaChevronLeft } from 'react-icons/fa';

export default function BuyerPlan({ phoneNumber: propPhoneNumber, Ra_Id: propRa_Id, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [hoverIndex, setHoverIndex] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [cardData, setCardData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState(null);

  // // Get phoneNumber and baId from props, location, or localStorage
  // const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  // const baId = propBaId || location.state?.baId || localStorage.getItem("baId") || "";

  const Ra_Id = propRa_Id || location.state?.Ra_Id || "";
const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";


  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setIsScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150); // Adjust the delay as needed
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  // Save fallback to localStorage
  useEffect(() => {
    if (phoneNumber) localStorage.setItem("phoneNumber", phoneNumber);
    if (Ra_Id) localStorage.setItem("Ra_Id", Ra_Id);
  }, [phoneNumber, Ra_Id]);

  // Record views for analytics
  useEffect(() => {
    if (phoneNumber) {
      axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
        phoneNumber,
        viewedFile: "Pricing Plans",
        viewTime: new Date().toISOString(),
      }).catch(() => {});
    }
  }, [phoneNumber]);

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Fetch active plans
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/buyer-plans-active`)
      .then((res) => {
        if (res.data.status === "success") {
          setCardData(res.data.plans || []);
        }
      })
      .catch(() => setCardData([]));
  }, []);

  const confirmPlanSelection = (card, index) => {
    setSelectedPlan({ card, index });
    setShowPopup(true);
  };

  const handleConfirmPlan = () => {
    if (!selectedPlan) return;
    const { card, index } = selectedPlan;

    if (!phoneNumber || !Ra_Id) {
      setMessage({ text: "Missing phone number or Tenant assistance ID (Ra_Id)", type: "error" });
      setShowPopup(false);
      return;
    }

    setLoadingIndex(index);
    setShowPopup(false);

    // Navigate to PayU form with required data
    navigate("/payu-form-buyer", {
      state: {
        phoneNumber,
        Ra_Id,
        planName: card.planName,
        planId: card._id,
        amount: card.planAmount,
      },
    });
  };


  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', width: '100%' }}>
              <div className="d-flex align-items-center justify-content-start w-100 p-2"      style={{
        background: "#EFEFEF",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        opacity: isScrolling ? 0 : 1,
        pointerEvents: isScrolling ? "none" : "auto",
        transition: "opacity 0.3s ease-in-out",
      }}>
              <button    
               className="d-flex align-items-center justify-content-center ps-3 pe-2"

      onClick={() => navigate(-1)}
      style={{
          background: "transparent",
      border: "none",
      height: "100%",color:"#CDC9F9",
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
  
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = '#f0f4f5'; // Change background
        e.currentTarget.querySelector('svg').style.color = '#4F4B7E'; // Change icon color
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = '#CDC9F9';
        e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
      }}
    >
      <FaChevronLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
         </button>          <h3 className="m-0 " style={{ fontSize: "18px" }}>Upgrade Tenant Membership</h3>
              </div>
        <div className="row g-2 w-100">
          <img src={hom} alt="pricing" className="w-100 mt-2 p-0" />

          {message && (
            <p
              className="text-bold mt-2"
              style={{ color: message.type === "success" ? "green" : "red", textAlign: "center" }}
            >
              {message.text}
            </p>
          )}

          <div className="text-center m-0">
            <p className="lead mb-1 pt-3" style={{ fontSize: "16px" }}>All the plan in our Rent Pondy is having validity date for your property to be in live for promotion purpose.</p>
            {/* <p className="lead" style={{ fontSize: "16px" }}>premium subscription plans</p> */}
          </div>

          <div className="row justify-content-center">
            {cardData.length === 0 ? (
              <p className="text-center">No active plans available.</p>
            ) : (
              cardData.map((card, index) => (
                <div key={card._id || index} className="col-12 d-flex justify-content-center mb-4 p-0">
                  <div
                    className="card rounded-3 border-0"
                    style={{
                      width: '72%',
                      backgroundColor: hoverIndex === index ? '#43BFFF' : '#A9D0FF',
                      transition: 'background-color 0.3s ease',
                      cursor: 'pointer',
                      boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
                    }}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <div className="card-body">
                      <h4 className="card-title text-start text-white"><strong>{card.planName}</strong></h4>
                      <p className="text-muted text-start" style={{ fontSize: "19px" }}>Service Type: {card.serviceType}</p>
                      <p className="text-muted text-start" style={{ fontSize: "19px" }}>Includes {card.numberOfAssistants} Assistant{card.numberOfAssistants > 1 ? 's' : ''}</p>
                      <h3 className="text-start text-danger" style={{ fontSize: '1.5rem' }}>₹ {card.planAmount}</h3>
                      <p className="text-start text-white mb-4" style={{ fontSize: '14px' }}>
                        Valid for {card.planValidity} Days
                      </p>
                      <h3 className="mb-2 text-start text-dark" style={{ fontSize: '20px' }}>Plan Status</h3>
                      <p className="text-muted text-start">{card.status}</p>
                      <h3 className="display-4 mb-4 text-start text-white" style={{ fontSize: '16px' }}>
                        Created: {new Date(card.createDate).toLocaleDateString()}
                      </h3>

                      <div className="d-flex justify-content-center">
                        <button
                          className="btn pt-1 pb-1 ps-3 pe-3 rounded-2"
                          style={{
                          backgroundColor: hoverIndex === index ? '#ffffff' : '#4F4B7E',
                          // background: '#4F4B7E',
                          color: hoverIndex === index ? '#4F4B7E' : '#fff',
                          //  color: '#fff', 
                           fontSize: "14px" }}
                          onClick={() => confirmPlanSelection(card, index)}
                          disabled={loadingIndex === index}
                        >
                          {loadingIndex === index ? 'Posting...' : 'Pay Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Confirmation Modal */}
          <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
            <Modal.Body className="text-center">
              <p>Are you sure you want to select this plan?</p>
              <Button
                style={{ background: "#4F4B7E", fontSize: "13px", border: "none" }}
                onClick={handleConfirmPlan}
              >
                Yes
              </Button>
              <Button
                className="ms-3"
                style={{ background: "#FF0000", fontSize: "13px", border: "none" }}
                onClick={() => setShowPopup(false)}
              >
                No
              </Button>
            </Modal.Body>
          </Modal>
        </div>
      </div>
    </div>
  );
}












// import React, { useState, useEffect } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button, Modal } from 'react-bootstrap';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import hom from "../Assets/addcarimg.png";
// import { FaArrowLeft } from 'react-icons/fa';

// export default function BuyerPlan({ phoneNumber: propPhoneNumber, baId: propBaId, onClose }) {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [hoverIndex, setHoverIndex] = useState(null);
//   const [loadingIndex, setLoadingIndex] = useState(null);
//   const [cardData, setCardData] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [message, setMessage] = useState(null);

//   // // Get phoneNumber and baId from props, location, or localStorage
//   // const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//   // const baId = propBaId || location.state?.baId || localStorage.getItem("baId") || "";

//   const baId = propBaId || location.state?.baId || "";
// const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";


//   const [isScrolling, setIsScrolling] = useState(false);

//   useEffect(() => {
//     let scrollTimeout;

//     const handleScroll = () => {
//       setIsScrolling(true);

//       clearTimeout(scrollTimeout);
//       scrollTimeout = setTimeout(() => {
//         setIsScrolling(false);
//       }, 150); // Adjust the delay as needed
//     };

//     window.addEventListener("scroll", handleScroll);

//     return () => {
//       clearTimeout(scrollTimeout);
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);
//   // Save fallback to localStorage
//   useEffect(() => {
//     if (phoneNumber) localStorage.setItem("phoneNumber", phoneNumber);
//     if (baId) localStorage.setItem("baId", baId);
//   }, [phoneNumber, baId]);

//   // Record views for analytics
//   useEffect(() => {
//     if (phoneNumber) {
//       axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//         phoneNumber,
//         viewedFile: "Pricing Plans",
//         viewTime: new Date().toISOString(),
//       }).catch(() => {});
//     }
//   }, [phoneNumber]);

//   // Clear message after 5 seconds
//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   // Fetch active plans
//   useEffect(() => {
//     axios.get(`${process.env.REACT_APP_API_URL}/buyer-plans-active`)
//       .then((res) => {
//         if (res.data.status === "success") {
//           setCardData(res.data.plans || []);
//         }
//       })
//       .catch(() => setCardData([]));
//   }, []);

//   const confirmPlanSelection = (card, index) => {
//     setSelectedPlan({ card, index });
//     setShowPopup(true);
//   };

//   const handleConfirmPlan = () => {
//     if (!selectedPlan) return;
//     const { card, index } = selectedPlan;

//     if (!phoneNumber || !baId) {
//       setMessage({ text: "Missing phone number or buyer assistance ID (baId)", type: "error" });
//       setShowPopup(false);
//       return;
//     }

//     setLoadingIndex(index);
//     setShowPopup(false);

//     // Navigate to PayU form with required data
//     navigate("/payu-form-buyer", {
//       state: {
//         phoneNumber,
//         baId,
//         planName: card.planName,
//         planId: card._id,
//         amount: card.planAmount,
//       },
//     });
//   };


//   return (
//     <div className="container d-flex align-items-center justify-content-center p-0">
//       <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', width: '100%' }}>
//       <div className="d-flex align-items-center justify-content-start w-100" 
//          style={{
//         background: "#EFEFEF",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         opacity: isScrolling ? 0 : 1,
//         pointerEvents: isScrolling ? "none" : "auto",
//         transition: "opacity 0.3s ease-in-out",
//       }}>
//        <button
//             onClick={() => navigate(-1)}
//             className="pe-5"
//             style={{
//               backgroundColor: '#f0f0f0',
//               border: 'none',
//               padding: '10px 20px',
//               cursor: 'pointer',
//               transition: 'all 0.3s ease-in-out',
//               display: 'flex',
//               alignItems: 'center',
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = '#f0f4f5'; // Change background
//               e.currentTarget.querySelector('svg').style.color = '#00B987'; // Change icon color
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = '#f0f0f0';
//               e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
//             }}
//           >
//             <FaArrowLeft style={{ color: '#4F4B7E', transition: 'color 0.3s ease-in-out' , background:"transparent"}} />
//       </button>          <h3 className="m-0 " style={{ fontSize: "20px" }}>Upgrade Buyer Membership</h3>
//               </div>
//         <div className="row g-2 w-100">
//           <img src={hom} alt="pricing" className="w-100 mt-2 p-0" />

//           {message && (
//             <p
//               className="text-bold mt-2"
//               style={{ color: message.type === "success" ? "green" : "red", textAlign: "center" }}
//             >
//               {message.text}
//             </p>
//           )}

//           <div className="text-center m-0">
//             <p className="lead mb-1 pt-3" style={{ fontSize: "16px" }}>Start being a celebrity with our</p>
//             <p className="lead" style={{ fontSize: "16px" }}>premium subscription plans</p>
//           </div>

//           <div className="row justify-content-center">
//             {cardData.length === 0 ? (
//               <p className="text-center">No active plans available.</p>
//             ) : (
//               cardData.map((card, index) => (
//                 <div key={card._id || index} className="col-12 d-flex justify-content-center mb-4 p-0">
//                   <div
//                     className="card rounded-3 border-0"
//                     style={{
//                       width: '72%',
//                       backgroundColor: hoverIndex === index ? '#43BFFF' : '#A9D0FF',
//                       transition: 'background-color 0.3s ease',
//                       cursor: 'pointer',
//                       boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
//                     }}
//                     onMouseEnter={() => setHoverIndex(index)}
//                     onMouseLeave={() => setHoverIndex(null)}
//                   >
//                     <div className="card-body">
//                       <h4 className="card-title text-start text-white"><strong>{card.planName}</strong></h4>
//                       <p className="text-muted text-start" style={{ fontSize: "19px" }}>Service Type: {card.serviceType}</p>
//                       <p className="text-muted text-start" style={{ fontSize: "19px" }}>Includes {card.numberOfAssistants} Assistant{card.numberOfAssistants > 1 ? 's' : ''}</p>
//                       <h3 className="text-start text-danger" style={{ fontSize: '1.5rem' }}>₹ {card.planAmount}</h3>
//                       <p className="text-start text-white mb-4" style={{ fontSize: '14px' }}>
//                         Valid for {card.planValidity} Days
//                       </p>
//                       <h3 className="mb-2 text-start text-dark" style={{ fontSize: '20px' }}>Plan Status</h3>
//                       <p className="text-muted text-start">{card.status}</p>
//                       <h3 className="display-4 mb-4 text-start text-white" style={{ fontSize: '16px' }}>
//                         Created: {new Date(card.createDate).toLocaleDateString()}
//                       </h3>

//                       <div className="d-flex justify-content-center">
//                         <button
//                           className="btn pt-1 pb-1 ps-3 pe-3 rounded-2"
//                           style={{
//                           backgroundColor: hoverIndex === index ? '#ffffff' : '#4F4B7E',
//                           // background: '#4F4B7E',
//                           color: hoverIndex === index ? '#4F4B7E' : '#fff',
//                           //  color: '#fff', 
//                            fontSize: "14px" }}
//                           onClick={() => confirmPlanSelection(card, index)}
//                           disabled={loadingIndex === index}
//                         >
//                           {loadingIndex === index ? 'Posting...' : 'Pay Now'}
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>

//           {/* Confirmation Modal */}
//           <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
//             <Modal.Body className="text-center">
//               <p>Are you sure you want to select this plan?</p>
//               <Button
//                 style={{ background: "#4F4B7E", fontSize: "13px", border: "none" }}
//                 onClick={handleConfirmPlan}
//               >
//                 Yes
//               </Button>
//               <Button
//                 className="ms-3"
//                 style={{ background: "#FF0000", fontSize: "13px", border: "none" }}
//                 onClick={() => setShowPopup(false)}
//               >
//                 No
//               </Button>
//             </Modal.Body>
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// }
