
import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setPhoneNumber } from '../red/userSlice';
import { Helmet } from 'react-helmet';
import Flag from 'react-world-flags';
import logo from '../Assets/ppc logo.jpg';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import { RiEdit2Fill } from "react-icons/ri";
import PrivacyPolicyWeb from './PrivacyPolicyWeb';
import AboutMobile from './AboutMobile';
import { FaArrowLeft, FaChevronLeft } from 'react-icons/fa';

const WebLogin = ({ onLogin }) => {
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



  // const handleSendOtp = async (e) => {
  //   e.preventDefault();

  //   if (!phoneNumber) {
  //     toast.error('Please enter a valid phone number.', {
  //       position: 'top-center',
  //       autoClose: 5000,
  //     });
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(`${process.env.REACT_APP_API_URL}/send-otp`, {
  //       phoneNumber: `${countryCode}${phoneNumber}`,
  //       loginMode: loginMode,
  //       countryCode: countryCode
  //     });

  //     const generatedOtp = response.data.result?.otp;

  //     if (generatedOtp) {
  //       // toast.success(`OTP sent! Your OTP is: ${generatedOtp}`,
  //               toast.success(`OTP Sent Successfully!`,

  //          {
  //         position: 'top-center',
  //         autoClose: 20000,
  //       });

  //       setMockOtp(generatedOtp);
  //       setIsOtpSent(true);
  //       setOtpTimer(30);
  //       setCanResendOtp(false);
  //       setOtp('');
  //     }
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.error || 'Something went wrong!';
  //     toast.error(errorMessage, {
  //       position: 'top-center',
  //       autoClose: 5000,
  //     });
  //   }
  // };



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
    // <>
    //   <style>{`
    //     .custom-background::placeholder {
    //       color: white;
    //     }
    //   `}</style>
    //   <Container fluid className="p-0 d-flex align-items-center justify-content-center">
    //     <Helmet>
    //       <title>Pondy Property | Login</title>
    //     </Helmet>
    //     <Row className="g-0">
    //       <div className="d-flex flex-column justify-content-between align-items-center"
    //         style={{
    //           maxWidth: "470px",
    //           minWidth: "400px",
    //           width: "100%",
    //           height: "100vh",
    //           backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcuV4KOIIk3EuvX9hVPSTszzfiPqalO5Oipbfm5wXCPVFgtWiFpMEiO3K2GpjuV87G61Y&usqp=CAU')",
    //           backgroundSize: "cover",
    //           backgroundPosition: "center",
    //           backgroundRepeat: "no-repeat",
    //           color: "white",
    //         }}>
    //         <div className="d-flex flex-column justify-content-between align-items-center p-2"
    //           style={{
    //             width: "100%",
    //             height: "100%",
    //             maxWidth: "470px",
    //             minWidth: "400px",
    //             backgroundColor: "rgba(49, 49, 49, 0.5)",
    //             backdropFilter: "blur(3px)",
    //           }}>

    //           <div>
    //             <h1 className="welcome-title text-white mt-5">Welcome Back</h1>
    //             <p className="subtitle text-white">Login to continue</p>
    //           </div>

    //           <div className='d-flex flex-column justify-content-between align-items-center'>
    //             <img src={logo} alt="Logo" className="login-logo rounded-3" height={40} />
    //             <p className='m-0'>Pondy Property</p>
    //             <p className="description text-center mt-2 mb-5">Buy and Sell your Property in Pondicherry</p>

 
    //             {!isOtpSent ? (
    //               <Form onSubmit={handleSendOtp}>
    //                 <Form.Group className="mb-3" controlId="countryCode">
    //                   <InputGroup>
    //                     <InputGroup.Text className="border-0" style={{ backgroundColor: "transparent", }}>
    //                       <Flag code={selectedCountry} style={{ width: '20px', marginRight: '8px' }} />
    //                     </InputGroup.Text>
    //                     <Form.Select
    //                       value={selectedCountry}
    //                       onChange={handleCountryChange}
    //                       aria-label="Select Country"
    //                       className="custom-background small-input fw-normal "
    //                       style={{
    //                         width: 'auto', maxWidth: '70px',
    //                         backgroundColor: "transparent",
    //                         outline: "none",
    //                         borderLeft: "none",
    //                         borderRight: "none",
    //                         borderBottom: "1px solid white",
    //                         background: "transparent",
    //                         color: "white",
    //                         fontWeight: "bold",
    //                         borderTop: "none",
    //                         cursor: "pointer",
    //                         padding: "5px 5px"
    //                       }}
    //                       onFocus={(e) =>
    //                         Object.assign(e.target.style, {
    //                           outline: "none",
    //                           boxShadow: "none",
    //                           background: "none",
    //                           color: "white",
    //                         })
    //                       }
    //                     >
    //                       {countryCodes.map((country) => (
    //                         <option className="text-dark" key={country.code} value={country.flag}>
    //                           ({country.country}) {country.code}
    //                         </option>
    //                       ))}
    //                     </Form.Select>
    //                     <Form.Control
    //                       type="number"
    //                       placeholder="Enter Mobile No"
    //                       value={phoneNumber}
    //                       onChange={handlePhoneNumberChange}
    //                       required
    //                       ref={phoneInputRef}
    //                       className="custom-background small-input fw-normal rounded-0"
    //                       style={{
    //                         width: 'auto', maxWidth: '140px',
    //                         backgroundColor: "transparent",
    //                         outline: "none",
    //                         borderLeft: "none",
    //                         borderRight: "none",
    //                         borderBottom: "1px solid white",
    //                         background: "transparent",
    //                         color: "white",
    //                         fontWeight: "bold",
    //                         borderTop: "none",
    //                         cursor: "pointer",
    //                         appearance: 'textfield',
    //                         MozAppearance: 'textfield',
    //                         WebkitAppearance: 'none'
    //                       }}
    //                       onFocus={(e) =>
    //                         Object.assign(e.target.style, {
    //                           outline: "none",
    //                           boxShadow: "none",
    //                           background: "none",
    //                           color: "white",
    //                         })
    //                       }
    //                     />
    //                   </InputGroup>
    //                 </Form.Group>
    //                 <style>
    //                   {`
    //                     input[type="number"]::-webkit-inner-spin-button,
    //                     input[type="number"]::-webkit-outer-spin-button {
    //                       -webkit-appearance: none;
    //                       margin: 0;
    //                     }
    //                   `}
    //                 </style>
    //                 <div className="d-flex justify-content-center">
    //                   <Button type="submit" style={{ backgroundColor: "#001F3F", border: "2px solid #001F3F" }} className="btn w-50 btn-small mx-2">
    //                     LOGIN
    //                   </Button>
    //                 </div>
    //               </Form>
    //             ) : (
    //               <Form onSubmit={handleVerifyOtp}>
    //                 <p> Login Number: {phoneNumber}   <span
    //                   type="button"
    //                   onClick={handleEdit}
    //                 >
    //                   <RiEdit2Fill color="#00FF00" size={28} style={{ fontWeight: "bold" }} />
    //                   Edit
    //                 </span></p>

    //                 <Form.Group className="mb-3" controlId="otp">
    //                   <Form.Control
    //                     type="number"
    //                     placeholder="Enter OTP"
    //                     value={otp}
    //                     onChange={(e) => setOtp(e.target.value)}
    //                     disabled={isDisabled}
    //                     required
    //                     className="custom-background small-input fw-normal  rounded-0"
    //                     style={{
    //                       width: '100%',
    //                       backgroundColor: "transparent",
    //                       outline: "none",
    //                       borderLeft: "none",
    //                       borderRight: "none",
    //                       borderBottom: "1px solid #fff",
    //                       background: "transparent",
    //                       color: "white",
    //                       fontWeight: "bold",
    //                       borderTop: "none",
    //                       cursor: "pointer",
    //                       appearance: 'textfield',
    //                       MozAppearance: 'textfield',
    //                       WebkitAppearance: 'none'
    //                     }}
    //                     onFocus={(e) =>
    //                       Object.assign(e.target.style, {
    //                         outline: "none",
    //                         boxShadow: "none",
    //                         background: "none",
    //                         color: "white",
    //                       })
    //                     }
    //                   />
    //                 </Form.Group>
    //                 <style>
    //                   {`
    //                     input[type="number"]::-webkit-inner-spin-button,
    //                     input[type="number"]::-webkit-outer-spin-button {
    //                       -webkit-appearance: none;
    //                       margin: 0;
    //                     }
    //                   `}
    //                 </style>

    //                 {canResendOtp && (
    //                   <div className="d-flex justify-content-center">
    //                     <Button style={{ backgroundColor: "white", border: "1px solid #001F3F", color: "#001F3F" }} onClick={handleResendOtp} className="w-50 mt-2">
    //                       RESEND OTP
    //                     </Button>
    //                   </div>
    //                 )}
    //                 {otpTimer > 0 && !canResendOtp && (
    //                   <p className="text-center mt-2">Resend OTP in {otpTimer} seconds</p>
    //                 )}
    //                 <div className="d-flex justify-content-center">
    //                   <Button type="submit" style={{ backgroundColor: "#001F3F", border: "2px solid #001F3F" }} className="btn-small w-50">
    //                     VERIFY OTP
    //                   </Button>
    //                 </div>
    //                 <div>
    //                   <label>
    //                     <input
    //                       type="checkbox"
    //                       checked={isChecked}
    //                       onChange={handleCheckboxChange}
    //                     />
    //                   </label>
    //                   <span
    //                     onClick={() => setShowPopup(true)}
    //                     style={{
    //                       cursor: 'pointer',
    //                       fontSize: '16px',
    //                     }}
    //                   >
    //                     i agree with terms & conditions Privacy Policy
    //                   </span>

    //                   {showPopup && (
    //                     <div
    //                       style={{
    //                         position: 'fixed',
    //                         top: '0',
    //                         left: '0',
    //                         height: '100vh',
    //                         backgroundColor: '#fff',
    //                         color: 'black',
    //                         display: 'flex',
    //                         alignItems: 'center',
    //                         justifyContent: 'center',
    //                         zIndex: 1000,
    //                         overflow: "hidden"
    //                       }}
    //                     >
    //                       <div
    //                         style={{
    //                           maxHeight: '100%',
    //                           overflowY: 'auto',
    //                           width: '100%',
    //                           padding: '20px',
    //                           borderRadius: '10px',
    //                           boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    //                           minWidth: '300px',
    //                           textAlign: 'center',
    //                         }}
    //                       >
    //                         <PrivacyPolicyWeb />
    //                         <button
    //                           onClick={() => setShowPopup(false)}
    //                           style={{
    //                             position: 'absolute',
    //                             top: '10px',
    //                             left: '10px',
    //                             padding: '6px 12px',
    //                             backgroundColor: '#EFEFEF',
    //                             color: 'black',
    //                             border: 'none',
    //                             borderRadius: '4px',
    //                             cursor: 'pointer',
    //                           }}
    //                         >
    //                           <FaArrowLeft /> <span className="m-0 ms-3">Privacy Policy</span>
    //                         </button>
    //                       </div>
    //                     </div>
    //                   )}
    //                 </div>
    //               </Form>
    //             )}
    //           </div>

    //           <div className='d-flex flex-column align-items-center'>
    //             <p className="m-0">
    //               Edit or Add Your Property <span style={{ color: "rgb(22, 198, 22)" }} className="highlight fw-bold ms-2">
    //                 Pondy Property
    //               </span>
    //             </p>
    //             <span style={{ borderBottom: "2px solid #001F3F", width: "40%", marginTop: "15px" }}></span>

    //             <ToastContainer />
    //           </div>
    //         </div>
    //       </div>
    //     </Row>
    //   </Container>
    // </>
    <div className="container p-0" style={{ maxWidth: '1000px'}}>
  <div className="row align-items-center shadow" style={{ borderRadius: '12px', overflow: 'hidden', backgroundColor: '#92D4BE' , height:"400px"}}>
    {/* Left: Form */}
    <div className="col-12 col-md-6 p-4">
      {/* Your form logic here */}
      {!isOtpSent ? (
        <div
  className="d-flex justify-content-center align-items-center"
>
  <div
    // className="p-4 shadow rounded"
    style={{
      backgroundColor: 'transparent',
      width: '100%',
      textAlign: 'center',
    }}
  >
    <h4 className='mb-3' style={{color:"#001F3F"}}>Login</h4>
         <Form onSubmit={handleSendOtp}>

<div className="d-flex justify-content-center">

                          <Form.Group controlId="countryCode">
    <InputGroup >
                              <InputGroup.Text className="border-0" style={{ backgroundColor: "white", }}>
                                <Flag code={selectedCountry} style={{ width: '20px', marginRight: '8px' }} />
                              </InputGroup.Text>
                              <Form.Select
                                value={selectedCountry}
                                onChange={handleCountryChange}
                                aria-label="Select Country"
                                className="custom-background small-input fw-normal "
                                style={{
                                  width: 'auto', maxWidth: '70px',
                                  backgroundColor: "white",
                                  outline: "none",
                                  borderLeft: "none",
                                  borderRight: "none",
                                  borderBottom: "1px solid #5DB875",
                                  background: "white",
                                  color: "#5DB875",
                                  fontWeight: "bold",
                                  borderTop: "none",
                                  cursor: "pointer",
                                  padding: "5px 5px"
                                }}
                                onFocus={(e) =>
                                  Object.assign(e.target.style, {
                                    outline: "none",
                                    boxShadow: "none",
                                    background: "white",
                                    color: "#5DB875",
                                  })
                                }
                              >
                                {countryCodes.map((country) => (
                                  <option className="text-dark" key={country.code} value={country.flag}>
                                    ({country.country}) {country.code}
                                  </option>
                                ))}
                              </Form.Select>
                              <Form.Control
                                type="number"
                                placeholder="Enter Mobile No"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                                required
                                ref={phoneInputRef}
                                className="custom-background small-input fw-normal rounded-0"
                                style={{
                                  width: 'auto', maxWidth: '140px',
                                  backgroundColor: "white",
                                  outline: "none",
                                  borderLeft: "none",
                                  borderRight: "none",
                                  borderBottom: "1px solid #5DB875",
                                  background: "white",
                                  color: "#5DB875",
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
                                    background: "white",
                                    color: "#5DB875",
                                  })
                                }
                              />
                            </InputGroup>
                          </Form.Group>
                          </div>
                          <style>
                            {`
                              input[type="number"]::-webkit-inner-spin-button,
                              input[type="number"]::-webkit-outer-spin-button {
                                -webkit-appearance: none;
                                margin: 0;
                              }
                            `}
                          </style>
                          <div className="d-flex justify-content-center">
                            <Button type="submit" style={{ backgroundColor: "#46A182", border: "none" }} className="btn w-50 btn-small mx-2 mt-1">
                              LOGIN
                            </Button>
                          </div>
                        </Form>
                        </div>
                                                </div>

      ) : (

        <Form onSubmit={handleVerifyOtp}>
            
                           <p className='text-center' style={{color:"blue"}}> Login Number: {phoneNumber}   <span
                             type="button"
                             onClick={handleEdit}
                           >
                             <RiEdit2Fill color="#001F3F" size={28} style={{ fontWeight: "bold" }} />
                             Edit
                           </span></p>
       
                           <Form.Group className="mb-3" controlId="otp">
                             <Form.Control
                               type="number"
                               placeholder="Enter OTP"
                               value={otp}
                               onChange={(e) => setOtp(e.target.value)}
                               disabled={isDisabled}
                               required
                               className="custom-background small-input fw-normal  rounded-0"
                               style={{
                                 width: '100%',
                                 backgroundColor: "white",
                                 outline: "none",
                                 borderLeft: "none",
                                 borderRight: "none",
                                 borderBottom: "1px solid #5DB875",
                                 background: "white",
                                 color: "#5DB875",
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
                                   background: "white",
                                   color: "#5DB875",
                                 })
                               }
                             />
                           </Form.Group>
                           <style>
                             {`
                               input[type="number"]::-webkit-inner-spin-button,
                               input[type="number"]::-webkit-outer-spin-button {
                                 -webkit-appearance: none;
                                 margin: 0;
                               }
                             `}
                           </style>
       
                           {canResendOtp && (
                             <div className="d-flex justify-content-center">
                               <Button style={{ backgroundColor: "white", border: "1px solid #1B847D", color: "#1B847D" }} onClick={handleResendOtp} className="w-50 mt-2">
                                 RESEND OTP
                               </Button>
                             </div>
                           )}
                           {otpTimer > 0 && !canResendOtp && (
                             <p className="text-center mt-2">Resend OTP in {otpTimer} seconds</p>
                           )}
                           <div className="d-flex justify-content-center">
                             <Button type="submit" style={{ backgroundColor: "#46A182", border: "2px solid #46A182" }} className="btn-small w-50">
                               VERIFY OTP
                             </Button>
                           </div>
                           <div className='text-center'>
                             <label>
                               <input
                                 type="checkbox"
                                 checked={isChecked}
                                 onChange={handleCheckboxChange}
                               />
                             </label>
                             <span
                               onClick={() => setShowPopup(true)}
                               style={{
                                 cursor: 'pointer',
                                 fontSize: '16px',
                               }}
                             >
                               i agree with terms & conditions Privacy Policy
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
                                     <FaChevronLeft /> <span className="m-0">Privacy Policy</span>
                                   </button>
                                 </div>
                               </div>
                             )}
                           </div>
                         </Form>

      )}
                      <ToastContainer />
      
    </div>

    {/* Right: Image (hidden on mobile) */}
    <div className="col-md-6 d-none d-md-block p-0">
      <img
      src="https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?semt=ais_hybrid&w=740"

        // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJN_NEm3OHJnTrx192V-gcC9byzen4_qwLEw&s"
        alt="Login Visual"
        className="img-fluid"
        style={{ height: '100%', objectFit: 'cover', width: '100%' }}
      />
    </div>
  </div>
</div>

  );
};


export default WebLogin;