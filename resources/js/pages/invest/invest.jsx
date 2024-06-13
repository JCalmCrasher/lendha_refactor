import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { investImage1Placeholder, investImage2Placeholder, investImageWPlaceholder } from '../../assets/images';
import Alert from '../../components/alert/alert';
import BannerTextAndButton from '../../components/banner-text-and-button/banner-text-and-button';
import FaqQuestions from '../../components/faq-questions/faq-questions';
import FeaturePreviewWithList from '../../components/feature-preview-with-list/feature-preview-with-list';
import Footer from '../../components/footer/footer';
import HeroImage from '../../components/hero-image/hero-image';
import InvestBannerImage from '../../components/invest-banner-image/invest-banner-image';
import Loader from '../../components/loader/loader';
import NavBar from '../../components/navbar/navbar';
import { formatAmountNoDecimal } from '../../components/utils/helper';
import { closeAlert } from '../../store/components/componentsSlice';
import { getInvestmentPlans } from '../../store/investment/investmentSlice';

import './invest.scss';

const InvestPage = () => {
    const dispatch = useDispatch();
    const { isFetching, alert } = useSelector((state) => state.componentsSlice);
    const { investment_plans } = useSelector((state) => state.investmentSlice);
    const notification = alert;

    const roi = investment_plans?.map((plan) => {
        if (plan.duration === 12) {
            return ` ${plan.interest}%`;
        }
    });

    useEffect(() => {
        window.scroll(0, 0);
        if (!investment_plans) dispatch(getInvestmentPlans());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <NavBar />
            <div className="invest_page">
                <div className="section banner">
                    <BannerTextAndButton
                        align="left"
                        headText="Invest in Loans, earn up to"
                        headTextSpan={roi}
                        headTextEnd=" per annum."
                        firstSubText="With as low as ₦50,000 for a minimum duration of 6 months, invest the smart way in Loans today."
                        secondSubText={<span>Sign up today - upto {roi} ROI.</span>}
                        links={[
                            {
                                to: '/register',
                                className: 'btn_white',
                                text: 'Invest Now',
                            },
                        ]}
                    />
                    <div className="banner_image_container">
                        <img
                            className="border_image"
                            src="https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1610102356/Lendha/h_line_w_y_w_qflbtk.png"
                            alt="divider"
                        />
                        <InvestBannerImage
                            image="https://res.cloudinary.com/the-now-entity/image/upload/v1612797621/Lendha/invest-image-w_zc1uzj.jpg"
                            imagePlaceholder={investImageWPlaceholder}
                        />
                    </div>
                </div>

                <div className="section plans_section">
                    <div className="plans">
                        {isFetching && <Loader color="blue" />}
                        {investment_plans &&
                            investment_plans.map((plan, i) => (
                                <div key={i} className="plan">
                                    <h6>
                                        {plan.interest}% ROI - {plan.duration}
                                        months
                                    </h6>
                                    <p>Min. investment of {formatAmountNoDecimal(plan.min_amount)}</p>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="section invest_section">
                    <FeaturePreviewWithList
                        imagePosition="left"
                        image={
                            'https://res.cloudinary.com/thelendha/image/upload/v1650458570/upload/invest-image_jpgl42.jpg'
                        }
                        imagePlaceholder={investImage1Placeholder}
                        headText="Get started in just 3 easy steps"
                        subText="Create accounts at Lendha in minutes. No complicated steps, no spreadsheet, no planner. Lendha does not keep funds, it grows them."
                        features={[
                            'Sign up on Lendha with your BVN and verify your registration.',
                            'Select your preferred investment, duration, and mode of payment.',
                            'Sit back and watch your money grow.',
                        ]}
                        link_to="/register"
                        btn_className="btn_blue"
                        linkText="Get Started"
                    />
                </div>

                <div className="section invest_smart_section invest_section">
                    <FeaturePreviewWithList
                        imagePosition="right"
                        image={
                            'https://res.cloudinary.com/the-now-entity/image/upload/v1612796950/Lendha/invest-image-2_mgkbzh.png'
                        }
                        imagePlaceholder={investImage2Placeholder}
                        headText="Invest the smart way in loans today"
                        subText="A Naira here, a Naira there, makes Ten Naira. Why spend excessively when you can grow it with Lendha."
                        features={[
                            <span>Earn up to {roi} per annum.</span>,
                            'Lesser durations available.',
                            'Securely grow your funds.',
                        ]}
                        link_to="/register"
                        btn_className="btn_white_blue"
                        linkText="Invest Now"
                    />
                </div>

                <div className="section hero_section">
                    <HeroImage />
                </div>

                <div className="section faq_section">
                    <FaqQuestions category="general" more />
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

export default InvestPage;
