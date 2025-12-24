import { motion } from 'framer-motion';
import { Mail, Phone, ExternalLink, Briefcase, GraduationCap, Mic } from 'lucide-react';
import logoImage from '../assets/logo.jpg';

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-50 to-white">
            {/* Hero Section */}
            <section className="relative py-20 px-4 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-maroon-900/5 to-transparent" />
                <div className="max-w-7xl mx-auto relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 heading-serif">
                            A bit <span className="text-maroon-700">about me</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Hello, I'm Deepak Bhatt.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
                    >
                        {/* Profile Section */}
                        <div className="flex flex-col md:flex-row gap-8 mb-10">
                            <div className="flex-shrink-0">
                                <img
                                    src={logoImage}
                                    alt="Business Talk Logo"
                                    className="w-32 h-32 object-contain mx-auto rounded-full shadow-lg"
                                />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 heading-serif">
                                    Deepak Bhatt
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    I am the Founder & CEO of{' '}
                                    <a
                                        href="https://www.globalmanagementconsultancy.com/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-maroon-700 hover:underline font-medium"
                                    >
                                        Global Management Consultancy
                                    </a>{' '}
                                    and a Business Consultant for BW Businessworld Media in Gujarat.
                                    With over 20 years of experience across multiple industries, I am
                                    passionate about driving both individual and organizational success.
                                </p>
                            </div>
                        </div>

                        {/* Business Talk Section */}
                        <div className="mb-10 p-6 bg-maroon-50 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <Mic className="w-6 h-6 text-maroon-700" />
                                <h3 className="text-xl font-bold text-maroon-700 heading-serif">
                                    Business Talk Podcast
                                </h3>
                            </div>
                            <p className="text-gray-700 leading-relaxed">
                                In June 2024, I launched{' '}
                                <a
                                    href="/"
                                    className="text-maroon-700 hover:underline font-medium"
                                >
                                    Business Talk
                                </a>
                                , a podcast series designed to bridge academic rigor with practical
                                insights through research-focused conversations. This platform is
                                dedicated to featuring thought-provoking discussions with leading
                                global academics and thinkers, spotlighting emerging trends, innovative
                                ideas, and transformative insights from business and academia.
                            </p>
                        </div>

                        {/* Professional Journey */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <Briefcase className="w-6 h-6 text-maroon-700" />
                                <h3 className="text-xl font-bold text-gray-900 heading-serif">
                                    Professional Journey
                                </h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                My professional journey spans sectors such as Academics, FMCG, Retail,
                                Power & Transmission, Food & Agri-business, Pharmaceuticals, Packaging,
                                Advertising, Media, and Education. Each of these fields has shaped my
                                approach to problem-solving and inspired my commitment to creating lasting,
                                impactful results.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                The most rewarding aspect of my work is when a small piece of advice or
                                a simple action leads to meaningful change, guiding individuals toward
                                their next level of success. This continual learning and growth inspire
                                me to push boundaries and deliver exceptional results that positively
                                influence those I work with.
                            </p>
                        </div>

                        {/* Teaching Section */}
                        <div className="mb-10">
                            <div className="flex items-center gap-3 mb-4">
                                <GraduationCap className="w-6 h-6 text-maroon-700" />
                                <h3 className="text-xl font-bold text-gray-900 heading-serif">
                                    Academic Contributions
                                </h3>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                In addition to my consultancy roles, I also teach MBA and Executive
                                Education courses on topics ranging from Digital Marketing and Social
                                Media Analytics to Organizational Development, Coaching, and Training
                                & Development, where I continue to share my knowledge and insights with
                                the next generation of leaders.
                            </p>
                        </div>

                        {/* Contact Information */}
                        <div className="border-t pt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 heading-serif">
                                Get in Touch
                            </h3>
                            <div className="flex flex-col sm:flex-row gap-6">
                                <a
                                    href="tel:91-94294-23232"
                                    className="flex items-center gap-3 text-gray-600 hover:text-maroon-700 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-maroon-100 rounded-full flex items-center justify-center">
                                        <Phone className="w-5 h-5 text-maroon-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Call</p>
                                        <p className="font-medium">91-94294-23232</p>
                                    </div>
                                </a>
                                <a
                                    href="mailto:hellomrbhatt@gmail.com"
                                    className="flex items-center gap-3 text-gray-600 hover:text-maroon-700 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-maroon-100 rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-maroon-700" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">E-mail</p>
                                        <p className="font-medium">hellomrbhatt@gmail.com</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* External Links */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="max-w-7xl mx-auto text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-8 heading-serif">
                        Explore More
                    </h3>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a
                            href="https://www.globalmanagementconsultancy.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-maroon-700 text-white rounded-lg hover:bg-maroon-800 transition-colors"
                        >
                            <ExternalLink className="w-5 h-5 mr-2" />
                            Global Management Consultancy
                        </a>
                        <a
                            href="https://www.youtube.com/@businesstalkwithdeepakbhatt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            <ExternalLink className="w-5 h-5 mr-2" />
                            YouTube Channel
                        </a>
                        <a
                            href="https://www.deepakbbhatt.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                        >
                            <ExternalLink className="w-5 h-5 mr-2" />
                            Main Website
                        </a>
                    </div>
                </div>
            </section>

            {/* Copyright */}
            <section className="py-8 bg-maroon-900 text-center">
                <p className="text-maroon-100">
                    Copyright @ 2025 by Deepak Bhatt
                </p>
            </section>
        </div>
    );
}
