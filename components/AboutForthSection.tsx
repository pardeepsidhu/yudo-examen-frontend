'use client';

export function AboutForthSection() {
  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center px-2 sm:px-6 md:px-20 py-10 sm:py-16 md:py-24 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-blue-100">
      {/* Section Badge */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
        <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-indigo-400 via-blue-400 to-sky-400 text-xs sm:text-sm md:text-lg shadow-lg tracking-wide border-2 border-white/70 animate-bounce-slow select-none text-white">
          What Our Users Say
        </span>
      </div>

      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-32 h-32 sm:w-44 sm:h-44 bg-blue-200 rounded-full opacity-30 blur-3xl animate-pulse-slow pointer-events-none" style={{ zIndex: 0 }} />
      <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-56 sm:h-56 bg-indigo-200 rounded-full opacity-30 blur-3xl animate-pulse-slower pointer-events-none" style={{ zIndex: 0 }} />
      <div
        className="absolute top-1/2 left-1/2 w-[12rem] h-[12rem] sm:w-[20rem] sm:h-[20rem] rounded-full opacity-10 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 60% 40%, #6366f1 0%, transparent 70%)`,
          transform: 'translate(-50%, -50%)',
          filter: 'blur(32px)',
          zIndex: 0
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-6xl">
        {/* Stats */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center mb-8 sm:mb-12 w-full">
          <StatCard value="25,000+" label="Active Users" />
          <StatCard value="120,000+" label="Questions Practiced" />
          <StatCard value="4.9/5" label="Average Rating" />
        </div>
        {/* Reviews */}
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 w-full">
          <ReviewCard
            name="Aarav Sharma"
            role="Student"
            review="Yudo Examen made my exam prep so much easier! The AI-generated solutions and instant feedback are amazing."
            avatar="https://randomuser.me/api/portraits/men/32.jpg"
          />
          <ReviewCard
            name="Priya Verma"
            role="Teacher"
            review="I love how I can create test series and track my students' progress. The multi-language support is a game changer."
            avatar="https://randomuser.me/api/portraits/women/44.jpg"
          />
          <ReviewCard
            name="Rahul Singh"
            role="Developer"
            review="The platform is super intuitive and the media support for questions is unique. Highly recommended for all learners!"
            avatar="https://randomuser.me/api/portraits/men/65.jpg"
          />
        </div>
      </div>
      {/* Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: .30; }
          50% { opacity: .45; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s infinite;
        }
        @keyframes pulse-slower {
          0%, 100% { opacity: .30; }
          50% { opacity: .55; }
        }
        .animate-pulse-slower {
          animation: pulse-slower 7s infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0);}
          50% { transform: translateY(-10px);}
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite;
        }
      `}</style>
    </section>
  );
}

// StatCard component
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center bg-white/80 rounded-2xl shadow-lg px-6 py-5 sm:px-8 sm:py-6 border border-blue-100 min-w-[110px] sm:min-w-[140px] w-full sm:w-auto mb-2 sm:mb-0">
      <div className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-indigo-500 to-sky-400 bg-clip-text text-transparent">{value}</div>
      <div className="text-gray-700 font-semibold mt-2 text-xs sm:text-base text-center">{label}</div>
    </div>
  );
}

// ReviewCard component
function ReviewCard({
  name,
  role,
  review,
  avatar,
}: {
  name: string;
  role: string;
  review: string;
  avatar: string;
}) {
  return (
    <div className="flex flex-col items-center bg-white/90 rounded-2xl shadow-xl p-5 sm:p-7 border border-blue-100 hover:shadow-2xl transition-all duration-200 w-full">
      <img
        src={avatar}
        alt={name}
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-indigo-100 shadow mb-3 object-cover"
      />
      <div className="font-bold text-base sm:text-lg text-indigo-700">{name}</div>
      <div className="text-xs sm:text-sm text-blue-500 mb-2">{role}</div>
      <div className="text-gray-600 text-center text-xs sm:text-sm">{review}</div>
    </div>
  );
}