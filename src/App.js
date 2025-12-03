

import React from 'react'
import BannerCarousel from './Components/BannerCarousel'
import Ads from './Components/Ads'
import FrontFooter from './Components/FrontFooter'
import Header from './Components/Header'
import Carousel from './Components/Carousel';
import Login from './Components/Login';
import WebLogin from './Components/WebLogin'


export default function App() {
  return (
    <>
    <Header />
    <BannerCarousel />
     <div className="container-fluid ps-5 pe-4" style={{background:"#F8F8F8"}}>
      <div className="row">
        {/* Main Content */}
        {/* <Login /> */}
        <div className="col-12 col-md-9" style={{fontFamily:"Inter, sans-serif", fontWeight:'Medium'}}>
          {/* <PropertyCard /> */}
<div className='mt-3 mb-3'>
                  <WebLogin />

</div>

          <Carousel />
          
          </div>
        {/* Sidebar */}
        <div className="d-none d-md-block col-md-3 mt-3 p-0 ">
          <Ads />
          </div>
      </div>
    </div>
    {/* <ShareButtons /> */}
    {/* <CardCarousel /> */}
   <FrontFooter/>
    </>
  )
}
