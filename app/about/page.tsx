import Link from "next/link";
import { ArrowLeft, X, Mail, ExternalLink } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Navigation */}
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16 sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="w-full max-w-7xl flex justify-between items-center p-3 px-5 text-sm">
          <Link href="/" className="text-xl font-bold text-primary">
            Chinese<span className="text-orange-500">101</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">About the Developer</h1>

          <div className="bg-gradient-to-br from-blue-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 p-8 rounded-2xl mb-12">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-orange-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
                LT
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">Lyra Tang</h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  Founder & Developer of Chinese101
                </p>
                <div className="flex items-center gap-4">
                  <a
                    href="https://x.com/Lyra_Tang"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <X className="w-4 h-4" />
                    @Lyra_Tang
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="mailto:tl18774902382@gmail.com"
                    className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">My Story</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                I&apos;m a developer with a passion for language learning and technology. As someone who has experienced the challenges of learning Chinese as a foreign language, I understand the unique difficulties international students and travelers face when trying to master Chinese typing and digital communication.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                Chinese101 was created to solve a real problem: helping foreigners develop practical Chinese typing skills through interactive, engaging lessons. The platform focuses on HSK exam preparation and real-world scenarios you&apos;ll encounter when living, studying, or doing business in China.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Why I Built Chinese101</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Traditional Chinese learning methods often overlook the critical skill of typing Chinese characters efficiently. In today&apos;s digital world, whether you&apos;re taking the HSK computer-based exam, communicating with Chinese colleagues, or navigating daily life in China, being able to type Chinese quickly and accurately is essential.
              </p>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-4">
                I built Chinese101 to provide a focused, practical solution that helps learners build muscle memory for Pinyin input and Chinese character typing through repetition and instant feedback.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Technology & Approach</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Chinese101 is built with modern web technologies including Next.js, TypeScript, and Supabase. The platform is designed to be:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2 text-gray-600 dark:text-gray-300">
                <li>Accessible from any device with a web browser</li>
                <li>Focused on practical, real-world Chinese typing scenarios</li>
                <li>Integrated with HSK curriculum standards</li>
                <li>Continuously improving based on learner feedback</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                I welcome feedback, suggestions, and questions from the Chinese101 community. Whether you&apos;re a current user, potential learner, or fellow developer, I&apos;d love to hear from you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="mailto:tl18774902382@gmail.com"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Me
                </a>
                <a
                  href="https://x.com/Lyra_Tang"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-semibold transition-colors dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  <X className="w-4 h-4" />
                  Follow on X
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </section>

            <section className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-2">Transparency Note</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                Chinese101 is an independent project currently in active development. As we grow, we&apos;re committed to transparency in our approach and welcome constructive feedback from our community. This platform is built with learners&apos; needs in mind, and your input helps shape its future.
              </p>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 Chinese101. All rights reserved.</p>
            <p className="mt-2">
              Built with ❤️ for the Chinese learning community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
