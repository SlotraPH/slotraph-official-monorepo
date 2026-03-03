import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

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
        <section id="faq" className="bg-white py-24 border-t border-[#e2e6ea]">
            <div className="text-center max-w-[600px] mx-auto mb-16">
                <h2 className="text-[48px] font-extrabold text-navy tracking-[-1px] mb-4">
                    Frequently Asked Questions
                </h2>
            </div>

            <div className="max-w-[720px] mx-auto px-6 flex flex-col gap-4">
                {FAQ_DATA.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div
                            key={index}
                            className={`border rounded-[10px] overflow-hidden transition-[border-color,box-shadow] duration-200 hover:border-brand ${
                                isOpen
                                    ? 'border-brand shadow-[0_1px_3px_rgba(15,31,46,0.08)]'
                                    : 'border-[#e2e6ea]'
                            }`}
                        >
                            <button
                                className="w-full py-6 px-8 flex items-center justify-between bg-white text-base font-semibold text-navy text-left gap-4"
                                onClick={() => toggleItem(index)}
                                aria-expanded={isOpen}
                            >
                                <span>{item.question}</span>
                                <ChevronDown
                                    size={20}
                                    className={`flex-shrink-0 transition-[transform,color] duration-200 ${
                                        isOpen ? 'rotate-180 text-brand' : 'text-muted'
                                    }`}
                                    aria-hidden="true"
                                />
                            </button>
                            {/* max-height transition via inline style — Tailwind can't animate to max-height: auto */}
                            <div
                                className="overflow-hidden bg-page transition-[max-height] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
                                style={{ maxHeight: isOpen ? '500px' : '0' }}
                            >
                                <div className="px-8 pb-6 pt-2 text-secondary leading-[1.65]">
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};
