import React, { useState } from 'react';

interface FaqItem {
    question: string;
    answer: string;
}

const FAQ_DATA: FaqItem[] = [
    {
        question: "Is Slotra really free?",
        answer: "Yes! Slotra offers a generous free tier that includes unlimited bookings and essential scheduling features for small businesses in the Philippines."
    },
    {
        question: "Do I need a credit card to sign up?",
        answer: "No credit card is required to start with our Free plan. You only pay if you decide to upgrade to our Pro features."
    },
    {
        question: "Can I accept payments from my customers?",
        answer: "Absolutely. Slotra Pro integrates with popular payment gateways like GCash, PayMaya, and credit cards so you can get paid upfront."
    },
    {
        question: "How do automated reminders work?",
        answer: "Once a booking is confirmed, Slotra automatically sends email (Free) or SMS (Pro) reminders to your customers to reduce no-shows."
    },
    {
        question: "Can I use Slotra on my phone?",
        answer: "Yes, Slotra is fully responsive and works perfectly on mobile browsers. We also have mobile apps in development for even better experience."
    }
];

export const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleItem = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq" className="l-faq">
            <div className="l-faq__header">
                <h2 className="l-faq__title">Frequently Asked Questions</h2>
            </div>

            <div className="l-faq__list">
                {FAQ_DATA.map((item, index) => (
                    <div
                        key={index}
                        className={`l-faq__item ${openIndex === index ? 'l-faq__item--open' : ''}`}
                    >
                        <button
                            className="l-faq__question"
                            onClick={() => toggleItem(index)}
                            aria-expanded={openIndex === index}
                        >
                            <span>{item.question}</span>
                            <svg
                                className="l-faq__icon"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <div className="l-faq__answer-wrap">
                            <div className="l-faq__answer">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};
