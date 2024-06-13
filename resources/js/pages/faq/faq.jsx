import React, { useEffect } from 'react';

import FaqQuestions from '../../components/faq-questions/faq-questions';
import Footer from '../../components/footer/footer';
import NavBar from '../../components/navbar/navbar';
import PageHeader from '../../components/page-header/page-header';

import './faq.scss';

import Helmet from 'react-helmet';

const FaqPage = () => {
    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    return (
        <React.Fragment>
            <Helmet>
                <title>Lendha | FAQs</title>

                <meta property="og:url" content="https://lendha.com" />
                <meta property="og:title" content="FAQS - Lendha" />
                <meta
                    property="og:description"
                    content="How can I get a loan? Create an account on www.lendha.com and complete your profile to apply for loans."
                />
                <meta
                    property="og:image"
                    content="https://res.cloudinary.com/thelendha/image/upload/v1650456178/upload/banner_len_dqom03.jpg"
                />

                <meta name="twitter:title" content="FAQS - Lendha" />
                <meta
                    name="twitter:description"
                    content="How can I get a loan? Create an account on www.lendha.com and complete your profile to apply for loans."
                />
            </Helmet>
            <NavBar />
            <div className="faq_page">
                <PageHeader className="dark" headerText="FAQ" />

                <div className="section faq_section">
                    <FaqQuestions />
                </div>

                <Footer />
            </div>
        </React.Fragment>
    );
};

export default FaqPage;
