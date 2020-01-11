import React from 'react';
import Header from '../Header/index';
import BannerSection from '../BannerSection/index';
import TopLanding from '../TopLanding/index';
import Ads from '../Ads/index';
import Footer from '../Footer/index';

export default function Home(){
    return <div>
        <Header />
        <Ads />
        <BannerSection />
        <Ads />
        <TopLanding />
        <Footer />
    </div>
}