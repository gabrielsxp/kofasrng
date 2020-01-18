import React from 'react';
import Header from '../Header/index';
import BannerSection from '../BannerSection/index';
import TopLanding from '../TopLanding/index';
import Ads from '../Ads/index';
import CallToAction from '../CallToAction/index';
import bannerImage from '../../images/cta_banner.png';
import Footer from '../Footer/index';
import constants from '../../constants';
import Helmet from 'react-helmet';

export default function Home() {
    return <div>
        <Helmet>
            <title>The King of Fighters All Star Tools</title>
            <meta name="title" content="The King of Fighters All Star Tools" />
            <meta name="description" content="The King of Fighters All Star Tools - Make and share your own custom Pools, Banners, Tier Lists and more" />

            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://kofastools.com/" />
            <meta property="og:title" content="The King of Fighters All Star Tools" />
            <meta property="og:description" content="The King of Fighters All Star Tools - Make and share your own custom Pools, Banners, Tier Lists and more" />
            <meta property="og:image" content="https://www.kofastools.com/images/seo.jpg" />

            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content="https://kofastools.com/" />
            <meta property="twitter:title" content="The King of Fighters All Star Tools" />
            <meta property="twitter:description" content="The King of Fighters All Star Tools - Make and share your own custom Pools, Banners, Tier Lists and more" />
            <meta property="twitter:image" content="https://www.kofastools.com/images/seo.jpg" />
        </Helmet>
            <Header />
            {/* <Ads /> */}
            <CallToAction title="Be able to create your own banner now" buttonTitle={"Create an account"} img={bannerImage} link={constants.SIGN_UP} />
            <BannerSection />
            {/* <Ads /> */}
            <TopLanding frontPage />
            <Footer />
    </div>
        }