// src/pages/PrivacyTerms.jsx
import React, { useState } from "react";
import Layout from "./layout/Layout";

const PrivacyTerms = () => {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { id: "about", label: "🏬 About Allmart" },
    { id: "privacy", label: "🔒 Privacy Policy" },
    { id: "terms", label: "📜 Terms & Conditions" },
  ];

  return (
    <Layout>
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Main Card */}
      <div className="mx-4 sm:mx-6 md:mx-auto max-w-3xl sm:max-w-5xl bg-white rounded-3xl shadow-2xl py-8 sm:py-12 px-4 sm:px-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 text-gray-900 text-center">
          Allmart 🛒
        </h1>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row justify-center sm:space-x-4 space-y-3 sm:space-y-0 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300
              ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-6 text-gray-700 text-sm sm:text-base leading-relaxed">
          {activeTab === "about" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
                🏬 About Allmart
              </h2>
              <p className="mb-3">
                Allmart is a modern e-commerce platform that connects buyers and
                sellers seamlessly. Our goal is to create a trusted, secure, and
                enjoyable shopping experience. Whether you're buying 🛍️ or
                selling 📦, Allmart provides smart tools, verified user badges
                ✅, and secure payment options 💳.
              </p>
              <p>
                We focus on transparency, reliability, and innovation, ensuring
                that everyone can engage in online commerce confidently.
              </p>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
                🔒 Privacy Policy
              </h2>
              <p className="mb-3">
                Your privacy is our priority. This policy explains how Allmart
                collects, uses, and protects your information.
              </p>
              <ul className="list-disc list-inside space-y-2 mb-3 pl-4">
                <li>
                  We collect personal info like your name, email, and account
                  details to provide our services.
                </li>
                <li>
                  Your data is used to process transactions 💳, improve the
                  platform, and communicate with you 📧.
                </li>
                <li>
                  We use industry-standard security measures 🔐 to protect your
                  information.
                </li>
                <li>
                  We never sell or share your personal data without your
                  consent.
                </li>
                <li>By using Allmart, you agree to this privacy policy ✅.</li>
              </ul>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="animate-fadeIn">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
                📜 Terms & Conditions
              </h2>
              <p className="mb-3">
                By using Allmart, you agree to the following terms:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-3 pl-4">
                <li>Keep your account info and password secure 🔑.</li>
                <li>
                  Provide accurate information and avoid fraudulent activity ❌.
                </li>
                <li>
                  Sellers must comply with Allmart rules and local laws 📜.
                </li>
                <li>
                  We may suspend or terminate accounts violating the terms ⚠️.
                </li>
                <li>Continued use implies acceptance of updated terms 🔄.</li>
                <li>Use the platform for lawful purposes only ✅.</li>
              </ul>
              <p>
                Questions? Contact us at{" "}
                <span className="text-blue-600 underline">
                  support@allmart.com
                </span>
                .
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Card for Extra Info */}
      <div className="mx-4 sm:mx-6 md:mx-auto max-w-3xl sm:max-w-5xl bg-white rounded-3xl shadow-2xl py-6 sm:py-10 px-4 sm:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">
          💡 Customer Support & Features
        </h2>
        <p className="mb-3">
          Allmart offers a variety of features to make your shopping experience
          smooth and enjoyable:
        </p>
        <ul className="list-disc list-inside space-y-2 pl-4 mb-3 text-gray-700">
          <li>
            24/7 customer support 📞 to help with any questions or issues.
          </li>
          <li>Verified sellers ✅ to ensure trustworthy transactions.</li>
          <li>Easy checkout and secure payments 💳.</li>
          <li>Track your orders in real-time 📦.</li>
          <li>Exclusive deals and promotions 🏷️ for our users.</li>
        </ul>
        <p className="text-gray-700">
          For any inquiries, reach out to{" "}
          <span className="text-blue-600 underline">support@allmart.com</span>{" "}
          or visit our Help Center.
        </p>
      </div>
    </div>
</Layout>
  );
};

export default PrivacyTerms;
