// FormComponent.js
import React, { useState , useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaCity, FaIdCard, FaRegBuilding, FaRupeeSign , FaTimes} from 'react-icons/fa';
import { MdApproval } from 'react-icons/md';
import axios from "axios";
import { PiMapPinAreaLight } from "react-icons/pi";
import { HiOutlineBuildingLibrary } from 'react-icons/hi2';
import { LuBedDouble, LuBuilding } from 'react-icons/lu';
import { GrSteps } from 'react-icons/gr';
import { FcSearch } from 'react-icons/fc';
import minprice from "../Assets/Price Mini-01.png";
import maxprice from "../Assets/Price maxi-01.png";
const dataList = {
  propertyMode: ['Buy', 'Rent', 'Lease'],
};

const FormComponent = () => {
  const [hovered, setHovered] = useState(false);

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
  const buttonStyle = {
    marginTop: "20px",
    background: hovered ? "#CDC9F9" : "#4F4B7E", // Darker on hover
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background 0.3s ease",
    with:"100%"
  };
  const [filters, setFilters] = useState({
    id: '',
    minPrice: '',
    maxPrice: '',
    propertyMode: '',
    city: '',
    propertyType: '',
    floorNo: '',
    state: '',
    area: '',
    bedrooms: '',

  });
  
  const [dataList, setDataList] = useState({});
  const fetchDropdownData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/fetch`);
      const groupedData = response.data.data.reduce((acc, item) => {
        if (!acc[item.field]) acc[item.field] = [];
        acc[item.field].push(item.value);
        return acc;
      }, {});
      setDataList(groupedData);
    } catch (error) {
    }
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDropdown = (field) => {
    setDropdownState((prev) => ({
      ...prev,
      activeDropdown: prev.activeDropdown === field ? null : field,
      filterText: '',
    }));
  };
  const handleDropdownFilterChange = (e) => {
    setDropdownState((prev) => ({
      ...prev,
      filterText: e.target.value,
    }));
  };
 
    const [dropdownState, setDropdownState] = useState({
      activeDropdown: null,
      filterText: "",
      position: { top: 0, left: 0 },
    });
    const fieldLabels = {
      propertyMode: "Property Mode",
      propertyType: "Property Type",
      minPrice: "Min Rental",
            maxPrice: "Max Rental",

      propertyAge: "Property Age",
      bankLoan: "Bank Loan",
      negotiation: "Negotiation",
      length: "Length",
      breadth: "Breadth",
      totalArea: "Total Area",
      ownership: "Ownership",
      bedrooms: "Bedrooms",
      kitchen: "Kitchen",
      kitchenType: "Kitchen Type",
      balconies: "Balconies",
      floorNo: "Floor No.",
      areaUnit: "Area Unit",
      propertyApproved: "Property Approved",
      postedBy: "Posted By",
      facing: "Facing",
      salesMode: "Sales Mode",
      salesType: "Sales Type",
      description: "Description",
      furnished: "Furnished",
      lift: "Lift",
      attachedBathrooms: "Attached Bathrooms",
      western: "Western Toilet",
      numberOfFloors: "Number of Floors",
      carParking: "Car Parking",
      rentalPropertyAddress: "Property Address",
      country: "Country",
      state: "State",
      city: "City",
      district: "District",
      area: "Area",
      streetName: "Street Name",
      doorNumber: "Door Number",
      nagar: "Nagar",
      ownerName: "Owner Name",
      email: "Email",
      phoneNumber: "Phone Number",
      phoneNumberCountryCode: "Phone Country Code",
      alternatePhone: "Alternate Phone",
      alternatePhoneCountryCode: "Alternate Phone Country Code",
      bestTimeToCall: "Best Time to Call",
    };
const renderDropdown = (field) => {
   const options = dataList[field] || [];
   const filteredOptions = options.filter((option) =>
     option.toLowerCase().includes(dropdownState.filterText.toLowerCase())
   );
 
   return (
     <div data-field={field}>
       {dropdownState.activeDropdown === field && (
         <div
           className="popup-overlay"
           style={{
             position: 'fixed',
             top: 0,
             left: 0,
             width: '100vw',
             height: '100vh',
             backgroundColor: 'rgba(0, 0, 0, 0.5)',
             zIndex: 1509,
             animation: 'fadeIn 0.3s ease-in-out',
           }}
         >
           <div
             className="dropdown-popup"
             style={{
               position: 'fixed',
               top: '50%',
               left: '50%',
               transform: 'translate(-50%, -50%)',
               backgroundColor: 'white',
               width: '100%',
               maxWidth: '300px',
               padding: '10px',
               zIndex: 10,
               boxShadow: '0 4px 8px rgba(0, 123, 255, 0.3)',
               borderRadius: '18px',
               animation: 'popupOpen 0.3s ease-in-out',
             }}
           >
             <div
               className="p-1"
               style={{
                 fontWeight: 500,
                 fontSize: '15px',
                 marginBottom: '10px',
                 textAlign: 'start',
                 color: 'grey',
               }}
             >
               Select or Search{' '}
               <span style={{ color: '#0B57CF', fontWeight: 500 }}>
                 {fieldLabels[field] || 'Property Field'}
               </span>
             </div>
             <div
               className="mb-1"
               style={{
                 position: 'relative',
                 width: '100%',
                 background: '#EEF4FA',
                 borderRadius: '25px',
               }}
             >
               <FcSearch
                 size={16}
                 style={{
                   position: 'absolute',
                   left: '10px',
                   top: '50%',
                   transform: 'translateY(-50%)',
                   pointerEvents: 'none',
                   color: 'black',
                 }}
               />
               <input
                 className="m-0 rounded-0 ms-1"
                 type="text"
                 placeholder="Filter options..."
                 value={dropdownState.filterText}
                 onChange={handleFilterChange}
                 style={{
                   width: '100%',
                   padding: '5px 5px 5px 30px', // left padding for the icon
                   background: 'transparent',
                   border: 'none',
                   outline: 'none',
                 }}
               />
             </div>
 
             <ul
               style={{
                 listStyleType: 'none',
                 padding: 0,
                 margin: 0,
                 overflowY: 'auto',
                 maxHeight: '350px',
               }}
             >
               {filteredOptions.map((option, index) => (
                 <li
                   key={index}
    onClick={() => {
                    setFilters((prevState) => ({
                      ...prevState,
                      [field]: option,
                    }));
                    toggleDropdown(field);
                  }}
 
                   style={{
                     fontWeight: 300,
                     padding: '5px',
                     cursor: 'pointer',
                     color: 'grey',
                     marginBottom: '5px',
                     borderBottom: '1px solid #D0D7DE',
                   }}
                 >
                   {option}
                 </li>
               ))}
             </ul>
 
             <div className="d-flex justify-content-end p-2">
         


               <button
                 type="button"
                 onClick={() => toggleDropdown(field)}
                 style={{
                   background: '#0B57CF',
                   cursor: 'pointer',
                   border: 'none',
                   color: '#fff',
                   borderRadius: '10px',
                   padding:"5px"
                 }}
               >
                 Close
               </button>
             </div>
 
             {[
               'areaUnit',
               'availableDate',
               'petAllowed',
               'locationCoordinates',
               'bestTimeToCall',
             ].includes(field) && (
               <div
                 style={{
                   marginTop: '10px',
                   paddingTop: '10px',
                   borderTop: '1px solid #ccc',
                   textAlign: 'center',
                 }}
               >
                 <div
                   style={{
                     fontSize: '14px',
                     fontWeight: 400,
                     color: '#555',
                     marginBottom: '8px',
                   }}
                 >
                   Swipe through options to continue
                 </div>
                 {/* Optional Continue Button can go here */}
               </div>
             )}
           </div>
         </div>
       )}
     </div>
   );
 };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/Buyer-List-Filter', { state: { filters } });
  };

  const handlePageNavigation = () => {
    navigate(-1); // Redirect to the desired path
  };
  return (
    <div className="container d-flex align-items-center justify-content-center p-0">
          <div className="d-flex flex-column align-items-center justify-content-center m-0" style={{ maxWidth: '500px', margin: 'auto', width: '100%' ,fontFamily: 'Inter, sans-serif'}}>

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
    
        </button> <h3 className="m-0" style={{fontSize:"18px"}}>Tenant Assistance Sesrch  </h3> </div>
           
    <form onSubmit={handleSubmit} 
  className="p-3"  >
      {/* ID */}
      <div className="form-group  mb-3">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
             <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
 <FaIdCard /> </span>
          <input className='m-0'
            type="text"
            name="id"
            value={filters.id}
            onChange={handleDropdownFilterChange}
            placeholder="ID"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Min Price */}
      {/* <div className="form-group  mb-3">
        <div className="input-card" style={inputCardStyle}>
          <FaRupeeSign style={iconStyle} />
          <input className='m-0'
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleFilterChange}
            placeholder="Min Price"
            style={inputStyle}
          />
        </div>
      </div>

      <div className="form-group  mb-3">
        <div className="input-card" style={inputCardStyle}>
          <img src={maxprice} width={20} />
          <input className='m-0'
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleFilterChange}
            placeholder="Max Price"
            style={inputStyle}
          />
        </div>
      </div> */}
{/* Min Price */}
<div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <img src={minprice} alt="" width={20}/>
    </span>
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'minPrice' ? null : 'minPrice',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative"
        }}
      >
        {filters.minPrice || 'Select Min Rental'}
      </button>
      {renderDropdown('minPrice')}
    </div>
  </div>
</div>

{/* Max Price */}
<div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <img src={maxprice} alt="" width={20}/>
    </span>
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'maxPrice' ? null : 'maxPrice',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative"
        }}
      >
        {filters.maxPrice || 'Select Max Rental'}
      </button>
      {renderDropdown('maxPrice')}
    </div>
  </div>
</div>

      {/* Property Mode */}
   <div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)"}}>
    
    {/* Icon section */}
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <LuBuilding color='#4F4B7E'/>
    </span>

    {/* Button dropdown section */}
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'propertyMode' ? null : 'propertyMode',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative",
          
        }}
      >
        {filters.propertyMode || 'Select Property Mode'}
      </button>
      {renderDropdown('propertyMode')}
    </div>
  </div>
</div>



      {/* Property Type */}
{/* Property Type */}
<div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <FaRegBuilding />
    </span>
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'propertyType' ? null : 'propertyType',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative"
        }}
      >
        {filters.propertyType || 'Select Property Type'}
      </button>
      {renderDropdown('propertyType')}
    </div>
  </div>
</div>

{/* Bedrooms */}
<div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <LuBedDouble />
    </span>
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'bedrooms' ? null : 'bedrooms',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative"
        }}
      >
        {filters.bedrooms || 'Select Bedrooms'}
      </button>
      {renderDropdown('bedrooms')}
    </div>
  </div>
</div>

{/* Floor No */}
<div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <GrSteps />
    </span>
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'floorNo' ? null : 'floorNo',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative"
        }}
      >
        {filters.floorNo || 'Select Floor No'}
      </button>
      {renderDropdown('floorNo')}
    </div>
  </div>
</div>

      {/* State */}

      {/* <div className="form-group  mb-3 mt-2">
        <div className="input-card" style={inputCardStyle}>
          <HiOutlineBuildingLibrary  style={iconStyle} />
          <input className='m-0'
            type="text"
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            placeholder="state"
            style={inputStyle}
          />
        </div>
      </div> */}

         <div className="form-group mt-2">
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" , boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)"}}>
    
    {/* Icon section */}
    <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
      <HiOutlineBuildingLibrary color='#4F4B7E'/>
    </span>

    {/* Button dropdown section */}
    <div style={{ flex: 1, position: 'relative' }}>
      <button
        type="button"
        onClick={() =>
          setDropdownState((prev) => ({
            ...prev,
            activeDropdown: prev.activeDropdown === 'state' ? null : 'state',
            filterText: '',
          }))
        }
        style={{
          cursor: "pointer",
          padding: "12px",
          background: "#fff",
          borderRadius: "5px",
          border: "none",
          width: "100%",
          textAlign: "left",
          color: "grey",
          position: "relative",
          
        }}
      >
        {filters.state || 'Select state'}
      </button>
      {renderDropdown('state')}
    </div>
  </div>
</div>
      {/* City */}
      <div className="form-group mb-3">
        {/* <label>City</label> */}
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
              <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
         <FaCity  />
          </span>
          <input className='m-0'
            type="text"
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            placeholder="City"
            style={inputStyle}
          />
        </div>
      </div>

      {/* area */}
      <div className="form-group mb-2">
        {/* <label>Area</label> */}
  <div className="d-flex align-items-center" style={{ gap: '10px', boxShadow: "0 4px 10px rgba(38, 104, 190, 0.1)" }}>
                   <span style={{ padding: "12px", borderRight: '2px solid grey', fontSize: '1.2rem' }}>
    <PiMapPinAreaLight  /></span>
          <input className='m-0'
            type="text"
            name="area"
            value={filters.area}
            onChange={handleFilterChange}
            placeholder="area"
            style={inputStyle}
          />
        </div>
      </div>
      <button className='w-100'
      type="submit"
      style={buttonStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      SEARCH TENANT LIST
    </button>    </form>
    </div></div></div>
  );
};

const inputCardStyle = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid #4F4B7E',
  background: '#fff',
  padding: '4px',
  borderRadius: '5px',

};

const inputStyle = {
  flex: 1,
  padding: '8px',
  fontSize: '14px',
  border: 'none',
  outline: 'none',
};

const iconStyle = {
  color: '#4F4B7E',
  marginLeft: '10px',
};

export default FormComponent;
