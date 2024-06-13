import React, { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
    applicantsIcon,
    chooseIcon,
    customerIcon,
    deliveryIcon,
    paperworkIcon,
    repaymentIcon,
} from '../../assets/icons';
import { foodMartPlaceholder } from '../../assets/images';
import Alert from '../../components/alert/alert';
import BannerTextAndButton from '../../components/banner-text-and-button/banner-text-and-button';
import FaqQuestions from '../../components/faq-questions/faq-questions';
import FeatureListing from '../../components/feature-listing/feature-listing';
import FoodmartBannerImage from '../../components/foodmart-banner-image/foodmart-banner-image';
import FoodMartPackage from '../../components/foodmart-package/foodmart-package';
import Footer from '../../components/footer/footer';
import HeroImage from '../../components/hero-image/hero-image';
import FoodPackageModal from '../../components/modal/food-package-modal';
import NavBar from '../../components/navbar/navbar';
import SectionHeader from '../../components/section-header/section-header';
import { user } from '../../components/utils/auth';
import { foodMartPackagesData } from '../../data/data';

import './foodmart.scss';

const FoodmartPage = () => {
    const [isFoodPackageModalOpen, setIsFoodPackageModalOpen] = useState(false);
    const [selectedFoodPackage, setSelectedFoodPackage] = useState(null);

    const history = useNavigate();
    const packagesSectionRef = useRef(null);

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    const handlePackageClicked = (item) => {
        if (item) {
            setSelectedFoodPackage(item);
            setIsFoodPackageModalOpen(true);
        }
    };

    const scrollToOrderSection = () => packagesSectionRef.current.scrollIntoView();

    return (
        <React.Fragment>
            <NavBar />
            <div className="foodmart_page">
                <div className="section banner">
                    <BannerTextAndButton
                        align="left"
                        headText="Buy"
                        headTextSpan=" groceries"
                        headTextEnd=" now, Pay later."
                        firstSubText="Hassle-free and easy food payments make it happen."
                        links={[
                            {
                                to: '#',
                                onClick: () => scrollToOrderSection(),
                                className: 'btn_blue wide',
                                text: 'Order a Package',
                            },
                        ]}
                    />
                    <div className="banner_image_container">
                        <img
                            className="border_image"
                            src="https://res.cloudinary.com/the-now-entity/image/upload/q_auto/v1610102356/Lendha/h_line_b_y_b_wpnos3.png"
                            alt="divider"
                        />
                        <FoodmartBannerImage
                            image="https://res.cloudinary.com/the-now-entity/image/upload/v1612799363/Lendha/foodmart-image_sahhjr.jpg"
                            imagePlaceholder={foodMartPlaceholder}
                        />
                    </div>
                </div>

                <div className="section working_section">
                    <SectionHeader
                        headText="How food mart works"
                        firstSubText="Purchase an package and spread the expenses over a period of time."
                        secondSubText="Buy now, Pay later."
                    />
                    <FeatureListing
                        features={[
                            {
                                icon: applicantsIcon,
                                midText: 'Applicants must be 18 years or over.',
                            },
                            {
                                icon: paperworkIcon,
                                midText: 'Register and complete your profile.',
                            },
                            {
                                icon: chooseIcon,
                                midText: 'Choose your preferred package below.',
                            },
                            {
                                icon: repaymentIcon,
                                midText: 'Applicants are to make 30% down payment.',
                            },
                            {
                                icon: deliveryIcon,
                                midText: 'Applicants get package in 24hours.',
                            },
                            {
                                icon: customerIcon,
                                midText: 'Available to Lagos & Abuja residents only.',
                            },
                        ]}
                    />
                </div>

                <div ref={packagesSectionRef} className="section packages_section">
                    <SectionHeader headText="Order your preferred package" />
                    {!user ? (
                        <Alert
                            className="info"
                            textBeforeLink="Please "
                            linkText="sign in"
                            linkTo="/sign-in"
                            textAfterLink=" to purchase a food package"
                        />
                    ) : (
                        <Alert className="info" textBeforeLink="Sorry! Foodmart is not available at this time" />
                    )}
                    <div className="foodmart_packages">
                        <FoodMartPackage packages={foodMartPackagesData} onClick={handlePackageClicked} />
                    </div>
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
            {isFoodPackageModalOpen && (
                <FoodPackageModal
                    isOpen={isFoodPackageModalOpen}
                    closeModal={() => setIsFoodPackageModalOpen(false)}
                    selectedPackage={selectedFoodPackage}
                    onClick={() => history.push('/sign-in')}
                    disabled={!user ? false : true}
                />
            )}
        </React.Fragment>
    );
};

export default FoodmartPage;
