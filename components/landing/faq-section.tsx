"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="border-b border-gray-200 dark:border-gray-700"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors pr-4">
          {question}
        </span>
        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
          {isOpen ? (
            <Minus className="w-4 h-4 text-primary" />
          ) : (
            <Plus className="w-4 h-4 text-primary" />
          )}
        </div>
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="pb-6"
        >
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {answer}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

export function FAQSection() {
  const faqs = [
    {
      question: "What is Chinese101?",
      answer: "Chinese101 is an interactive online platform designed to help you master Chinese typing through practical lessons. Our curriculum is specifically designed for HSK exam preparation and practical use during travel in China.",
    },
    {
      question: "How does the subscription work?",
      answer: "We offer flexible monthly and annual subscription plans. Your subscription gives you unlimited access to all lessons, progress tracking, and new content as it's released. You can cancel your subscription at any time from your account dashboard.",
    },
    {
      question: "What is your refund policy?",
      answer: "We offer a 30-day money-back guarantee for all new subscriptions. If you're not satisfied with Chinese101 within 30 days of your purchase, contact us at tl18774902382@gmail.com for a full refund. To be eligible, your account must not have completed more than 10 lessons. Refunds are processed within 5-10 business days to your original payment method.",
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription at any time from your account settings. Once canceled, you'll continue to have access until the end of your current billing period. No additional charges will be made after cancellation.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards and debit cards through our secure payment processor, Creem. All transactions are encrypted and secure. We do not store your payment information on our servers.",
    },
    {
      question: "Do I need any special software to use Chinese101?",
      answer: "No special software is required. Chinese101 works directly in your web browser on desktop, tablet, or mobile devices. We recommend using a modern browser like Chrome, Firefox, Safari, or Edge for the best experience.",
    },
    {
      question: "What if I have technical issues or questions?",
      answer: "Our support team is here to help! You can reach us at tl18774902382@gmail.com. We typically respond within 24 hours during business days. For urgent issues, please include 'URGENT' in your email subject line.",
    },
    {
      question: "How is my personal information protected?",
      answer: "We take your privacy seriously. All your data is encrypted and stored securely. We never sell your personal information to third parties. For more details, please review our Privacy Policy.",
    },
    {
      question: "Can I change my subscription plan?",
      answer: "Yes! You can upgrade or downgrade your subscription plan at any time from your account settings. If you upgrade, you'll be charged a prorated amount. If you downgrade, the change will take effect at the start of your next billing cycle.",
    },
    {
      question: "Are there any hidden fees?",
      answer: "No hidden fees. The price you see is the price you pay. Your subscription will automatically renew at the same rate unless you cancel. You'll receive an email reminder before each renewal.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about Chinese101, subscriptions, and our services.
          </p>
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              index={index}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <p className="text-gray-600 dark:text-gray-400">
            Still have questions?{" "}
            <a
              href="mailto:tl18774902382@gmail.com"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

