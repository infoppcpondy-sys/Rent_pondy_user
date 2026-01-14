


import React, { useState, useEffect, useRef } from 'react';
import { FaHome, FaBuilding, FaLightbulb, FaUserCircle, FaRocket, FaCogs, FaInfoCircle, FaRegAddressCard, FaShare, FaStar, FaShieldAlt, FaUsers, FaEnvelope, FaRegBell, FaShippingFast } from 'react-icons/fa';
import logo from "../Assets/rentpondylogo.png";
import { useNavigate, useLocation } from 'react-router-dom';
import { MdClose, MdPolicy, MdRefresh } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";
import { RiApps2AiFill } from 'react-icons/ri';
import { HiDocumentText } from 'react-icons/hi2';
import { BiSolidLogIn } from 'react-icons/bi';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setPhoneNumber } from '../red/userSlice'; // Import your Redux action
import './NavbarAnimation.css';




const SidebarApp = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState([]);

  const [hasUnread, setHasUnread] = useState(false);
  const [hasClickedBell, setHasClickedBell] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);


  const handleMouseEnter = (linkId) => setHoveredLink(linkId);
  const handleMouseLeave = () => setHoveredLink(null);

  // Function to apply bold styling only to the hovered link
  const getLinkStyle = (linkId) => ({
    color: 'black',
    fontWeight: hoveredLink === linkId ? 'bold' : 'normal',
    transition: 'all 0.3s ease-in-out',
    transform: hoveredLink === linkId ? 'scale(1.1)' : 'scale(1)', // Slightly enlarge the link on hover

  });


  const handleRefresh = () => {
    window.location.reload(); // reloads the page
  };
  // ... inside your component ...

  const dispatch = useDispatch();

  const handleLogout = () => {
    // Clear Redux store
    dispatch(setPhoneNumber(null)); // Or use a dedicated logout action if you have one

    // Clear localStorage
    localStorage.removeItem('phoneNumber');

    // Redirect to login page
    navigate('/login');

    // Optional: Show logout success message
    // toast.success("Logged out successfully!");
  };


  const { phoneNumber: statePhoneNumber, countryCode: stateCountryCode } = location.state || {};
  const storedPhoneNumber = localStorage.getItem('phoneNumber');
  // const storedCountryCode = localStorage.getItem('countryCode');

  const phoneNumber = statePhoneNumber || storedPhoneNumber;
  // const countryCode = stateCountryCode || storedCountryCode;

  const fullPhoneNumber = `${phoneNumber}`;

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);





  const fetchUnreadNotifications = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-unread-notifications`, {
        params: { phoneNumber },
      });
      const unread = res.data.notifications || [];

      setNotifications(unread);
      setHasUnread(unread.length > 0);

    } catch (error) {
    }
  };

  useEffect(() => {
    if (phoneNumber) {
      fetchUnreadNotifications();
    }
  }, [phoneNumber]);

  const handleBellClick = () => {
    setHasClickedBell(true);
    navigate('/notification');

    // You can show the notifications dropdown or modal here
  };


  useEffect(() => {
    if (phoneNumber) {
      localStorage.setItem('phoneNumber', phoneNumber);
      // localStorage.setItem('countryCode', countryCode);
    } else {
    }
  }, [phoneNumber]);

  const handleLinkClick = (path) => {
    navigate(path, { state: { phoneNumber: fullPhoneNumber } });
    closeSidebar();
  };
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        closeSidebar();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSidebarOpen]);







  return (
    <div className="d-flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
     <div
  ref={sidebarRef}
  className={`position-fixed bg-light border-end ${isSidebarOpen ? "d-block" : "d-none"}`}
  style={{
    width: "300px",
    height: "auto",
    transition: "left 0.3s ease",
    zIndex: 2000,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  }}
>
  {/* Close Button */}
  <button
    className="btn position-absolute top-0 end-0 m-0"
    onClick={toggleSidebar}
    aria-label="Close Sidebar"
  >
    <MdClose />
  </button>

  {/* Header Section */}
  <div
    style={{
      background: "#24ad92ff",
      flexShrink: 0,
      padding: "10px",
    }}
    className="d-flex align-items-center w-100"
  >
    <img
      src={logo}
      alt="Logo"
      style={{ height: "80px", width: "80px" }}
      className="mb-2 mb-md-0 rounded-4"
    />

    <div className="ms-md-3 ms-2">
      <h6 style={{ margin: 0 }}>
        <span style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}>RENT</span>
        <span style={{ color: "white", fontWeight: "bold", fontSize: "18px" }}> PONDY</span>
      </h6>

      <p style={{ color: "white", fontSize: "13px" }}>
        Find Your dream House Here!
      </p>

      {/* Phone Number as Text only */}
      {phoneNumber && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "-8px" }}>
          <FaPhone style={{ color: "white", fontSize: "14px" }} />
          <p style={{ color: "white", fontSize: "14px", margin: 0 }}>
            {fullPhoneNumber}
          </p>
        </div>
      )}
    </div>
  </div>

  {/* Sidebar Menu */}
  <div
    className="row g-2 mt-1"
    style={{
      background: "#ffffff",
      overflowY: "scroll",
      scrollbarWidth: "none",
      width: "300px",
      height: "75vh",
    }}
  >
    <ul className="nav flex-column pb-5 w-100">

      {/* ⭐ Only ONE My Profile button */}
      <li className="nav-item">
        <a
          className="nav-link"
          style={getLinkStyle("my-profile")}
          onMouseEnter={() => handleMouseEnter("my-profile")}
          onMouseLeave={handleMouseLeave}
          href={`/my-profile/${phoneNumber}`}
          onClick={() => handleLinkClick(`/my-profile/${phoneNumber}`)}
        >
          <FaUserCircle className="me-2" style={{ color: "#4F4B7E" }} /> My Profile
        </a>
      </li>

      {/* ⭐ My Property */}
      <li className="nav-item">
        <a
          className="nav-link"
          style={getLinkStyle("my-property")}
          onMouseEnter={() => handleMouseEnter("my-property")}
          onMouseLeave={handleMouseLeave}
          href="/my-property"
          onClick={() => handleLinkClick("/my-property")}
        >
          <FaBuilding className="me-2" style={{ color: "#4F4B7E" }} /> My Property
        </a>
      </li>
            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('my-plan')}
                onMouseEnter={() => handleMouseEnter('my-plan')}
                onMouseLeave={handleMouseLeave}
                href={`/my-plan`}
                onClick={() => handleLinkClick(`/my-plan`)}
              >
                <FaLightbulb className="me-2" style={{ color: '#4F4B7E' }} /> My Plan
              </a>
            </li>


            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('plans')}
                onMouseEnter={() => handleMouseEnter('plans')}
                onMouseLeave={handleMouseLeave}
                href="/add-plan"
                onClick={() => handleLinkClick("/add-plan")}
              >
                <FaRocket className="me-2" style={{ color: '#4F4B7E' }} /> Pricing Plans
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('buyer plans')}
                onMouseEnter={() => handleMouseEnter('buyer plans')}
                onMouseLeave={handleMouseLeave}
                href="/my-buyer-plan"
                onClick={() => handleLinkClick("/my-buyer-plan")}
              >
                <FaRocket className="me-2" style={{ color: '#4F4B7E' }} />My Tenant Assistant Plan
              </a>
            </li>


            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('owner menu')}
                onMouseEnter={() => handleMouseEnter('owner menu')}
                onMouseLeave={handleMouseLeave}
                href="/owner-menu"
                onClick={() => handleLinkClick("/owner-menu")}
              >
                <FaCogs className="me-2" style={{ color: '#4F4B7E' }} /> Owner Menu
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('buyer menu')}
                onMouseEnter={() => handleMouseEnter('buyer menu')}
                onMouseLeave={handleMouseLeave}
                href="/buyer-menu"
                onClick={() => handleLinkClick("/buyer-menu")}
              >
                <FaCogs className="me-2" style={{ color: '#4F4B7E' }} />  Tenant Menu
              </a>
            </li>


            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('more')}
                onMouseEnter={() => handleMouseEnter('more')}
                onMouseLeave={handleMouseLeave}
                href="/more"
                onClick={() => handleLinkClick("/more")}
              >
                <FaCogs className="me-2" style={{ color: '#4F4B7E' }} /> More
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('contactus')}
                onMouseEnter={() => handleMouseEnter('contactus')}
                onMouseLeave={handleMouseLeave}
                href="/contactus"
                onClick={() => handleLinkClick("/contactus")}
              >
                <FaPhone className="me-2" style={{ color: '#4F4B7E' }} /> Contact Us
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('about-us')}
                onMouseEnter={() => handleMouseEnter('about-us')}
                onMouseLeave={handleMouseLeave}
                href="/about-mobile"
                onClick={() => handleLinkClick("/about-mobile")}
              >
                <FaInfoCircle className="me-2" style={{ color: '#4F4B7E' }} /> About Us
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('refund-policy')}
                onMouseEnter={() => handleMouseEnter('refund-policy')}
                onMouseLeave={handleMouseLeave}
                href="/refund-mobile"
                onClick={() => handleLinkClick("/refund-mobile")}
              >
                <MdPolicy className="me-2" style={{ color: '#4F4B7E' }} /> Refund Policy
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('terms-conditions')}
                onMouseEnter={() => handleMouseEnter('terms-conditions')}
                onMouseLeave={handleMouseLeave}
                href="/terms-conditions"
                onClick={() => handleLinkClick("/terms-conditions")}
              >
                <HiDocumentText className="me-2" style={{ color: '#4F4B7E' }} /> Terms And Conditions
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('shiping-delivery')}
                onMouseEnter={() => handleMouseEnter('shiping-delivery')}
                onMouseLeave={handleMouseLeave}
                href="/shiping-delivery-app"
                onClick={() => handleLinkClick("/shiping-delivery-app")}
              >
                <FaShippingFast className="me-2" style={{ color: '#4F4B7E' }} />Shipping & Delivery
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('more-app')}
                onMouseEnter={() => handleMouseEnter('more-app')}
                onMouseLeave={handleMouseLeave}
                href="https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en"
                target="_blank"
                rel="noopener noreferrer"
              // onClick={() => handleLinkClick("https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en")}
              >
                <RiApps2AiFill className="me-2" style={{ color: '#4F4B7E' }} /> More App
              </a>
            </li>
            {/* <li className="nav-item">
  <button
    className="nav-link"
    style={{
      ...getLinkStyle('more-app'),
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    }}
    onMouseEnter={() => handleMouseEnter('more-app')}
    onMouseLeave={handleMouseLeave}
    onClick={() =>
      window.open(
        'https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en',
        '_system' // or '_blank' as fallback
      )
    }
  >
    <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> More App
  </button>
</li> */}

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('share-app')}
                onMouseEnter={() => handleMouseEnter('share-app')}
                onMouseLeave={handleMouseLeave}
                href="https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
              // onClick={() => handleLinkClick("https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en")}
              >
                <FaShare className="me-2" style={{ color: '#4F4B7E' }} /> Share App
              </a>

            </li>
            {/* <li className="nav-item">
  <button
    className="nav-link"
    style={{
      ...getLinkStyle('share-app'),
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    }}
    onMouseEnter={() => handleMouseEnter('share-app')}
    onMouseLeave={handleMouseLeave}
    onClick={() =>
      window.open(
        'https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share',
        '_system' // or '_blank' as fallback
      )
    }
  >
    <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Share App
  </button>
</li> */}

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('rate-app')}
                onMouseEnter={() => handleMouseEnter('rate-app')}
                onMouseLeave={handleMouseLeave}
                href="https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
              // onClick={() => handleLinkClick("https://play.google.com/store/apps/details?id=com.deepseek.chat&hl=en#review")}
              >
                <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Rate App
              </a>
            </li>
            {/* <li className="nav-item">
  <button
    className="nav-link"
    style={{
      ...getLinkStyle('rate-app'),
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    }}
    onMouseEnter={() => handleMouseEnter('rate-app')}
    onMouseLeave={handleMouseLeave}
    onClick={() =>
      window.open(
        'https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share',
        '_system' // or '_blank' as fallback
      )
    }
  >
    <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Rate App
  </button>
</li> */}

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('business')}
                onMouseEnter={() => handleMouseEnter('business')}
                onMouseLeave={handleMouseLeave}
                href="/business"
                onClick={() => handleLinkClick("/business")}
              >
                <FaShieldAlt className="me-2" style={{ color: '#4F4B7E' }} /> Business Opportunity
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                style={getLinkStyle('our-support')}
                onMouseEnter={() => handleMouseEnter('our-support')}
                onMouseLeave={handleMouseLeave}
                href="/our-support"
                onClick={() => handleLinkClick("/our-support")}
              >
                <FaUsers className="me-2" style={{ color: '#4F4B7E' }} /> Our Support
              </a>
            </li>



            {/* <li className="nav-item">
  <button
    className="nav-link border-0 bg-transparent w-100 text-start p-0"
    style={getLinkStyle('logout')}
    onMouseEnter={() => handleMouseEnter('logout')}
    onMouseLeave={handleMouseLeave}
    onClick={handleLogout}
  >
    <BiSolidLogIn className="ms-3 me-2" style={{ color: '#4F4B7E' }} /> 
    Logout
  </button>
</li> */}

            <li className="nav-item">
              <button
                className="nav-link border-0 bg-transparent w-100 text-start p-0"
                style={getLinkStyle('logout')}
                onMouseEnter={() => handleMouseEnter('logout')}
                onMouseLeave={handleMouseLeave}
                onClick={() => setShowConfirm(true)} // show popup
              >
                <BiSolidLogIn className="ms-3 me-2" style={{ color: '#4F4B7E' }} />
                Logout
              </button>
            </li>
            {/* Confirmation Popup */}
            {showConfirm && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  // width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 3000,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pointerEvents: 'auto',
                  minWidth: '280px',

                }}
              >
                <div
                  style={{
                    backgroundColor: '#fff',
                    padding: '20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',

                    textAlign: 'center',
                  }}
                >
                  <h5 className="text-center" style={{ fontSize: "13px" }}>Are you sure you want to logout?</h5>
                  <div className="d-flex justify-content-between gap-3">
                    <button className="btn px-4" style={{ background: "blue", color: "#fff" }} onClick={handleLogout}>Yes</button>
                    <button className="btn px-4" style={{ background: "white", color: "blue", boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)', }} onClick={() => setShowConfirm(false)}>No</button>
                  </div>
                </div>
              </div>
            )}
          </ul>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Navbar */}
        <nav
          className="navbar navbar-light bg-light d-flex align-items-center justify-content-between px-3"
          style={{ width: '100%', height: '60px', display: 'flex', gap: '10px', position: 'relative' }}
        >
          {/* Centered Animation */}
          <div className="navbar-intro-container">
            <div className="house">
              <div className="roof"></div>
              <div className="title">
                <span className="rent">RENT</span>
                <span className="pondy">PONDY</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="btn" 
              onClick={toggleSidebar}
              style={{ color: "black", fontSize: "24px", padding: "0" }}
              aria-label="Toggle Menu"
            >
              ☰
            </button>
          </div>
          
          <div style={{ flex: 1 }}></div>


          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: "10px" }}>
            <button 
              onClick={handleRefresh} 
              style={{ 
                padding: "4px 6px", 
                cursor: "pointer", 
                background: "#A0A0A0",
                border: "none",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                width: "32px",
                height: "32px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1) rotate(20deg)";
                e.currentTarget.style.background = "#808080";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1) rotate(0deg)";
                e.currentTarget.style.background = "#A0A0A0";
              }}
              title="Refresh Page"
              aria-label="Refresh"
            >
              <MdRefresh size={20} color="white" />
            </button>
            <button className="btn border-0" style={{ fontWeight: "bold", padding: "8px 12px", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={handleBellClick}>
              <FaRegBell color="#4F4B7E" size={24} />
            </button>

            {/* Show red badge only if there are unread notifications AND user hasn’t clicked yet */}
            {hasUnread && !hasClickedBell && (
              <span
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "10px",
                  height: "10px",
                  backgroundColor: "red",
                  borderRadius: "50%",
                  zIndex: 1,
                }}
              ></span>
            )}
          </div>


        </nav>
      </div>
    </div>
  );
};

export default SidebarApp;










// import React, { useState, useEffect, useRef } from 'react';
// import { FaHome, FaBuilding, FaLightbulb, FaUserCircle, FaRocket, FaCogs, FaInfoCircle, FaRegAddressCard, FaShare, FaStar, FaShieldAlt, FaUsers, FaEnvelope, FaRegBell, FaShippingFast } from 'react-icons/fa';
// import logo from "../Assets/rentpondylogo.png";
// import { useNavigate, useLocation } from 'react-router-dom';
// import { MdClose, MdOutlineRefresh, MdPolicy } from "react-icons/md";
// import { FaPhone } from "react-icons/fa6";
// import { RiApps2AiFill } from 'react-icons/ri';
// import { HiDocumentText } from 'react-icons/hi2';
// import { BiSolidLogIn } from 'react-icons/bi';
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { setPhoneNumber } from '../red/userSlice'; // Import your Redux action




// const SidebarApp = () => {
//   const [isSidebarOpen, setSidebarOpen] = useState(false);
//   const sidebarRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [hoveredLink, setHoveredLink] = useState(null);
//   const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [notifications, setNotifications] = useState([]);

//     const [hasUnread, setHasUnread] = useState(false);
//     const [hasClickedBell, setHasClickedBell] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);


//   const handleMouseEnter = (linkId) => setHoveredLink(linkId);
//   const handleMouseLeave = () => setHoveredLink(null);

//   // Function to apply bold styling only to the hovered link
//   const getLinkStyle = (linkId) => ({
//     color: 'black',
//     fontWeight: hoveredLink === linkId ? 'bold' : 'normal',
//     transition: 'all 0.3s ease-in-out',
//     transform: hoveredLink === linkId ? 'scale(1.1)' : 'scale(1)', // Slightly enlarge the link on hover

//   });


//     const handleRefresh = () => {
//     window.location.reload(); // reloads the page
//   };
// // ... inside your component ...

// const dispatch = useDispatch();

// const handleLogout = () => {
//   // Clear Redux store
//   dispatch(setPhoneNumber(null)); // Or use a dedicated logout action if you have one
  
//   // Clear localStorage
//   localStorage.removeItem('phoneNumber');
  
//   // Redirect to login page
//   navigate('/login');
  
//   // Optional: Show logout success message
//   // toast.success("Logged out successfully!");
// };


//   const { phoneNumber: statePhoneNumber, countryCode: stateCountryCode } = location.state || {};
//   const storedPhoneNumber = localStorage.getItem('phoneNumber');
//   // const storedCountryCode = localStorage.getItem('countryCode');

//   const phoneNumber = statePhoneNumber || storedPhoneNumber;
//   // const countryCode = stateCountryCode || storedCountryCode;

//   const fullPhoneNumber = `${phoneNumber}`;

//   const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
//   const closeSidebar = () => setSidebarOpen(false);





//   const fetchUnreadNotifications = async () => {
//     try {
//       const res = await axios.get(`${process.env.REACT_APP_API_URL}/get-unread-notifications`, {
//         params: { phoneNumber },
//       });
//       const unread = res.data.notifications || [];

//       setNotifications(unread);
//       setHasUnread(unread.length > 0);

//     } catch (error) {
//     }
//   };

//   useEffect(() => {
//     if (phoneNumber) {
//       fetchUnreadNotifications();
//     }
//   }, [phoneNumber]);

//   const handleBellClick = () => {
//     setHasClickedBell(true);
//     navigate('/notification');

//     // You can show the notifications dropdown or modal here
//   };


//   useEffect(() => {
//     if (phoneNumber ) {
//       localStorage.setItem('phoneNumber', phoneNumber);
//       // localStorage.setItem('countryCode', countryCode);
//     } else {
//     }
//   }, [phoneNumber]);

//   const handleLinkClick = (path) => {
//     navigate(path, { state: { phoneNumber: fullPhoneNumber } });
//     closeSidebar();
//   };
//   useEffect(() => {
//     const handleOutsideClick = (event) => {
//       if (
//         isSidebarOpen &&
//         sidebarRef.current &&
//         !sidebarRef.current.contains(event.target)
//       ) {
//         closeSidebar();
//       }
//     };

//     document.addEventListener('mousedown', handleOutsideClick);
//     return () => {
//       document.removeEventListener('mousedown', handleOutsideClick);
//     };
//   }, [isSidebarOpen]);







//   return (
// <div className="d-flex" style={{ fontFamily: "Inter, sans-serif" }}>
//   {/* Sidebar */}
//   <div
//     ref={sidebarRef}
//     className={`position-fixed bg-light border-end ${isSidebarOpen ? "d-block" : "d-none"}`}
//     style={{
//       width: "300px",
//       height: "auto", 
//       transition: "left 0.3s ease",
//       zIndex: 2000,
//       display: "flex",
//       flexDirection: "column",
//       overflow: "hidden", // Prevents children from exceeding
//     }}
//   >
//     <button
//       className="btn position-absolute top-0 end-0 m-0"
//       onClick={toggleSidebar}
//       aria-label="Close Sidebar"
//     >
//       <MdClose />
//     </button>

//     {/* Fixed Header */}
//     <div
//       style={{
//         background: "#4F4B7E",
//         flexShrink: 0, // Prevents header from shrinking
//         padding: "10px",
//       }}
//       className="d-flex align-items-center w-100"
//     >
//       <img
//         src={logo}
//         alt="Logo"
//         style={{ height: "80px", width: "80px" }}
//         className="mb-2 mb-md-0 rounded-4"
//       />
//       <div className="ms-md-3 ms-2">
//         <h6 style={{ color: "white" }}>Rent Pondy</h6>
//         <p style={{ color: "white", fontSize: "13px" }}>
// Find Your rental property-Rent your property, Fast.        </p>
//       </div>
//     </div>
//     <div className="row g-2 mt-1"
//      style={{background:"#ffffff", overflowY: "scroll", scrollbarWidth: "none" , width:"300px", height: "75vh", }}>
//     <ul className="nav flex-column pb-5 w-100 ">


//       {/* Phone number in sidebar */}
//       {phoneNumber && (
//         <li className="nav-item">
//           <a
//             className="nav-link"
//             style={getLinkStyle('phone')}
//             onMouseEnter={() => handleMouseEnter('phone')}
//             onMouseLeave={handleMouseLeave}
//             href="/mobileviews"
//             onClick={() => handleLinkClick("/mobileviews")}
//           >
//             <FaPhone className="me-2" style={{ color: '#4F4B7E' }} />
//             {fullPhoneNumber}
//           </a>
//         </li>
//       )}

//       {/* Sidebar links with hover effect */}
    
//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('my-profile')}
//           onMouseEnter={() => handleMouseEnter('my-profile')}
//           onMouseLeave={handleMouseLeave}
//           href={`/my-profile/${phoneNumber}`}
//           onClick={() => handleLinkClick(`/my-profile/${phoneNumber}`)}
//         >
//           <FaUserCircle className="me-2" style={{ color: '#4F4B7E' }} /> My Profile
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('my-property')}
//           onMouseEnter={() => handleMouseEnter('my-property')}
//           onMouseLeave={handleMouseLeave}
//           href="/my-property"
//           onClick={() => handleLinkClick("/my-property")}
//         >
//           <FaBuilding className="me-2" style={{ color: '#4F4B7E' }} /> My Property
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('my-plan')}
//           onMouseEnter={() => handleMouseEnter('my-plan')}
//           onMouseLeave={handleMouseLeave}
//           href={`/my-plan`}
//           onClick={() => handleLinkClick(`/my-plan`)}
//         >
//           <FaLightbulb className="me-2" style={{ color: '#4F4B7E' }} /> My Plan
//         </a>
//       </li>


//     <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('plans')}
//           onMouseEnter={() => handleMouseEnter('plans')}
//           onMouseLeave={handleMouseLeave}
//           href="/add-plan"
//           onClick={() => handleLinkClick("/add-plan")}
//         >
//           <FaRocket className="me-2" style={{ color: '#4F4B7E' }} /> Pricing Plans
//         </a>
//       </li> 

//   <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('buyer plans')}
//           onMouseEnter={() => handleMouseEnter('buyer plans')}
//           onMouseLeave={handleMouseLeave}
//           href="/my-buyer-plan"
//           onClick={() => handleLinkClick("/my-buyer-plan")}
//         >
//           <FaRocket className="me-2" style={{ color: '#4F4B7E' }} />My Tenant Assistant Plan
//         </a>
//       </li>


//  <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('owner menu')}
//           onMouseEnter={() => handleMouseEnter('owner menu')}
//           onMouseLeave={handleMouseLeave}
//           href="/owner-menu"
//           onClick={() => handleLinkClick("/owner-menu")}
//         >
//           <FaCogs className="me-2" style={{ color: '#4F4B7E' }} /> Owner Menu
//         </a>
//       </li> 

//   <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('buyer menu')}
//           onMouseEnter={() => handleMouseEnter('buyer menu')}
//           onMouseLeave={handleMouseLeave}
//           href="/buyer-menu"
//           onClick={() => handleLinkClick("/buyer-menu")}
//         >
//           <FaCogs className="me-2" style={{ color: '#4F4B7E' }} />  Tenant Menu
//         </a>
//       </li>


//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('more')}
//           onMouseEnter={() => handleMouseEnter('more')}
//           onMouseLeave={handleMouseLeave}
//           href="/more"
//           onClick={() => handleLinkClick("/more")}
//         >
//           <FaCogs className="me-2" style={{ color: '#4F4B7E' }} /> More
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('contactus')}
//           onMouseEnter={() => handleMouseEnter('contactus')}
//           onMouseLeave={handleMouseLeave}
//           href="/contactus"
//           onClick={() => handleLinkClick("/contactus")}
//         >
//           <FaPhone className="me-2" style={{ color: '#4F4B7E' }} /> Contact Us
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('about-us')}
//           onMouseEnter={() => handleMouseEnter('about-us')}
//           onMouseLeave={handleMouseLeave}
//           href="/about-mobile"
//           onClick={() => handleLinkClick("/about-mobile")}
//         >
//           <FaInfoCircle className="me-2" style={{ color: '#4F4B7E' }} /> About Us
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('refund-policy')}
//           onMouseEnter={() => handleMouseEnter('refund-policy')}
//           onMouseLeave={handleMouseLeave}
//           href="/refund-mobile"
//           onClick={() => handleLinkClick("/refund-mobile")}
//         >
//           <MdPolicy className="me-2" style={{ color: '#4F4B7E' }} /> Refund Policy
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('terms-conditions')}
//           onMouseEnter={() => handleMouseEnter('terms-conditions')}
//           onMouseLeave={handleMouseLeave}
//           href="/terms-conditions"
//           onClick={() => handleLinkClick("/terms-conditions")}
//         >
//           <HiDocumentText  className="me-2" style={{ color: '#4F4B7E' }} /> Terms And Conditions
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('shiping-delivery')}
//           onMouseEnter={() => handleMouseEnter('shiping-delivery')}
//           onMouseLeave={handleMouseLeave}
//           href="/shiping-delivery-app"
//           onClick={() => handleLinkClick("/shiping-delivery-app")}
//         >
//           <FaShippingFast  className="me-2" style={{ color: '#4F4B7E' }} />Shipping & Delivery
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('more-app')}
//           onMouseEnter={() => handleMouseEnter('more-app')}
//           onMouseLeave={handleMouseLeave}
//           href="https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en"
//             target="_blank"
//   rel="noopener noreferrer"
//           // onClick={() => handleLinkClick("https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en")}
//         >
//           <RiApps2AiFill className="me-2" style={{ color: '#4F4B7E' }} /> More App
//         </a>
//       </li>
// {/* <li className="nav-item">
//   <button
//     className="nav-link"
//     style={{
//       ...getLinkStyle('more-app'),
//       background: 'none',
//       border: 'none',
//       cursor: 'pointer',
//     }}
//     onMouseEnter={() => handleMouseEnter('more-app')}
//     onMouseLeave={handleMouseLeave}
//     onClick={() =>
//       window.open(
//         'https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en',
//         '_system' // or '_blank' as fallback
//       )
//     }
//   >
//     <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> More App
//   </button>
// </li> */}

//       <li className="nav-item">
//       <a
//   className="nav-link"
//   style={getLinkStyle('share-app')}
//   onMouseEnter={() => handleMouseEnter('share-app')}
//   onMouseLeave={handleMouseLeave}
//   href="https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share"
//   target="_blank"
//   rel="noopener noreferrer"
//   // onClick={() => handleLinkClick("https://play.google.com/store/apps/dev?id=5743868169001839900&hl=en")}
// >
//   <FaShare className="me-2" style={{ color: '#4F4B7E' }} /> Share App
// </a>

//       </li>
// {/* <li className="nav-item">
//   <button
//     className="nav-link"
//     style={{
//       ...getLinkStyle('share-app'),
//       background: 'none',
//       border: 'none',
//       cursor: 'pointer',
//     }}
//     onMouseEnter={() => handleMouseEnter('share-app')}
//     onMouseLeave={handleMouseLeave}
//     onClick={() =>
//       window.open(
//         'https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share',
//         '_system' // or '_blank' as fallback
//       )
//     }
//   >
//     <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Share App
//   </button>
// </li> */}

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('rate-app')}
//           onMouseEnter={() => handleMouseEnter('rate-app')}
//           onMouseLeave={handleMouseLeave}
//           href="https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share"
//           target="_blank"
//   rel="noopener noreferrer"
//           // onClick={() => handleLinkClick("https://play.google.com/store/apps/details?id=com.deepseek.chat&hl=en#review")}
//         >
//           <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Rate App
//         </a>
//       </li>
// {/* <li className="nav-item">
//   <button
//     className="nav-link"
//     style={{
//       ...getLinkStyle('rate-app'),
//       background: 'none',
//       border: 'none',
//       cursor: 'pointer',
//     }}
//     onMouseEnter={() => handleMouseEnter('rate-app')}
//     onMouseLeave={handleMouseLeave}
//     onClick={() =>
//       window.open(
//         'https://play.google.com/store/apps/details?id=com.apps.rentpondy&pcampaignid=web_share',
//         '_system' // or '_blank' as fallback
//       )
//     }
//   >
//     <FaStar className="me-2" style={{ color: '#4F4B7E' }} /> Rate App
//   </button>
// </li> */}

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('business')}
//           onMouseEnter={() => handleMouseEnter('business')}
//           onMouseLeave={handleMouseLeave}
//           href="/business"
//           onClick={() => handleLinkClick("/business")}
//         >
//           <FaShieldAlt className="me-2" style={{ color: '#4F4B7E' }} /> Business Opportunity
//         </a>
//       </li>

//       <li className="nav-item">
//         <a
//           className="nav-link"
//           style={getLinkStyle('our-support')}
//           onMouseEnter={() => handleMouseEnter('our-support')}
//           onMouseLeave={handleMouseLeave}
//           href="/our-support"
//           onClick={() => handleLinkClick("/our-support")}
//         >
//           <FaUsers className="me-2" style={{ color: '#4F4B7E' }} /> Our Support
//         </a>
//       </li>



// {/* <li className="nav-item">
//   <button
//     className="nav-link border-0 bg-transparent w-100 text-start p-0"
//     style={getLinkStyle('logout')}
//     onMouseEnter={() => handleMouseEnter('logout')}
//     onMouseLeave={handleMouseLeave}
//     onClick={handleLogout}
//   >
//     <BiSolidLogIn className="ms-3 me-2" style={{ color: '#4F4B7E' }} /> 
//     Logout
//   </button>
// </li> */}

//       <li className="nav-item">
//         <button
//           className="nav-link border-0 bg-transparent w-100 text-start p-0"
//           style={getLinkStyle('logout')}
//           onMouseEnter={() => handleMouseEnter('logout')}
//           onMouseLeave={handleMouseLeave}
//           onClick={() => setShowConfirm(true)} // show popup
//         >
//           <BiSolidLogIn className="ms-3 me-2" style={{ color: '#4F4B7E' }} />
//           Logout
//         </button>
//       </li>
//       {/* Confirmation Popup */}
//      {showConfirm && (
//   <div
//   style={{
//     position: 'fixed',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     // width: '100vw',
//     height: '100vh',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     zIndex: 3000,
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     pointerEvents: 'auto',
//                     minWidth: '280px',

//   }}
// >
//   <div
//     style={{
//       backgroundColor: '#fff',
//       padding: '20px',
//       borderRadius: '12px',
//         boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',

//       textAlign: 'center',
//     }}
//   >
//             <h5 className="text-center" style={{fontSize:"13px"}}>Are you sure you want to logout?</h5>
//       <div className="d-flex justify-content-between gap-3">
//               <button className="btn px-4" style={{background:"blue", color:"#fff"}} onClick={handleLogout}>Yes</button>
//               <button className="btn px-4" style={{background:"white", color:"blue",  boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',}} onClick={() => setShowConfirm(false)}>No</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </ul>
//     </div>

//       </div>

//       {/* Main Content */}
//       <div className="flex-grow-1">
//         {/* Navbar */}
//         <nav
//           className="navbar navbar-light bg-light d-flex align-items-center justify-content-between px-3"
//           style={{ width: '100%', height: '60px' }}
//         >
//           <button className="btn" onClick={toggleSidebar}>
//             ☰
//           </button>
//           <span className="navbar-brand mb-0 text-center mx-auto">Rent Pondy</span>
  

// <div style={{ position: "relative" }}>
//    <button onClick={handleRefresh} style={{ padding: "10px 20px", cursor: "pointer", color:"red", background:"none", border:"none" }}>
//        <MdOutlineRefresh size={24}/>
//       </button>
//       <button className="btn border-0" style={{ fontWeight: "bold" }} onClick={handleBellClick}>
//         <FaRegBell color="#4F4B7E" size={24} />
//       </button>

//       {/* Show red badge only if there are unread notifications AND user hasn’t clicked yet */}
//       {hasUnread && !hasClickedBell && (
//         <span
//           style={{
//             position: "absolute",
//             top: "4px",
//             right: "4px",
//             width: "10px",
//             height: "10px",
//             backgroundColor: "red",
//             borderRadius: "50%",
//             zIndex: 1,
//           }}
//         ></span>
//       )}
//     </div>


//         </nav>
//       </div>
//     </div>
//   );
// };

// export default SidebarApp;







