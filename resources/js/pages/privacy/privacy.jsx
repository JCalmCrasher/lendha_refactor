import React, { useEffect } from 'react';

import Footer from '../../components/footer/footer';
import NavBar from '../../components/navbar/navbar';
import PageHeader from '../../components/page-header/page-header';

import './privacy.scss';

import { useDocumentTitle } from '../../hooks/useDocumentTitle';

const PrivacyPage = () => {
    const [,] = useDocumentTitle('Lendha | Privacy');

    useEffect(() => {
        window.scroll(0, 0);
    }, []);

    return (
        <React.Fragment>
            <NavBar />
            <div className="privacy_page">
                <PageHeader className="light" headerText="Privacy" />

                <div className="section privacy_section">
                    <p>
                        Lendha Technology Limited (Lendha or We, Our, Us), a finance company providing innovative
                        consumer focused lending and wealth management services, respect your privacy and are committed
                        to protecting your Personally Identifiable Information (PII) that may be collected through your
                        use of our website or mobile application (together, Site) or in applying for or receiving any of
                        our products or services (Services). This privacy policy (Policy) describes how we collect and
                        use your PII and how you can control that use.
                    </p>
                    <p>
                        Your use of Lendha websites, or otherwise providing us with personal information, you agree to
                        the terms and conditions of this privacy policy and any updates we make. Our Terms of Use take
                        precedent over any provision conflicting with our privacy policy. This is our complete privacy
                        policy, and supersedes all earlier versions.
                    </p>
                    <p>
                        Changes to Our Privacy Policy We update our Privacy Policy regularly—this version is effective
                        as of the date indicated above. We will notify you of material changes to the Privacy Policy by
                        email as well as a notice on our website.
                    </p>

                    <h6>1. How And Why We Collect Infomation About You</h6>
                    <p>1.1. Information You Provide Us</p>
                    <p>
                        1.1.1. Personal Information We collect personal information from you to help you use our
                        services. When we say “personal information,” we mean information that specifically identifies
                        you.
                    </p>
                    <div className="list">
                        We collect this information in a number of ways. You are asked to provide personal information
                        to us while submitting loan applications, registering to use our Website, discussing your
                        application with us, providing feedback to us, or transferring funds when using our services.
                        Examples of personal information include:
                        <p className="item">• Your Name.</p>
                        <p className="item">• Your Address.</p>
                        <p className="item">• Telephone Number.</p>
                        <p className="item">• Email Address.</p>
                        <p className="item">• BVN Account Numbers.</p>
                        <p className="item">• Card Information.</p>
                        <p className="item">• Employment Information.</p>
                        <p className="item">• Salary Information.</p>
                    </div>

                    <p>
                        We may supplement the personal information you submit to us with information from third-party
                        sources. For example, in an effort to protect the integrity of your account and if permitted
                        under applicable law, we may supplement your registration Information with address
                        standardization data to verify the address you have entered is valid and to protect you against
                        identity theft.
                    </p>
                    <p>
                        Finally, we never intend to collect personal information from children under 13 years of age. If
                        we learn or are notified that we have collected this information from a child under the age of
                        13, we will promptly remove the data from our system.
                    </p>
                    <br />

                    <p>1.2. Information We Collect About You</p>
                    <p>1.2.1. Aggregate Information</p>
                    <div className="list">
                        Aggregate information, which is data we collect about your use of our or third party websites or
                        services, from which personal information has been removed. Aggregate data is used to help us
                        understand consumer trends, needs, interests, and preferences so we can improve our products and
                        services. Lendha also collects demographic information, which is anonymous, and may include:
                        <p className="item">• Age.</p>
                        <p className="item">• Date of Birth.</p>
                        <p className="item">• Telephone Number.</p>
                        <p className="item">• Income.</p>
                        <p className="item">• Geographic Area.</p>
                    </div>
                    <p>
                        In the case of employee-sponsored plans, where we partner with employers to offer our products
                        to their employees, we will collect information from both the employer and employees. This
                        includes, but is not limited to, employer name, plan participant names, length of employment,
                        annual income, addresses, dates of birth, email addresses and other relevant information needed
                        to verify the identity and employment of plan participants.
                    </p>
                    <br />

                    <p>1.2.2. Consumer Reports</p>
                    <p>
                        As a company engaged in lending, Lendha both receives and transmits data to consumer reporting
                        agencies. We partner with these agencies to assess your creditworthiness and to prevent fraud
                        and identity theft. This is done as part of our regular underwriting, fraud prevention and loan
                        servicing processes. Information we collect in these reports includes, but is not limited to:
                    </p>
                    <div className="list">
                        Information about open and closed credit accounts, including the date opened, the date closed
                        (if applicable), the latest reported monthly balance and monthly payment Information about
                        credit inquiries Information about late payments and collection actions occurring on open and
                        closed credit accounts Information regarding public records of bankruptcy, judgements, tax
                        liens, and other payment statuses. The credit score produced by the credit bureau providing the
                        report on:
                        <p className="item">
                            • Information related to your creditworthiness is maintained by the credit bureaus. If you
                            find that there is an error or you want to dispute the information found in your credit
                            report, please contact the credit reporting bureaus.
                        </p>
                        <p className="item">www.crccreditbureau.com</p>
                        <p className="item">www.firstcentralcreditbureau.com?</p>
                        <p className="item">www.creditregistry.ng</p>
                    </div>
                    <br />

                    <p>1.2.3. Website Use And Logging Data</p>
                    <p>
                        Lendha also collects information about your computer or mobile device to improve and evaluate
                        your use of our website and our services. We may gather data such as your browser type,
                        operating system, loading or exiting of web pages, and the Internet Protocol (IP) address of
                        your computer or device.
                    </p>
                    <br />

                    <p>1.2.4. Information We Get From Others</p>
                    <p>
                        Like other advertisers, we contract with third parties to place advertisements for our products
                        and services on websites that are not our own. We place these ads where we think they are likely
                        to be most relevant. These advertisements on third-party websites allow us to track responses to
                        our ads. We and our affiliates use this information to track the performance of our advertising
                        and marketing campaigns by using tools like cookies, web beacons and similar technologies. We
                        use these tools to collect and store information about your visits, page visits and duration,
                        and the specific ad or link that the user clicked on to visit the site.
                    </p>
                    <br />

                    <p>1.2.5 Cookies Lendha uses “cookies”</p>
                    <p>
                        and similar tools to track your use of the Website when you use our services. We collect
                        information such as the types of service used, and number of users we receive daily. Our web
                        servers automatically log information about your computer, but we don’t use this information to
                        identify you personally. We and our vendors use cookies and to improve our service, our site and
                        to provide more convenient and relevant experiences to you. Cookies are designed to transfer a
                        small amount of data to your browser by servers within a domain. That data is only read by
                        designated servers within that domain. It functions as your computer’s identification card and
                        enables Lendha to improve your experience by securely maintaining your authenticated session and
                        preferences.
                    </p>
                    <p>
                        A web beacon embeds a small transparent gif image in a web page or email used to track when the
                        page or email has been viewed. A similar device may be used where a product, service or
                        functionality sends data to a server when a set of user-initiated events occur such as clicking
                        a button on the website or in an email.
                    </p>
                    <p>
                        This is similar to a cookie – it tracks your visit and the data is only read by the server that
                        receives the data. However, it differs because it is not browser-based, may not function as an
                        ID card and doesn’t store any data on your computer.
                    </p>
                    <p>
                        Most Internet browsers are set up to accept cookies automatically. You can set your browser to
                        notify you when you receive a cookie, allowing you to decide whether or not to accept it. For
                        some web pages requiring an authorization, cookies are not optional. Users choosing not to
                        accept cookies or similar devices will probably not be able to access those pages or their
                        products and services.
                    </p>
                    <br />

                    <p>1.2.6 Contacting us by Telephone</p>
                    <p>
                        If you communicate with us by telephone, we may monitor or record the call. This is done for
                        reasons such as maintaining the integrity of your account, providing effective and timely
                        service, and the improvement of Lendha’s products.
                    </p>

                    <h6>2. Use Of Our Personal Information</h6>
                    <p>
                        We use personal information to provide you with information or services you request, to inform
                        you about other information and services we think will be of interest to you, to facilitate your
                        use and our operation of our website, and to improve our products and services. We don’t forget
                        about you once you’ve signed—Lendha provides services to propel your career and financial future
                        throughout the life of your loan.
                    </p>
                    <div className="list">
                        Here are some examples of ways in which we use your personal information:
                        <p className="item">• Contacting you regarding issues with your account.</p>
                        <p className="item">• Allowing our loan servicing partners to process your payments.</p>
                        <p className="item">• Invitations to Lendha members events.</p>
                        <p className="item">• Providing member services, such as career management support.</p>
                        <p className="item">• Sending you information about new product offerings.</p>
                        <p className="item">• Sharing your personal information.</p>
                        <p className="item">• Creating and maintaining your login information on our site.</p>
                    </div>

                    <div className="list">
                        We don’t sell or rent your personal information to anyone. Lendha only shares your personal
                        information with unaffiliated third parties as permitted or required by law. We may share your
                        personal information with our affiliate companies and as part of joint marketing campaigns with
                        other financial companies. When Lendha shares your personal information with vendors and service
                        providers who perform functions on our behalf, we require the security and confidentiality of
                        your information, as well as limiting their use of the information to reasonably and necessarily
                        to carry out their work with us and comply with applicable laws and regulations. Third parties
                        we share your information with may include, but are not limited to:
                        <p className="item">
                            • Our loan servicing partners who provide your statements, process your payments, and
                            service your loan Financial institutions as required by laws regulating loan securitization.
                        </p>
                        <p className="item">• Credit reporting agencies.</p>
                        <p className="item">• Direct marketing service providers.</p>
                        <p className="item">• Auditors and examiners.</p>
                        <p className="item">• Law enforcement, regulators and other government bodies.</p>
                        <p className="item">• Our regulators and other relevant government agencies.</p>
                        <p className="item">
                            • Please note that, if you are a current borrower, you may not control certain information
                            associated with your loan that you have already agreed to provide to certain investors as
                            described in your loan agreement.
                        </p>
                    </div>
                    <p>
                        Finally, personal information may be disclosed or transferred as part of, or during negotiations
                        of, a merger, consolidation, sale of our assets, as well as equity financing, acquisition,
                        strategic alliance or in any other situation where personal information may be transferred as
                        one of the business assets of Lendha.
                    </p>

                    <h6>3. Protecting Your Personal Information</h6>
                    <p>3.1 What we do to protect your personal information.</p>
                    <p>
                        Lendha takes the privacy and security of its members personal information seriously. We maintain
                        administrative, technical and physical safeguards designed to protect your information’s
                        security, confidentiality and integrity.
                    </p>
                    <p>
                        We protect personal information you provide online in connection with registering yourself as a
                        user of our website. Access to your own personal information is available through a unique user
                        ID and password selected by you. This password is encrypted while transmitted from your browser
                        to our servers and while stored on our systems. To protect the security of your personal
                        information, never share your password to anyone. Please notify us immediately if you believe
                        your password has been compromised.
                    </p>
                    <p>
                        Whenever we save your personal information, it’s stored on servers and in facilities that only
                        selected Lendha personnel and our contractors have access to. We encrypt all data that you
                        submit through Lendha’s website during transmission using Transport Layer Security (TLS) in
                        order to prevent unauthorized parties from viewing such information. Remember all information
                        you submit to us by email is not secure, so please do not send sensitive information in any
                        email to Lendha. We never request that you submit sensitive or personal information over email,
                        so please report any such requests to us by sending an email to support@lendha.com.
                    </p>
                    <br />

                    <p>3.2 Steps you can take to help us keep your information safe</p>
                    <p>
                        There are many steps you can take to help us keep your information safe. First and foremost,
                        choose complex, independent passwords for each website and service you maintain an account with.
                        This helps keep any breach of any of your accounts isolated to one service. Also, don’t use
                        anything related to your birthday, address, phone number, PIN number or any other easily
                        guessable information in your password.
                    </p>
                    <p>
                        Lendha urges your caution when using a public computers or networks, like at a coffee shop or
                        library. To best protect your personal information and login information, don’t use such
                        computers to access your sensitive accounts, and if you must do, ensure that you logout of your
                        account entirely.
                    </p>
                    <p>
                        When either you or we update information in your account, such as the status of a loan
                        application, we typically send you notice of these changes via email or text message. In recent
                        years, individuals, businesses and even governments have seen a rise in “phishing” attacks.
                        Phishing occurs when someone attempts to obtain your password or other sensitive information.
                        Scammers often do this by impersonating a trusted user, or offering a compelling reason to open
                        a malicious email attachment, click on a link or give over information. We never ask for your
                        sensitive personal information, such as password, over email or other unsecure methods or
                        through any site not under the Lendha.com domain. Please notify us at support@lendha.com if you
                        ever receive suspicious correspondence from us.
                    </p>

                    <h6>4. Complaints & Concerns</h6>
                    <p>
                        Lendha takes your privacy seriously, and maintains a process to respond to your concerns
                        regarding violations of this Policy. If you believe that we haven’t complied with this policy in
                        regards to your personal information or have questions regarding your privacy with us, please
                        contact us at support@lendha.com. If you are reporting non-compliance with this Privacy Policy,
                        please describe the issue in as much detail as possible without disclosing any sensitive
                        information about you or third parties. We will respond to your request by email within 7-10
                        business days.
                    </p>
                    <p>
                        Terms and Conditions Apply. LENDHA RESERVES THE RIGHT TO MODIFY OR DISCONTINUE PRODUCTS AND
                        BENEFITS AT ANY TIME WITHOUT NOTICE. To qualify, a borrower must be a Nigerian citizen or
                        permanent resident and meet Lendha's underwriting requirements. Rates and Terms are subject to
                        change at any time without notice and are subject to regulatory restrictions.
                    </p>
                </div>

                <Footer />
            </div>
        </React.Fragment>
    );
};

export default PrivacyPage;
