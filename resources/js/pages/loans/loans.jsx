import React, { useEffect } from 'react';

import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

import { loanImage1Placeholder } from '../../assets/images';
import Alert from '../../components/alert/alert';
import BannerTextAndButton from '../../components/banner-text-and-button/banner-text-and-button';
import FaqQuestions from '../../components/faq-questions/faq-questions';
import FeaturePreviewWithList from '../../components/feature-preview-with-list/feature-preview-with-list';
import Footer from '../../components/footer/footer';
import HeroImage from '../../components/hero-image/hero-image';
import LoanCalculatorForm from '../../components/loan-calculator-form/loan-calculator-form';
import NavBar from '../../components/navbar/navbar';
import { closeAlert } from '../../store/components/componentsSlice';
import { getLoanPurposes } from '../../store/loan/loanSlice';

import './loans.scss';

const LoansPage = () => {
    const { user } = useSelector((state) => state.userSlice);
    const dispatch = useDispatch();
    const { isFetching, alert } = useSelector((state) => state.componentsSlice);
    const { loanPurposes } = useSelector((state) => state.loanSlice);
    const notification = alert;

    useEffect(() => {
        window.scroll(0, 0);
        dispatch(getLoanPurposes());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <Helmet>
                <title>Lendha | Take Loan</title>

                <meta property="og:url" content="https://lendha.com" />
                <meta property="og:title" content="Loans" />
                <meta
                    property="og:description"
                    content="Get instant loans to grow your business. Lendha offers a stress-free application process."
                />
                <meta
                    property="og:image"
                    content="https://res.cloudinary.com/the-now-entity/image/upload/v1612787799/Lendha/loan-image-1_zakfvz.png"
                />

                <meta name="twitter:title" content="Loans" />
                <meta
                    name="twitter:description"
                    content="Get instant loans to grow your business. Lendha offers a stress-free application process."
                />
            </Helmet>
            <NavBar />
            <div className="loans_page">
                <div className="section banner">
                    <BannerTextAndButton
                        align="left"
                        headText="Let's grow your"
                        headTextSpan=" business"
                        headTextEnd="."
                        firstSubText="Get quick access to business loans at a low rate."
                        secondSubText="Up to ₦10,000,000 - No paper work."
                        links={[
                            {
                                to: user ? '/dashboard?loan=apply' : 'register',
                                className: 'btn_blue',
                                text: 'Take Loan',
                            },
                        ]}
                    />
                    <LoanCalculatorForm isFetching={isFetching} loan_purposes={loanPurposes} />
                </div>

                <div className="section loan_section">
                    <FeaturePreviewWithList
                        imagePosition="left"
                        image={
                            'https://res.cloudinary.com/the-now-entity/image/upload/v1612787799/Lendha/loan-image-1_zakfvz.png'
                        }
                        imagePlaceholder={loanImage1Placeholder}
                        headText="Getting a loan is as easy as 1, 2, 3"
                        subText="Let Lendha finance your business, you pay us back in installments."
                        features={[
                            'Sign up and verify your identity.',
                            'Make your loan application, and get approved in few minutes.',
                            'After approval, your account is credited. Payback in installments.',
                        ]}
                        link_to="/register"
                        btn_className="btn_blue"
                        linkText="Take Loan"
                    />
                </div>

                <div className="section hero_section">
                    <HeroImage />
                </div>

                <div className="section faq_section">
                    <FaqQuestions category="loan" more />
                </div>

                <Footer />
            </div>

            {/* Other components */}
            {notification.show && (
                <Alert
                    className={notification.type}
                    textBeforeLink={notification.message}
                    close={notification.close}
                    closeAlert={() => dispatch(closeAlert())}
                />
            )}
        </React.Fragment>
    );
};

export default LoansPage;
