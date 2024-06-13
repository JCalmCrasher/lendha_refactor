import React, { useEffect } from 'react';

import Footer from '../../components/footer/footer';
import NavBar from '../../components/navbar/navbar';
import PageHeader from '../../components/page-header/page-header';

import './terms.scss';

import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const TermsPage = () => {
    const [,] = useDocumentTitle('Lendha | Terms');

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    return (
        <React.Fragment>
            <NavBar />
            <div className="terms_page">
                <PageHeader className="dark" headerText="Terms and Conditions" />

                <div className="section terms_section">
                    <h6>GENERAL TERMS AND CONDITIONS</h6>
                    <p>
                        If you continue to browse and use this website, you agree to comply with and be bound by the
                        following terms and conditions of use, which together with our privacy policy governs Lendha's
                        relationship with you. If you disagree with any part of these terms and conditions, please do
                        not use our website. It is the responsibility of the user to read the sections below and to
                        ensure that they fully understand the conditions, and by no means will Lendha or any
                        representative of Lendha be held accountable for failure by a user to do so. If you have queries
                        or you are unsure of the content, please feel free to contact us before you commence any
                        activity on the website. Also note that accessing each product adds further unique terms and
                        conditions that impacts your relationship with Lendha. Lendha promotes responsible lending,
                        please DO NOT expose yourself to credit if you know you cannot afford it.
                    </p>
                    <p>1. Definitions & Interpretations</p>
                    <p>1.1 Definitions:</p>
                    <div className="list">
                        For the purposes of the Terms:
                        <p className="item">"Terms" means these terms, consisting of:</p>
                        <p className="item">• these terms of use; and</p>
                        <p className="item">
                            • any other relevant specific terms, policies, disclaimers, rules and notices agreed between
                            the parties, (including any that may be applicable to a specific section or module of this
                            web site);
                        </p>
                        <p className="item">
                            • Lendha means Lendha Technology Limited. Lendha Technology is a licensed Direct and P2P
                            lending platform.
                        </p>
                        <p className="item">• Visitor or You means any person who visits this web site.</p>
                        <p className="item">
                            • User means a person that has signed up on the Lendha platform, and holds a client account,
                            for the purpose of borrowing or investment.
                        </p>
                    </div>

                    <br />
                    <div className="list">
                        1.2 Interpretations:
                        <p className="item">
                            • A word defined or assigned a meaning in the Terms will start with a capital letter. All
                            headings are inserted for reference purposes only and must not affect the interpretation of
                            the Terms. Whenever including or include, or excluding or exclude, together with specific
                            examples or items follow a term, they will not limit its ambit.
                        </p>
                        <p className="item">
                            • Terms other than those defined within the Terms will be given their plain English meaning.
                            References to any enactment will be deemed to include references to the enactment as
                            reenacted, amended, or extended from time to time. A reference to a person includes a
                            natural and juristic person and a reference to either party includes the party’s successors
                            or permitted assigns.
                        </p>
                        <p className="item">
                            • Unless otherwise stated in the Terms, when any number of days is prescribed in the Terms
                            the first day will be excluded and the last day included. The rule of construction that an
                            agreement must be interpreted against the party responsible for its drafting or preparation
                            does not apply.
                        </p>
                    </div>

                    <p>
                        Conflict: If there is a conflict of meaning between these terms of use and any other relevant
                        specific terms, policies, disclaimers, rules and notices agreed between the parties, the
                        specific terms will prevail in respect of your use of the relevant section or module of the web
                        site.
                    </p>

                    <br />
                    <p>
                        ABOUT Lendha: This web site is owned, managed, and administered by Lendha Technology Limited.
                        Lendha is a business that specializes in money lending through virtual means such as the
                        Internet.
                    </p>
                    <p>
                        Lendha is fully compliant with the money lending legislative requirements of Nigeria and
                        promotes responsible lending and borrowing. Lendha also strives to provide superior
                        administration and management of client accounts.
                    </p>

                    <br />
                    <div className="list">
                        2. Before you apply
                        <p className="item">
                            • Be aware and advised that we take the credibility of our site users very seriously, hence
                            we use industry's most advanced data integrity authentication validation systems. Users of
                            this site must ensure that personal data are AUTHENTIC and GENUINE to prevent avoidable
                            blacklisting, denial of service and possible criminal prosecution WHEN and WHERE necessary.
                        </p>
                        <p className="item">
                            • Be advised that our primary means of identification for all our website users (borrowers
                            and attesters) is the BVN (Bank Verification Number).
                        </p>
                        <p className="item">
                            • Our loans are designed for both short and long term for Rent payment, lifestyle financing
                            and emergency purposes. Our loan rates could be as high as 120% APR (Annual Percentage
                            Rate).
                        </p>
                        <p className="item">
                            • Lendha is neither a deposit money bank, finance house, micro-finance bank nor fund
                            manager. We are a licensed direct and peer-2-peer lending platform.
                        </p>
                        <p className="item">
                            • We will never ask you to share your debit card details either via email, SMS or phone
                            call.
                        </p>
                    </div>
                </div>

                <Footer />
            </div>
        </React.Fragment>
    );
};

export default TermsPage;
