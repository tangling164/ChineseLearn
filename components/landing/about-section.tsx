"use client";

import { motion } from "framer-motion";
import { Brain, Target, Users } from "lucide-react";

export function AboutSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why International Students Choose{" "}
            <span className="text-orange-500">Chinese Typing Practice?</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Perfect for HSK exam preparation and life in China. Our typing-based approach helps 
            you learn Chinese faster than traditional methods by building muscle memory for Pinyin input.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">HSK Exam Success</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Specifically designed for HSK computer-based tests. Build speed and accuracy in Chinese 
              typing to excel in your HSK exam and daily communication in China.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Target className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">China Travel Ready</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Learn practical Chinese phrases for dining, shopping, and business meetings. 
              Master typing Chinese characters you&apos;ll use when traveling or working in China.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center group"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Business Chinese Focus</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Tailored lessons for business professionals and entrepreneurs. Learn Chinese typing 
              skills for email, documents, and digital communication in the Chinese workplace.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
} 