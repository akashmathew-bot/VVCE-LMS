import { motion } from "motion/react";
import { useState } from "react";
import {
  Mail,
  Phone,
  GraduationCap,
  Wrench,
  Heart,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Calendar,
  Map,
  AlertCircle,
} from "lucide-react";

export function Help() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const contactCategories = [
    {
      icon: GraduationCap,
      title: "Academic Support",
      email: "academic@vvce.ac.in",
      phone: "+91 98765 11111",
      description: "Course queries, assignment help, exam-related",
    },
    {
      icon: Wrench,
      title: "Technical Support",
      email: "techsupport@vvce.ac.in",
      phone: "+91 98765 22222",
      description: "Portal issues, login problems, system errors",
    },
    {
      icon: Heart,
      title: "Counseling Services",
      email: "counseling@vvce.ac.in",
      phone: "+91 98765 33333",
      description: "Mental health, career guidance, personal issues",
    },
  ];

  const faqs = [
    {
      question: "How to reset password?",
      answer:
        "Click on 'Forgot Password' on the login page, enter your VVCE email address, and follow the instructions sent to your email.",
    },
    {
      question: "How to check attendance?",
      answer:
        "Navigate to Dashboard and scroll down to the Attendance section to view your attendance percentage for all subjects.",
    },
    {
      question: "How to apply for leave?",
      answer:
        "Go to the Leave Application section in your profile, fill out the form with reason and dates, and submit for approval.",
    },
    {
      question: "When are exam results published?",
      answer:
        "Exam results are typically published 2-3 weeks after the examination. You'll receive a notification when results are available.",
    },
    {
      question: "How to access library resources?",
      answer:
        "Use your student credentials to log in to the digital library portal. Physical books can be borrowed using your student ID card.",
    },
    {
      question: "How to register for clubs?",
      answer:
        "Visit the Clubs page, browse available clubs, click on the club you're interested in, and click the 'Join Club' button.",
    },
    {
      question: "Bus schedule updates?",
      answer:
        "Bus schedules are updated in real-time on the Bus Schedules page. Enable notifications to receive alerts about delays or changes.",
    },
    {
      question: "How to submit assignments online?",
      answer:
        "Go to Assignments page, select the assignment, click 'Upload Assignment', choose your file, and submit before the deadline.",
    },
  ];

  const quickLinks = [
    {
      icon: ExternalLink,
      label: "Official College Website",
      href: "#",
    },
    {
      icon: FileText,
      label: "Student Handbook",
      href: "#",
    },
    {
      icon: Calendar,
      label: "Academic Calendar",
      href: "#",
    },
    {
      icon: Map,
      label: "Campus Map",
      href: "#",
    },
    {
      icon: AlertCircle,
      label: "Emergency Contacts",
      href: "#",
    },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-8">
          Help & Support
        </h1>

        {/* Contact Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {contactCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-gray-200 rounded p-6"
              >
                <div className="w-12 h-12 rounded flex items-center justify-center mb-4 border border-gray-300 bg-gray-50">
                  <Icon size={24} className="text-black" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-500 text-sm mb-4">
                  {category.description}
                </p>
                <div className="space-y-2">
                  <a
                    href={`mailto:${category.email}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors text-sm"
                  >
                    <Mail size={16} />
                    <span>{category.email}</span>
                  </a>
                  <a
                    href={`tel:${category.phone}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors text-sm"
                  >
                    <Phone size={16} />
                    <span>{category.phone}</span>
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded p-6 mb-8"
        >
          <h2 className="text-2xl font-bold text-black mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded overflow-hidden"
              >
                <button
                  onClick={() =>
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="text-black font-semibold">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="text-black" size={20} />
                  ) : (
                    <ChevronDown className="text-gray-500" size={20} />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4 text-gray-700">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 rounded p-6"
        >
          <h2 className="text-2xl font-bold text-black mb-6">Quick Links</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 transition-all group"
                >
                  <Icon
                    className="text-black group-hover:scale-110 transition-transform"
                    size={20}
                  />
                  <span className="text-black text-sm">{link.label}</span>
                </a>
              );
            })}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
