import React, { useEffect } from 'react';

import { Helmet } from 'react-helmet';

import BannerTextAndButton from '../../components/banner-text-and-button/banner-text-and-button';
import NavBar from '../../components/navbar/navbar';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';

import './business-management.scss';

import BankingIcon from '../../assets/icons/banking.svg';
import BusinessMgtBannerIcon from '../../assets/icons/business-mgt-banner.svg';
import ChargesIcon from '../../assets/icons/charges.svg';
import ControlIcon from '../../assets/icons/control.svg';
import CurrencyIcon from '../../assets/icons/currency.svg';
import MeshIcon from '../../assets/icons/mesh.svg';
import RightArrowIcon from '../../assets/icons/right-arrow.svg';
import SimpleIcon from '../../assets/icons/simple.svg';
import BusinessEarlyAccessInput from './components/business-early-access-input';
import BusinessEarlyAccessInput2 from './components/business-early-access-input2';
import BusinessFeaturesCard from './components/business-features-card';
// eslint-disable-next-line import/no-named-as-default
import BusinessServiceCard from './components/business-service-card';

const businessServices = [
    {
        icon: <img src={BankingIcon} alt="Bank" />,
        title: 'Business Banking',
        description:
            'Open a business account in 5 minutes, receive and make payment in multiple currencies and enjoy all of our business management tools.',
    },
    {
        icon: <img src={CurrencyIcon} alt="Currency" />,
        title: 'Financial Management',
        description:
            'You can enjoy our financial management tools such as payroll management, accounting report, and lots more.',
    },
];

const businessFeatures = [
    {
        icon: <img src={SimpleIcon} alt="Flexibility" />,
        title: 'Flexibility',
        description: 'Get things done faster and better by navigating through this management tool.',
    },
    {
        icon: <img src={ControlIcon} alt="Full control" />,
        title: 'Full control',
        description:
            'Our business management tool gives you absolute control, helping you improve cashflow and achieve financial goals.',
    },
    {
        icon: <img src={ChargesIcon} alt="No extra cost" />,
        title: 'No extra cost',
        description:
            'At no extra cost, all business owners can prepare budgets, schedule payroll, generate invoices online and do so much more.',
    },
];

const styles = {
    container: { paddingTop: '100px', paddingBottom: '50px' },
    row: { padding: '40px 20px' },
    iconWrapper: {
        width: '114px',
        height: '114px',
        backgroundColor: 'var(--color-yellow)',
    },
};

function BusinessManagementPage() {
    const [,] = useDocumentTitle('Lendha | Business Management');

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    return (
        <>
            <Helmet>
                <title>Lendha | Take Loan</title>

                <meta property="og:url" content="https://lendha.com" />
                <meta property="og:title" content="Spend Management - Lendha" />
                <meta
                    property="og:description"
                    content="Open a Business Bank Account in few minutes, Automate payment, invoice generation and analyze cash flow with our all in one spend management tool."
                />
                <meta
                    property="og:image"
                    content="https://res.cloudinary.com/the-now-entity/image/upload/v1612787799/Lendha/loan-image-1_zakfvz.png"
                />

                <meta name="twitter:title" content="Spend Management - Lendha" />
                <meta
                    name="twitter:description"
                    content="Open a Business Bank Account in few minutes, Automate payment, invoice generation and analyze cash flow with our all in one spend management tool."
                />
            </Helmet>
            <NavBar />

            <div
                className="business_page"
                style={{
                    maxWidth: '1500px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                <div
                    className="section banner"
                    style={{
                        backgroundColor: 'rgba(26, 31, 76,0.02)',
                    }}
                >
                    <BannerTextAndButton
                        align="left"
                        headText={
                            <div>
                                <img
                                    src={MeshIcon}
                                    alt="Mesh Icon"
                                    style={{
                                        position: 'absolute',
                                        top: '8%',
                                        left: 0,
                                    }}
                                />

                                <p style={{ marginTop: '80px' }}>All in One Business Management and Financial Tool</p>
                            </div>
                        }
                        firstSubText={
                            <div>
                                <span style={{ display: 'block' }}>
                                    We provide spend solutions such as invoice generation,
                                </span>
                                <span style={{ display: 'block' }}>
                                    payment schedules, cashflow analysis and so much more.
                                </span>
                            </div>
                        }
                        actionElement={
                            <div style={{ marginTop: '2rem' }}>
                                <BusinessEarlyAccessInput
                                    formName="early-access-form"
                                    formId="early-access-form"
                                    inputName="email"
                                    inputId="email"
                                />
                            </div>
                        }
                        sx={{ width: '100%' }}
                    />
                    <img
                        className="banner-image"
                        src={BusinessMgtBannerIcon}
                        alt="happy successful manager"
                        style={{ width: '100%' }}
                    />
                </div>
                <div className="section banner" style={{ backgroundColor: '#fff' }}>
                    <div className="d-flex flex-column">
                        <div>
                            <small
                                className="d-flex align-items-center"
                                style={{
                                    color: 'var(--color-yellow)',
                                }}
                            >
                                <img src={RightArrowIcon} alt="services" />
                                <span className="pl-2" style={{ fontWeight: '700' }}>
                                    Services
                                </span>
                            </small>
                            <h3>
                                We provide the
                                <br /> following services
                            </h3>
                        </div>
                    </div>
                    {businessServices.map((service) => (
                        <BusinessServiceCard
                            key={service.title}
                            icon={service.icon}
                            title={service.title}
                            description={service.description}
                        />
                    ))}
                </div>
                <div className="container" style={styles.container}>
                    <div className="row shadow-lg justify-content-center" style={styles.row}>
                        <h3>What make us different</h3>
                        <div className="row" style={{ marginTop: '100px' }}>
                            {businessFeatures.map((feature) => (
                                <div className="col-lg-4 col-sm-12 mb-3" key={feature.title}>
                                    <BusinessFeaturesCard
                                        icon={
                                            <div className="m-auto d-flex rounded-circle" style={styles.iconWrapper}>
                                                <div className="m-auto">{feature.icon}</div>
                                            </div>
                                        }
                                        title={feature.title}
                                        description={feature.description}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* <div style={styles.container}> */}
                <div className="container" style={{ ...styles.container }}>
                    <div
                        className="row"
                        style={{
                            ...styles.row,
                            backgroundColor: 'var(--color-blue)',
                        }}
                    >
                        <div className="col-12 d-flex justify-content-center">
                            <div style={{ width: 'fit-content' }}>
                                <h3 className="text-white text-center">
                                    <span className="d-block">We will be launching soon.</span>
                                    <span className="d-block">Don't miss the chance to get early access</span>
                                </h3>
                                <div className="bg-white p-2" style={{ marginTop: '100px' }}>
                                    <BusinessEarlyAccessInput2
                                        formName="early-access-form2"
                                        formId="early-access-form2"
                                        inputName="email"
                                        inputId="email"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default BusinessManagementPage;
