import React, { useEffect } from 'react';

import Helmet from 'react-helmet';

import Footer from '../../components/footer/footer';
import NavBar from '../../components/navbar/navbar';
import PageHeader from '../../components/page-header/page-header';
import EligibilityCriteria from './components/EligibilityCriteria';
import EligibilityRequirements from './components/EligibilityRequirements';
import LoanDescription from './components/LoanDescription';
import LoanTypeInfo from './components/LoanTypeInfo';
import {
    retailMerchantsCriterias,
    retailMerchantsRequirements,
    SMEsCriterias,
    SMEsRequirements,
    wholesalerNDistributorsCriterias,
    wholesalerNDistributorsRequirements,
} from './contents';

import './requirements.scss';

const RequirementsPage = () => {
    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    return (
        <React.Fragment>
            <Helmet>
                <title>Lendha | Requirements</title>
                <meta
                    name="description"
                    content="Apply for a small business loan in the time to attain your annual goal. Fill out the application with the valid information to get started."
                />
            </Helmet>

            <NavBar />
            <div className="requirements_page">
                <PageHeader className="light" headerText="Loan Requirements" />

                <div className="section requirements_section">
                    <div className="loan-type">
                        <LoanTypeInfo loanType="retail merchants" rate={7} minAmount={50000} maxAmount={2000000} />
                        <br />
                        <div className="list">
                            <LoanDescription loanFor="Retailers/Merchants">
                                <p>
                                    Retailers, Professional services and Online Merchants in need of business loans for
                                    working capital, business expansion and other operational needs.
                                </p>
                            </LoanDescription>
                            <EligibilityCriteria title="Eligibility Criteria" criterias={retailMerchantsCriterias} />
                            <EligibilityRequirements title="Requirements" requirements={retailMerchantsRequirements} />
                        </div>
                    </div>
                    <div className="loan-type">
                        <LoanTypeInfo loanType="Wholesalers" rate={6} minAmount={300000} maxAmount={10000000} />
                        <br />
                        <div className="list">
                            <LoanDescription loanFor="Wholesalers/Distributors">
                                <p>
                                    Professional Services and Wholesalers/Distributors of General Merchandize such as
                                    FMCG, Electronics, Phones, Fashion & Apparel, Household Goods etc who may have or
                                    not have a physical shop.
                                </p>
                            </LoanDescription>
                            <EligibilityCriteria
                                title="Eligibility Criteria"
                                criterias={wholesalerNDistributorsCriterias}
                            />
                            <EligibilityRequirements
                                title="Requirements"
                                requirements={wholesalerNDistributorsRequirements}
                            />
                        </div>
                    </div>
                    <div className="loan-type">
                        <LoanTypeInfo loanType="SMEs" rate={5} minAmount={300000} maxAmount={20000000} />
                        <br />
                        <div className="list">
                            <LoanDescription loanFor="SMEs">
                                <p>
                                    Manufacturer, Key distributors of FMCG products to increase turnover and purchasing
                                    power.
                                </p>
                            </LoanDescription>
                            <EligibilityCriteria title="Eligibility Criteria" criterias={SMEsCriterias} />
                            <EligibilityRequirements title="Requirements" requirements={SMEsRequirements} />
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </React.Fragment>
    );
};

export default RequirementsPage;
