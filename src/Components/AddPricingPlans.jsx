







// import React, { useState, useEffect } from 'react'; 
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { Button, Modal } from 'react-bootstrap';
// import axios from 'axios';
// import { useLocation, useNavigate } from 'react-router-dom';
// import hom from "../Assets/addcarimg.png";
// import { FaArrowLeft } from 'react-icons/fa';

// export default function AddPricingPlans({ phoneNumber: propPhoneNumber, rentId: proprentId, onClose }) {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [hoverIndex, setHoverIndex] = useState(null);
//   const [loadingIndex, setLoadingIndex] = useState(null);
//   const [cardData, setCardData] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(null);
//   const [message, setMessage] = useState(null);

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
//   // Derive phoneNumber and rentId from props, location or localStorage
//   const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
//   const rentId = proprentId || location.state?.rentId || "";

//   useEffect(() => {
//     if (phoneNumber) {
//       axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
//         phoneNumber,
//         viewedFile: "Pricing Plans",
//         viewTime: new Date().toISOString(),
//       }).catch(() => {});
//     }
//   }, [phoneNumber]);

//   useEffect(() => {
//     if (message) {
//       const timer = setTimeout(() => setMessage(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [message]);

//   useEffect(() => {
//     fetchActivePlans();
//   }, []);

//   // Fetch plans and inject rentId into each plan object
//   const fetchActivePlans = async () => {
//     try {
//       const response = await axios.get(`${process.env.REACT_APP_API_URL}/active-plans`);
//       // Add rentId manually into each plan to avoid undefined
//       const plansWithrentId = response.data.map(plan => ({
//         ...plan,
//         rentId: rentId,
//       }));
//       setCardData(plansWithrentId);
//     } catch (err) {
//       setMessage({ text: "Failed to load plans", type: "error" });
//     }
//   };

//   const confirmPlanSelection = (card, index) => {
//     setSelectedPlan({ card, index });
//     setShowPopup(true);
//   };



// const handleConfirmPlan = async () => {
//   if (!selectedPlan) return;
//   const { card, index } = selectedPlan;

//   const rentIdNum = Number(card.rentId);
//   if (!phoneNumber || isNaN(rentIdNum)) {
//     setMessage({ text: "Missing or invalid phone number or rentId", type: "error" });
//     return;
//   }

//   setLoadingIndex(index);
//   setShowPopup(false);

//   // Navigate to PayUForm and pass data
//   navigate("/payu-form", {
//     state: {
//       phoneNumber,
//       rentId: rentIdNum,
//       planName: card.name,
//       planId: card._id,
//     amount: card.price  // ✅ Pass price as amount
//     }
//   });
// };

//   return (
//     <div className="container d-flex align-items-center justify-content-center p-0">
//       <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', width: '100%' }}>
              
//         <div className="row g-2 w-100">
//               <div className="d-flex align-items-center"
//                   style={{
//         background: "#EFEFEF",
//         position: "sticky",
//         top: 0,
//         zIndex: 1000,
//         opacity: isScrolling ? 0 : 1,
//         pointerEvents: isScrolling ? "none" : "auto",
//         transition: "opacity 0.3s ease-in-out",
//       }}>
//             <button
//               onClick={() => navigate(-1)}
//               style={{
//                 backgroundColor: '#f0f0f0',
//                 border: 'none',
//                 padding: '10px 20px',
//                 cursor: 'pointer',
//                 display: 'flex',
//                 alignItems: 'center',
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.backgroundColor = '#f0f4f5';
//                 e.currentTarget.querySelector('svg').style.color = '#00B987';
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.backgroundColor = '#f0f0f0';
//                 e.currentTarget.querySelector('svg').style.color = '#4F4B7E';
//               }}
//             >
//               <FaArrowLeft style={{ color: '#4F4B7E' }} />
//             </button>
//             <h3 className="ms-3" style={{ fontSize: "20px" }}>Add Pricing Plans</h3>
//           </div>

//           <img src={hom} alt="pricing" className="w-100 mt-2" />

//           {message && (
//             <p className="text-bold mt-2" style={{ color: message.type === "success" ? "green" : "red", textAlign: "center" }}>
//               {message.text}
//             </p>
//           )}

//           <div className="text-center mb-3">
//             <p className="lead mb-1 pt-3" style={{ fontSize: "16px" }}>Start being a celebrity with our</p>
//             <p className="lead" style={{ fontSize: "16px" }}>premium subscription plans</p>
//           </div>

//           <div className="row justify-content-center">
//             {cardData.map((card, index) => (
//               <div key={index} className="col-12 d-flex justify-content-center mb-4 p-0">
//                 <div
//                   className="card shadow-lg rounded-3 border-0"
//                   style={{
//                     width: '72%',
//                     backgroundColor: '#ADD9E6',
//                     transition: 'background-color 0.3s ease'
//                   }}
//                   onMouseEnter={() => setHoverIndex(index)}
//                   onMouseLeave={() => setHoverIndex(null)}
//                 >
//                   <div className="card-body">
//                     <h4 className="card-title text-start text-white"><strong>{card.name}</strong></h4>
//                     <p className="text-muted text-start" style={{ fontSize: "19px" }}>{card.packageType}</p>
//                     {/* <p className="text-muted text-start" style={{ fontSize: "19px" }}>UNLIMITED Property Leads</p> */}
//                     <h3 className="text-start text-danger" style={{ fontSize: '1.5rem' }}>₹ {card.price}</h3>
//                     <p className="text-start text-white mb-4" style={{ fontSize: '14px' }}>
//                       /{card.durationDays} Days / {card.numOfCars} Car{card.numOfCars > 1 ? 's' : ''}
//                     </p>
//                     <h3 className="mb-2 text-start text-dark" style={{ fontSize: '20px' }}> Featured Ads</h3>
//                     <p className="text-muted text-start">{card.description}</p>
//                     <h3 className="display-4 mb-4 text-start text-white" style={{ fontSize: '16px' }}>{card.featuredAds} FEATURED ADS</h3>
//                     <div className="d-flex justify-content-center">
//                       <button
//                         className="btn pt-1 pb-1 ps-3 pe-3 rounded-2"
//                         style={{ background: '#4F4B7E', color: '#fff', fontSize: "14px" }}
//                         onClick={() => confirmPlanSelection(card, index)}
//                         disabled={loadingIndex === index}
//                       >
//                         {loadingIndex === index ? 'Posting...' : 'Pay Now'}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Confirmation Modal */}
//           <Modal show={showPopup} onHide={() => setShowPopup(false)} centered>
//             <Modal.Body className="text-center">
//               <p>Are you sure you want to select this plan?</p>
//               <Button style={{ background: "#4F4B7E", fontSize: "13px", border: "none" }} onClick={handleConfirmPlan}>Yes</Button>
//               <Button className="ms-3" style={{ background: "#FF0000", fontSize: "13px", border: "none" }} onClick={() => setShowPopup(false)}>No</Button>
//             </Modal.Body>
//           </Modal>
//         </div>
//       </div>
//     </div>
//   );
// }





















import React, { useState, useEffect } from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import hom from "../Assets/rent_pricing.PNG";
import { FaArrowLeft, FaChevronLeft } from 'react-icons/fa';


export default function AddPricingPlans({ phoneNumber: propPhoneNumber, rentId: proprentId, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoverIndex, setHoverIndex] = useState(null);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [cardData, setCardData] = useState([]);
    const [cardBuyerData, setBuyerCardData] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [message, setMessage] = useState(null);

  // Derive phoneNumber and rentId from props, location or localStorage
  const phoneNumber = propPhoneNumber || location.state?.phoneNumber || localStorage.getItem("phoneNumber") || "";
  const rentId = proprentId || location.state?.rentId || "";
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


// Fetch buyer active plans from API
const fetchBuyerActivePlans = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/buyer-plans-active`);
    if (response.data.status === "success") {
      const plans = response.data.plans || [];
      // Add rentId manually into each plan
      const plansWithrentId = plans.map(plan => ({
        ...plan,
        rentId: rentId,
      }));
      setBuyerCardData(plansWithrentId);
    } else {
      setCardData([]);
      setMessage({ text: "No active plans found", type: "warning" });
    }
  } catch (err) {
    setCardData([]);
    setMessage({ text: "Failed to load Tenant plans", type: "error" });
  }
};


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

  const rentIdNum = Number(card.rentId);
  if (!phoneNumber || isNaN(rentIdNum)) {
    setMessage({ text: "Missing or invalid phone number or RENT ID", type: "error" });
    return;
  }

  setLoadingIndex(index);
  setShowPopup(false);
};

 const handleBackNavigation = () => {
    navigate("/mobileviews");
  };

  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
      <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="row g-2 w-100">
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
          </button>  
                              <h3 className="m-0" style={{ fontSize: "16px" }}> Your Property Plan</h3>
                            </div>


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



