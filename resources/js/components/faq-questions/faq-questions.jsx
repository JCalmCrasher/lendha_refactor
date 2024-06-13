import React from 'react';

import { Link } from 'react-router-dom';

import { faqData } from '../../data/data';

import './faq-questions.scss';

import DOMPurify from 'dompurify';

const FaqQuestions = ({ category, more }) => {
    const faq_data = faqData.filter((item) => item.category === category);

    return (
        <div className="faq_questions">
            <h3>Frequently Asked Questions</h3>

            <div className="questions">
                {more
                    ? faq_data.slice(0, 5).map((item, i) => (
                          <div key={i} className="question">
                              <h6>{item.question}</h6>
                              <p
                                  dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(item.answer),
                                  }}
                              />
                          </div>
                      ))
                    : faqData.map((item, i) => (
                          <div key={i} className="question">
                              <h6>{item.question}</h6>
                              <p
                                  dangerouslySetInnerHTML={{
                                      __html: DOMPurify.sanitize(item.answer),
                                  }}
                              />
                          </div>
                      ))}
            </div>

            {more && (
                <Link to="/faq" className="text_link">
                    See more FAQ
                </Link>
            )}
        </div>
    );
};

export default FaqQuestions;
