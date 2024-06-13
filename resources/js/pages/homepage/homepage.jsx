import React, { useEffect } from 'react';

import Helmet from 'react-helmet';
import { useDispatch } from 'react-redux';

import { approvalIcon, customerIcon, interestIcon, paperworkIcon, repaymentIcon, uptoIcon } from '../../assets/icons';
import { bannerImg, bannerPlaceholder, investImage1Placeholder, loanImage1Placeholder } from '../../assets/images';
import BannerTextAndButton from '../../components/banner-text-and-button/banner-text-and-button';
import ContactForm from '../../components/contact-form/contact-form';
import FaqQuestions from '../../components/faq-questions/faq-questions';
import FeatureListing from '../../components/feature-listing/feature-listing';
import FeaturePreviewWithList from '../../components/feature-preview-with-list/feature-preview-with-list';
import Footer from '../../components/footer/footer';
import HeroImage from '../../components/hero-image/hero-image';
import HomePageBannerImage from '../../components/homepage-banner-image/homepage-banner-image';
import NavBar from '../../components/navbar/navbar';
import SectionHeader from '../../components/section-header/section-header';
import { getInvestmentPlans } from '../../store/investment/investmentSlice';

import './homepage.scss';

import { homePageContent } from '../../data/data';

function HomePage() {
    const dispatch = useDispatch();
    // const { investment_plans } = useSelector(state => state.investmentSlice);

    // const roi = investment_plans?.map(plan => {
    //   if (plan.duration === 12) {
    //     return ` ${plan.interest}%`;
    //   }
    // });

    useEffect(() => {
        window.scroll(0, 0);
        dispatch(getInvestmentPlans());
    }, []);

    return (
        <>
            <Helmet>
                <title>Lendha | Small business loans in 3 hours</title>

                <meta property="og:url" content="https://lendha.com" />
                <meta property="og:title" content="Lendha: Loans and Spend Management for African Small Businesses" />
                <meta
                    property="og:description"
                    content="Lendha's instant business loan and spend management solutions are built for small businesses like yours to grow and scale."
                />
                <meta
                    property="og:image"
                    content="https://res.cloudinary.com/thelendha/image/upload/v1650456178/upload/banner_len_dqom03.jpg"
                />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Lendha: Loans and Spend Management for African Small Businesses" />
                <meta
                    name="twitter:description"
                    content="Lendha's instant business loan and spend management solutions are built for small businesses like yours to grow and scale."
                />
            </Helmet>

            <NavBar />
            <div className="page home_page">
                <div className="section banner">
                    <BannerTextAndButton
                        align="center"
                        headText="Quick and easy access to loans for SMEs"
                        firstSubText="Access up to  ₦10,000,000 - No paperwork, No collateral
            Grow your business, maintain cashflow and satisfy 
            your needs.
            "
                        links={[
                            {
                                to: '/loans',
                                className: 'btn_white font-weight-bold',
                                text: 'Take Loan',
                            },
                            {
                                to: '/#contact-us',
                                className: 'btn_blue font-weight-bold border border-white',
                                text: 'Talk to Sales',
                            },
                        ]}
                    />
                </div>

                <div className="section">
                    <div className="banner_image_container">
                        <img
                            className="border_image"
                            src="https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1609945490/Lendha/line_w_y_w_emou5w.png"
                            alt="divider"
                        />
                        <HomePageBannerImage image={bannerImg} imagePlaceholder={bannerPlaceholder} />
                    </div>
                </div>

                <div className="section finance_section">
                    <SectionHeader
                        header2
                        headText="Every business needs a Lendha"
                        firstSubText="We provide seamless access to finance with flexible repayment.
            "
                    />
                    <FeatureListing
                        features={[
                            {
                                icon: uptoIcon,
                                headText: `Up to N ${homePageContent.upToLoanAmout}`,
                                subText: `Apply for up to ${homePageContent.upToLoanAmout} quick loan.`,
                            },
                            {
                                icon: interestIcon,
                                headText: 'Low interest rate',
                                subText: 'Afforadble interest rate',
                            },
                            {
                                icon: approvalIcon,
                                headText: 'Approval in 3 hours',
                                subText: 'Get credited within few hours.',
                            },
                            {
                                icon: paperworkIcon,
                                headText: 'No paperwork',
                                subText: 'You do not have to visit our office, all applications are online.',
                            },
                            {
                                icon: repaymentIcon,
                                headText: 'Simplified and easy repayment',
                                subText: 'Up to Six (6) monthly installments.',
                            },
                            {
                                icon: customerIcon,
                                headText: 'High customer satisfaction',
                                subText: 'Customers’ satisfaction is our goal.',
                            },
                        ]}
                    />
                </div>

                <div className="section get_a_loan_section loan_section">
                    <FeaturePreviewWithList
                        imagePosition="left"
                        image="https://res.cloudinary.com/thelendha/image/upload/v1650457070/upload/get-a-loan_fhsr64.jpg"
                        imagePlaceholder={loanImage1Placeholder}
                        headText="Getting a loan is as easy as 1, 2, 3"
                        subText="Let Lendha finance your business, you pay us back in installments."
                        features={[
                            'Sign up and verify your identity.',
                            'Make your loan application, and get approved in few minutes.',
                            'After approval, your account is credited. Payback in installments.',
                        ]}
                        link_to="/loans"
                        btn_className="btn_blue font-weight-bold"
                        linkText="Take Loan"
                    />
                </div>

                <div className="section loan_section">
                    <FeaturePreviewWithList
                        imagePosition="right"
                        // image="https://res.cloudinary.com/the-now-entity/image/upload/v1612794008/Lendha/invest-image-1_cr02xi.png"
                        images={[
                            'https://res.cloudinary.com/thelendha/image/upload/v1650457349/upload/invest-image_rc8c6i.jpg',
                            'https://res.cloudinary.com/thelendha/image/upload/v1650458570/upload/invest-image_jpgl42.jpg',
                        ]}
                        imagePlaceholder={investImage1Placeholder}
                        headText="What Our Clients Say"
                        additionalText={
                            <div>
                                <p className="feature_preview_text" style={{ color: 'rgba(26, 31, 76, 0.5)' }}>
                                    `&quot;Saying no to opportunities that demanded funding but promised expansion was
                                    never an option for me. After many calls seeking help, Lendha came through for me.
                                    Our partnership with Lendha was all what we needed and today, we are glad we
                                    did.`&quot;
                                </p>

                                <div>
                                    <h6
                                        className="font-weight-bold"
                                        style={{
                                            marginBottom: 0,
                                            color: 'var(--color-blue)',
                                        }}
                                    >
                                        Amanda Etuk
                                    </h6>
                                    <small
                                        style={{
                                            color: 'rgba(26, 31, 76, 0.5)',
                                        }}
                                    >
                                        (Co-founder Messenger)
                                    </small>
                                    {/* <p
                    style={{
                      marginTop: "1rem"
                    }}
                  >
                    <Link to="#" className="text_link">
                      View more
                    </Link>
                  </p> */}
                                </div>
                            </div>
                        }
                        features={[]}
                        link_to="/invest"
                        btn_className="btn_white_blue"
                    />
                </div>

                <div className="section hero_section">
                    <HeroImage />
                </div>

                <div className="section faq_contact_section">
                    <FaqQuestions category="loan" more />
                    <ContactForm />
                </div>

                <Footer />
            </div>
        </>
    );
}

export default HomePage;
