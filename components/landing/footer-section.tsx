"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail } from "lucide-react";

export function FooterSection() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="col-span-1"
          >
            <Link href="/" className="text-2xl font-bold mb-4 block">
              Chinese<span className="text-orange-500">101</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Master Chinese typing through interactive lessons designed for HSK exam preparation and China travel.
            </p>
            <div className="flex space-x-4">
              <a href="mailto:tl18774902382@gmail.com" className="text-gray-400 hover:text-white transition-colors" title="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="mailto:tl18774902382@gmail.com" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
        >
          <p>&copy; 2024 Chinese101. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  );
} 