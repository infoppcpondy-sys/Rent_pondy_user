
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import profil from "../../Assets/xd_profile.png";
import {
  MdOutlineCall,
  MdOutlineMapsHomeWork,
  MdCalendarMonth,
  MdOutlineBed,
} from "react-icons/md";
import { RiStairsLine } from "react-icons/ri";
import { GoHome } from "react-icons/go";
import { TfiLocationPin } from "react-icons/tfi";
import maxrupe from "../../Assets/Price maxi-01.png";
import minrupe from "../../Assets/Price Mini-01.png";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import NoData from "../../Assets/OOOPS-No-Data-Found.png";

const BuyerAssisBuyer = () => {
  const [assistanceData, setAssistanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [noMatchMessage, setNoMatchMessage] = useState("");
  const [isScrolling, setIsScrolling] = useState(false);

  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const iconContainerRef = useRef(null);
  const location = useLocation();
  const storedPhoneNumber =
    location.state?.phoneNumber ||
    localStorage.getItem("phoneNumber") ||
    "";
  const [phoneNumber] = useState(storedPhoneNumber);

  // Hide header while scrolling
  useEffect(() => {
    let scrollTimeout;
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(scrollTimeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Record dashboard view
  useEffect(() => {
    const recordDashboardView = async () => {
      try {
        await axios.post(`${process.env.REACT_APP_API_URL}/record-views`, {
          phoneNumber,
          viewedFile: "Buyer Assis Buyer",
          viewTime: new Date().toISOString(),
        });
      } catch (err) {}
    };
    if (phoneNumber) recordDashboardView();
  }, [phoneNumber]);

  // Fetch Buyer Assistance + Payment data
  useEffect(() => {
    const fetchAllAssistanceData = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/buyer-assistance-with-payment-rent/${phoneNumber}`
        );

        const sortedData = response.data.data.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt) -
            new Date(a.updatedAt || a.createdAt)
        );

        setAssistanceData(sortedData);
      } catch (err) {
        setError("Error fetching assistance data");
      } finally {
        setLoading(false);
      }
    };
    if (phoneNumber) fetchAllAssistanceData();
  }, [phoneNumber]);

  const handlePayNow = (Ra_Id, phoneNumber) => {
    if (!Ra_Id || !phoneNumber) {
      setError("Missing Ra_Id or Phone Number");
      return;
    }
    navigate("/buyer-plan", {
      state: {
        Ra_Id,
        phoneNumber,
      },
    });
  };

  const handleWheelScroll = (e) => {
    if (scrollContainerRef.current) {
      e.preventDefault();
      scrollContainerRef.current.scrollTop += e.deltaY;
    }
  };

  const handleIconScroll = (e) => {
    if (iconContainerRef.current) {
      e.preventDefault();
      const scrollAmount = e.deltaX || e.deltaY;
      iconContainerRef.current.scrollLeft += scrollAmount;
    }
  };

  const formatIndianNumber = (x) => {
    x = x.toString();
    const lastThree = x.slice(-3);
    const otherNumbers = x.slice(0, -3);
    return (
      otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      (otherNumbers ? "," : "") +
      lastThree
    );
  };

  const formatPrice = (price) => {
    price = Number(price);
    if (isNaN(price)) return "N/A";

    if (price >= 10000000) {
      return (price / 10000000).toFixed(2) + " Cr";
    } else if (price >= 100000) {
      return (price / 100000).toFixed(2) + " Lakhs";
    } else {
      return formatIndianNumber(price);
    }
  };

  if (loading)
    return (
      <div className="text-center my-4">
        <span className="spinner-border text-primary" role="status" />
        <p className="mt-2">Loading properties...</p>
      </div>
    );

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center p-0"
      style={{ padding: "10px", gap: "15px", borderRadius: "10px" }}
      onWheel={handleWheelScroll}
      ref={scrollContainerRef}
    >
      <div className="d-flex flex-column" style={{ maxWidth: "500px", width: "100%" }}>
        <div
          className="d-flex align-items-center justify-content-start w-100 pt-2 pb-2"
          style={{
            background: "#EFEFEF",
            position: "sticky",
            top: 0,
            zIndex: 1000,
            opacity: isScrolling ? 0 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
        >
          <button
            onClick={() => navigate(-1)}
            className="pe-5"
            style={{
              backgroundColor: "#f0f0f0",
              border: "none",
              padding: "10px 20px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaArrowLeft style={{ color: "#30747F" }} />
          </button>
          <h3 className="m-0 ms-3" style={{ fontSize: "15px", fontWeight: "bold" }}>
            MY BUYER ASSISTANCE
          </h3>
        </div>

        {message && <div className="alert text-success fw-bold">{message}</div>}

        {assistanceData.length > 0 ? (
          assistanceData.map((card) => (
            <div
              key={card._id}
              className="card p-1 mt-1 mb-3"
              style={{ width: "100%", background: "#F9F9F9", overflow: "hidden" }}
            >
              <div className="row d-flex align-items-center">
                <div className="col-3 d-flex flex-column align-items-center justify-content-center mb-1">
                  <img
                    src={profil}
                    alt="Profile"
                    className="rounded-circle mt-2"
                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                  />
                  <span className="text-center" style={{ color: "blue", fontSize: "11px", fontWeight: 500 }}>
                    {card.ra_status}
                  </span>
                </div>

                <div className="p-0" style={{ background: "#707070", width: "1px", height: "80px" }}></div>

                <div className="col-7 p-0 ms-4">
                  <div className="d-flex justify-content-between">
                    <p className="m-0 text-muted" style={{ fontSize: "12px", fontWeight: "500" }}>
                      RA ID: {card.Ra_Id}
                    </p>
                    <p className="m-0 text-muted" style={{ fontSize: "12px", fontWeight: "500" }}>
                      <MdCalendarMonth size={12} className="me-2" color="#019988" />
                      {new Date(card.updatedAt || card.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <h5 className="mb-1" style={{ fontSize: "16px", color: "#000", fontWeight: "500" }}>
                    {card.raName || "N/A"} <span className="text-muted" style={{ fontSize: "12px" }}>| Buyer</span>
                  </h5>

                  <div className="d-flex align-items-center justify-content-between col-8">
                    <p className="mb-0 me-3 d-flex align-items-center" style={{ fontSize: "12px", fontWeight: 500 }}>
                      <img src={minrupe} alt="min" width={13} className="me-2" />
                      {formatPrice(card.minPrice)}
                    </p>
                    <p className="mb-0 d-flex align-items-center" style={{ fontSize: "12px", fontWeight: 500 }}>
                      <img src={maxrupe} alt="max" width={13} className="me-2" />
                      {formatPrice(card.maxPrice)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-1">
                <div
                  className="d-flex align-items-center overflow-auto mb-0 p-1 rounded-1"
                  style={{
                    whiteSpace: "nowrap",
                    minWidth: "100%",
                    overflowX: "auto",
                    border: "1px solid #019988",
                  }}
                  onWheel={handleIconScroll}
                  ref={iconContainerRef}
                >
                  <div className="d-flex align-items-center me-3">
                    <GoHome size={12} className="me-2" color="#019988" />
                    <p className="mb-0" style={{ fontSize: "12px" }}>
                      {card.propertyMode || "N/A"}
                    </p>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <MdOutlineMapsHomeWork size={12} className="me-2" color="#019988" />
                    <p className="mb-0" style={{ fontSize: "12px" }}>
                      {card.propertyType || "N/A"}
                    </p>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <MdCalendarMonth size={12} className="me-2" color="#019988" />
                    <p className="mb-0" style={{ fontSize: "12px" }}>
                      {card.paymentType || "N/A"}
                    </p>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <MdOutlineBed size={12} className="me-2" color="#019988" />
                    <p className="mb-0" style={{ fontSize: "12px" }}>
                      {card.bedrooms || "N/A"} BHK
                    </p>
                  </div>
                  <div className="d-flex align-items-center me-3">
                    <RiStairsLine size={12} className="me-2" color="#019988" />
                    <p className="mb-0" style={{ fontSize: "12px" }}>
                      {card.propertyAge || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mb-0 mt-1">
                  <p className="mb-0 fw-semibold" style={{ fontSize: "12px" }}>
                    <TfiLocationPin size={16} className="me-2" color="#019988" />
                    {card.area || "N/A"}, {card.city || "N/A"}
                  </p>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-2">
                  <div className="d-flex align-items-center">
                    <MdOutlineCall color="#019988" style={{ fontSize: "12px", marginRight: "8px" }} />
                    <h6 className="m-0 text-muted" style={{ fontSize: "12px" }}>
                      {card.phoneNumber
                        ? `Buyer Phone: ${card.phoneNumber.slice(0, -5)}*****`
                        : "Phone: N/A"}
                    </h6>
                  </div>

                  <div className="d-flex">
                    <button
                      className="btn text-white px-3 py-1 mx-1"
                      style={{ background: "#3660FF", fontSize: "13px" }}
                      onClick={() => navigate(`/detail-buyer-assis/${card.Ra_Id}`)}
                    >
                      View
                    </button>

                    {card.showPayNowButton && card.Ra_Id && card.phoneNumber && (
                      <button
                        className="btn btn-danger text-white px-3 py-1 mx-1"
                        style={{ fontSize: "13px" }}
                        onClick={() => handlePayNow(card.Ra_Id, card.phoneNumber)}
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="text-center my-4"
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <img src={NoData} alt="" width={100} />
            <p>No buyer assistance found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerAssisBuyer;
