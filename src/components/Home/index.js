import React from 'react';
import Header from '../Header/index';
import BannerSection from '../BannerSection/index';
import TopLanding from '../TopLanding/index';
import Ads from '../Ads/index';
import CallToAction from '../CallToAction/index';
import bannerImage from '../../images/cta_banner.png';
import Footer from '../Footer/index';
import constants from '../../constants';

export default function Home(){
    return <div>
        <Header />
        <Ads />
        <CallToAction title="Be able to create your own banner now" buttonTitle={"Create an account"} img={bannerImage} link={constants.SIGN_UP} />
        <BannerSection />
        <Ads />
        <TopLanding />
        <Footer />
    </div>
}