import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'How do I place a bid?',
    answer:
      'Simply register or log in to your account, go to the artwork page, and enter your bid amount.',
  },
  {
    question: 'Are the artworks original?',
    answer: 'Yes, all artworks are verified as original by the artists and our curators.',
  },
  {
    question: 'What happens if I win the auction?',
    answer: 'You will be notified by email with payment instructions and shipping details.',
  },
  {
    question: 'Do you ship internationally?',
    answer: 'Yes, we offer worldwide shipping with secure and insured delivery options.',
  },
];

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-gray-900 text-center">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-5 shadow-sm">
              <button
                onClick={() => toggleIndex(index)}
                className="flex items-center justify-between w-full text-left text-gray-900 font-medium text-lg"
              >
                {faq.question}
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-indigo-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-indigo-600" />
                )}
              </button>
              {openIndex === index && <p className="mt-4 text-gray-600">{faq.answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
