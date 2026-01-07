import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setPhoneNumber } from '../red/userSlice';
import { Helmet } from 'react-helmet';
import Flag from 'react-world-flags';
import logo from '../Assets/rentpondylogo.png';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { RiEdit2Fill } from "react-icons/ri";
import PrivacyPolicyWeb from './PrivacyPolicyWeb';
import WhatsAppPolicyWeb from './WhatsAppPolicyWeb';
import AboutMobile from './AboutMobile';
import { FaArrowLeft, FaChevronLeft } from 'react-icons/fa';
import bgg from '../Assets/loo.PNG';
import otpimg from '../Assets/otp_img.jpeg';

const Login = ({ onLogin }) => {
  const [phoneNumber, setPhoneNumberState] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [selectedCountry, setSelectedCountry] = useState('IN');
  const [isPhoneNumberEntered, setIsPhoneNumberEntered] = useState(false);
  const [mockOtp, setMockOtp] = useState('');
  const phoneInputRef = useRef(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [isChecked, setIsChecked] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [loginMode, setLoginMode] = useState('web');

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
  const storedPhoneNumber = useSelector(state => state.phoneNumber);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const countryCodes = [
    { code: '+1', country: 'USA', flag: 'US' },
    { code: '+44', country: 'UK', flag: 'GB' },
    { code: '+91', country: 'IN', flag: 'IN' },
    { code: '+61', country: 'Australia', flag: 'AU' },
    { code: '+81', country: 'Japan', flag: 'JP' },
  ];

  useEffect(() => {
    const checkLoggedIn = async () => {
      const storedPhone = localStorage.getItem('phoneNumber');
      
      if (storedPhone) {
        dispatch(setPhoneNumber(storedPhone));
        navigate('/mobileviews', { state: { phoneNumber: phoneNumber } });
      }
    };

    checkLoggedIn();
  }, [dispatch, navigate]);

  


  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsChecked(checked);
    setIsDisabled(!checked);
  };

  const handleCountryChange = (e) => {
    const selected = e.target.value;
    const country = countryCodes.find(c => c.flag === selected);
    setCountryCode(country.code);
    setSelectedCountry(selected);
  };

  const handlePhoneNumberChange = (e) => {
    const phone = e.target.value;
    setPhoneNumberState(phone);
    setIsPhoneNumberEntered(phone.length > 0);
  };

  // OTP timer
  useEffect(() => {
    if (isOtpSent && otpTimer > 0) {
      const interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
  }, [isOtpSent, otpTimer]);



  const handleSendOtp = async (e) => {
  e.preventDefault();

  if (!phoneNumber) {
    toast.error('Please enter a valid phone number.', {
      position: 'top-center',
      autoClose: 5000,
    });
    return;
  }

  try {
    const fullPhoneNumber = `${phoneNumber}`;
    const plainPhoneDigits = phoneNumber.replace(/\D/g, '').slice(-10);

    // 1. Check if user is directly verified
    const directCheck = await axios.get(`${process.env.REACT_APP_API_URL}/user/direct-verified-users-rent`);
    const matchedUser = directCheck.data.users.find(
      (u) => u.phone === plainPhoneDigits && u.directVerified
    );

    if (matchedUser) {
      toast.success('User is directly verified. Logging in...', {
        position: 'top-center',
        autoClose: 5000,
      });

      localStorage.setItem('phoneNumber', fullPhoneNumber);
      dispatch(setPhoneNumber(fullPhoneNumber));
      navigate('/mobileviews');
      return; // Skip OTP
    }

    // 2. If not directly verified, send OTP
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp-rent`, {
      phoneNumber: fullPhoneNumber,
      loginMode: loginMode,
      countryCode: countryCode
    });

    const generatedOtp = response.data.result?.otp;

    if (generatedOtp) {
      toast.success('OTP Sent Successfully!', {
        position: 'top-center',
        autoClose: 20000,
      });

      setMockOtp(generatedOtp);
      setIsOtpSent(true);
      setOtpTimer(30);
      setCanResendOtp(false);
      setOtp('');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Something went wrong!';
    toast.error(errorMessage, {
      position: 'top-center',
      autoClose: 5000,
    });
  }
};



  const handleVerifyOtp = async (e) => {
  e.preventDefault();

  if (!otp) {
    toast.error('Please enter the OTP.');
    return;
  }

  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/verify-otp-rent`, {
      phoneNumber: `${phoneNumber}`,
      otp: otp,
    });

    if (response.status === 200) {
      toast.success('OTP verified successfully!');
      const fullPhoneNumber = `${phoneNumber}`;
      localStorage.setItem('phoneNumber', fullPhoneNumber);
      dispatch(setPhoneNumber(fullPhoneNumber));
navigate('/mobileviews');

      // navigate('/mobileviews');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'OTP verification failed!';
    toast.error(errorMessage);
  }
};


  
  const handleResendOtp = async () => {
    if (!canResendOtp) return;

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp-rent`, {
        phoneNumber: `${phoneNumber}`,
        loginMode: loginMode,
        countryCode: countryCode
      });

      const newOtp = response.data.result?.otp;

      if (newOtp) {
        toast.success(`OTP resent!`, {
          position: 'top-center',
          autoClose: 20000,
        });

        setMockOtp(newOtp);
        setOtpTimer(30);
        setCanResendOtp(false);
        setOtp('');
      }
    } catch (error) {
      toast.error('Failed to resend OTP.');
    }
  };

  const handleEdit = () => {
    setIsOtpSent(false);
    setTimeout(() => {
      phoneInputRef.current?.focus();
    }, 100);
  };

  if (storedPhoneNumber) {
    return null;
  }


  return (
    <>
      <style>{`
        .custom-background::placeholder {
          color: white;
        }
      `}</style>
      {console.log('isOtpSent:', isOtpSent)}

<Container fluid className="p-0 d-flex align-items-center justify-content-center">
  <Row className="g-0">
          <div className="d-flex flex-column justify-content-between align-items-center"
          style={{
              maxWidth: "500px",
              minWidth: "400px",
              Width: "100%",
              height: "100vh",
              backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcuV4KOIIk3EuvX9hVPSTszzfiPqalO5Oipbfm5wXCPVFgtWiFpMEiO3K2GpjuV87G61Y&usqp=CAU')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              color: "white",
            }}>

    {!isOtpSent ? (
      // === SEND OTP VIEW ===
  
        <div
          className="d-flex flex-column justify-content-between align-items-center p-2"
          style={{
            width: "100%",
            height: "100%",
  backgroundImage: `url(${bgg})`, // ← must use url() and template literal
            backdropFilter: "blur(3px)",
                 backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
          }}
        >
          <div className="mt-2 text-start w-100">
                <h1 className="welcome-title text-white m-0 ps-3 pt-4">Welcome Back</h1>
                <p className='ps-3' style={{color:"#989EA0"}}>Login to continue</p>
          </div>

          <div className="text-center" style={{ marginBottom: '10px' }}>

            <img src={logo} alt="Logo" style={{ height: 100, width: 100, borderRadius: 16, boxShadow: '0 4px 16px rgba(79,75,126,0.15)' }} />
            <div style={{
              fontFamily: 'Montserrat, Poppins, Inter, Arial, sans-serif',
              fontWeight: 800,
              fontSize: 32,
              color: '#4F4B7E',
              marginTop: 8,
              letterSpacing: 1.5,
              textShadow: '0 2px 8px rgba(79,75,126,0.08)'
            }}>
              Rent Pondy
            </div>
            <div style={{
              fontFamily: 'Poppins, Inter, Arial, sans-serif',
              fontWeight: 500,
              fontSize: 16,
              color: '#fff',
              marginTop: 2,
              marginBottom: 2
            }}>
              Connecting Tenants and Owners Seamlessly
            </div>

           <Form onSubmit={handleSendOtp}>
                    <Form.Group className="mb-3" controlId="countryCode">
                      <InputGroup style={{ maxWidth: 320, margin: '0 auto', borderRadius: 8, boxShadow: '0 2px 8px rgba(79,75,126,0.07)' }}>
                        <InputGroup.Text className="border-0" style={{ backgroundColor: "#f5f5f5", borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                          <Flag code={selectedCountry} style={{ width: '22px', marginRight: '8px' }} />
                        </InputGroup.Text>
                        <Form.Select
                          value={selectedCountry}
                          onChange={handleCountryChange}
                          aria-label="Select Country"
                          style={{
                            width: 'auto', maxWidth: '80px',
                            backgroundColor: "#f5f5f5",
                            color: '#4F4B7E',
                            fontWeight: 600,
                            border: 'none',
                            borderRadius: 0,
                            outline: 'none',
                            cursor: 'pointer',
                            fontFamily: 'Poppins, Inter, Arial, sans-serif',
                            fontSize: 15
                          }}
                        >
                          {countryCodes.map((country) => (
                            <option className="text-dark" key={country.code} value={country.flag}>
                              ({country.country}) {country.code}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Control
                          type="tel"
                          placeholder="Enter Mobile No"
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          required
                          ref={phoneInputRef}
                          style={{
                            width: '100%',
                            backgroundColor: "#f5f5f5",
                            color: '#222',
                            fontWeight: 600,
                            border: 'none',
                            borderTopRightRadius: 8,
                            borderBottomRightRadius: 8,
                            fontFamily: 'Poppins, Inter, Arial, sans-serif',
                            fontSize: 16,
                            outline: 'none',
                            boxShadow: 'none',
                            paddingLeft: 12
                          }}
                          pattern="[0-9]{10,15}"
                          maxLength={15}
                        />
                      </InputGroup>
                    </Form.Group>
                    <style>
                      {`
                        input[type="tel"]::-webkit-inner-spin-button,
                        input[type="tel"]::-webkit-outer-spin-button {
                          -webkit-appearance: none;
                          margin: 0;
                        }
                      `}
                    </style>
                    <div className="d-flex justify-content-center">
                      <Button type="submit"
                        style={{ backgroundColor: "#4F4B7E", border: "2px solid #4F4B7E", fontWeight: 700, fontSize: 16, borderRadius: 8 }}
                        className="btn w-50 btn-small mt-2">
                        LOGIN
                      </Button>
                    </div>
                  </Form>
          </div>
           <div className='d-flex flex-column align-items-center pb-2'
  //     style={{
  //   position: 'absolute',   // or 'fixed' if you want it always at the screen bottom
  //   bottom: 0,
  //   width: '100%',
  //   padding: '10px',        // optional spacing
  //        // optional background
  // }}
  >
                <p className="m-0" style={{color:"#fff"}}>
                  Edit or Add Your Property <span style={{ color: "rgb(22, 198, 22)" }} className="highlight fw-bold ms-2">
                    Rent Pondy
                  </span>
                </p>
                <span style={{ borderBottom: "2px solid orangered", width: "40%", marginTop: "15px" }}></span>

              
              </div>
             
        </div>
    ) : (
      // === VERIFY OTP VIEW ===

        <div
          className="d-flex flex-column align-items-center p-0"
          style={{
            width: "100%",
            height: "100%",
            background: "#ffffff",
            // backdropFilter: "blur(3px)",
          }}
        >
          <div className="text-center mb-3 w-100" style={{backgroundColor:"#FEFF7F", height:"300px"}}>
                    <img
                      src={otpimg}
                      alt="otp-banner"
                      style={{ width: '100%',height:"100%" }}
                    />

                  </div>
                       <div className="text-center mb-2" style={{color:"orangered"}}> Login Number: {phoneNumber} 
                                   <span
                                 type="button"
                                 onClick={handleEdit}
                               >
                                 <RiEdit2Fill color="#4F4B7E" size={28} style={{ fontWeight: "bold" }} />
                                 
                               </span></div>
          <h6 className="text-center mb-1" style={{color:"grey"}}>OTP Sent to Your Mobile No</h6>

          <div className="text-center mt-5">
                  <Form onSubmit={handleVerifyOtp}>
      

                    <Form.Group className="mb-3" controlId="otp">
                      <Form.Control
                        type="number"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={isDisabled}
                        required
                        className="custom-background small-input fw-normal  rounded-0 otp-input"
                     style={{
                          width: '100%',
                          backgroundColor: "transparent",
                          outline: "none",
                          borderLeft: "none",
                          borderRight: "none",
                          borderBottom: "1px solid #474747",
                          background: "transparent",
                          color: "#474747",
                          fontWeight: "bold",
                          borderTop: "none",
                          cursor: "pointer",
                          appearance: 'textfield',
                          MozAppearance: 'textfield',
                          WebkitAppearance: 'none'
                        }}
                        onFocus={(e) =>
                          Object.assign(e.target.style, {
                            outline: "none",
                            boxShadow: "none",
                            background: "none",
                            color: "#474747",
                          })
                        }
                      />
                    </Form.Group>
                    <style>
                        {`
                        .otp-input::placeholder {
      color: grey;
      opacity: 1; /* required for Firefox */
    }

    .otp-input:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: grey;
    }

    .otp-input::-ms-input-placeholder { /* Microsoft Edge */
      color: grey;
    }
                        input[type="number"]::-webkit-inner-spin-button,
                        input[type="number"]::-webkit-outer-spin-button {
                          -webkit-appearance: none;
                          margin: 0;
                        }
                      `}
                    </style>

                    {canResendOtp && (
                      <div className="d-flex justify-content-center">
                        <Button style={{ backgroundColor: "white", border: "1px solid #4F4B7E", color: "#4F4B7E" }} onClick={handleResendOtp} className="w-100 mt-2">
                          RESEND OTP
                        </Button>
                      </div>
                    )}
                    {otpTimer > 0 && !canResendOtp && (
                      <p className="text-center mt-2">Resend OTP in {otpTimer} seconds</p>
                    )}
                    <div className="d-flex justify-content-center mt-1">
                      <Button type="submit" style={{ backgroundColor: "#4F4B7E", border: "2px solid #4F4B7E" }} className="btn-small w-100">
                        VERIFY OTP
                      </Button>
                    </div>
                 
                  </Form>
          </div>
           <div className='mb-2 mt-2' style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px'
  }}>
                      <label style={{ margin: 0 }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={handleCheckboxChange}
                          style={{ cursor: 'pointer' }}
                        />
                      </label>
                      <span
                        onClick={() => setShowPopup(true)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '13px',
                          color:"#666"
                        }}
                      >
                        I agree with <span style={{ color: '#4F4B7E', textDecoration: 'underline' }}>terms & conditions</span>
                      </span>

                      {showPopup && (
                        <div
                          style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            height: '100vh',
                            backgroundColor: '#fff',
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            overflow: "hidden"
                          }}
                        >
                          <div
                            style={{
                              maxHeight: '100%',
                              overflowY: 'auto',
                              width: '100%',
                              padding: '20px',
                              borderRadius: '10px',
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                              minWidth: '300px',
                              textAlign: 'center',
                            }}
                          >
                            <PrivacyPolicyWeb />
                            <button
                              onClick={() => setShowPopup(false)}
                              style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                padding: '6px 12px',
                                backgroundColor: '#EFEFEF',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              <FaChevronLeft /> <span className="m-0">Back</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className='mb-2 mt-1' style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px'
  }}>
                      <label style={{ margin: 0 }}>
                        <input
                          type="checkbox"
                          defaultChecked
                          style={{ cursor: 'pointer' }}
                        />
                      </label>
                      <span
                        onClick={() => setShowWhatsAppPopup(true)}
                        style={{
                          cursor: 'pointer',
                          fontSize: '13px',
                          color:"#666"
                        }}
                      >
                        I agree with <span style={{ color: '#4F4B7E', textDecoration: 'underline' }}>WhatsApp policy</span>
                      </span>

                      {showWhatsAppPopup && (
                        <div
                          style={{
                            position: 'fixed',
                            top: '0',
                            left: '0',
                            height: '100vh',
                            backgroundColor: '#fff',
                            color: 'black',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1000,
                            overflow: "hidden"
                          }}
                        >
                          <div
                            style={{
                              maxHeight: '100%',
                              overflowY: 'auto',
                              width: '100%',
                              padding: '20px',
                              borderRadius: '10px',
                              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                              minWidth: '300px',
                              textAlign: 'center',
                            }}
                          >
                            <WhatsAppPolicyWeb />
                            <button
                              onClick={() => setShowWhatsAppPopup(false)}
                              style={{
                                position: 'absolute',
                                top: '10px',
                                left: '10px',
                                padding: '6px 12px',
                                backgroundColor: '#EFEFEF',
                                color: 'black',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              <FaChevronLeft /> <span className="m-0">Back</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
        </div>
    )}
    </div>
  </Row>
</Container>

    </>
  );
};


export default Login;