import { useEffect, useState } from "react";
import "./HeroSection.css";

const slides = [
  {
    title: "Stressed out with your workload?",
    subtitle: "Reach out to us for support.",
    image: "/images/stressed.jpg",
  },
  {
    title: "We're here to help.",
    subtitle: "Specialists in tutoring and academic writing.",
    image: "/images/happy.jpg",
  },
  // Updated third slide in slides array
{
  title: "Your Complete Academic Partner",
  subtitle: "End-to-end support at every level",
  content: (
    <div className="services-display">
      {/* Animated education levels */}
      <div className="levels-track">
        {['Primary', 'Secondary', 'High School', 'Bachelors', 'Masters', 'PhD'].map((level, i) => (
          <div 
            key={level}
            className="level-card"
            style={{ 
              animationDelay: `${i * 0.1}s`,
              background: `linear-gradient(135deg, ${i % 2 ? '#30525C' : '#0A1A24'}, ${i % 2 ? '#0A1A24' : '#30525C'})`
            }}
          >
            <div className="level-icon">
              {['📚', '✏️', '🎓', '📝', '🔬', '👨‍🎓'][i]}
            </div>
            <span>{level}</span>
          </div>
        ))}
      </div>

      {/* Subject disciplines as floating bubbles */}
      <div className="subjects-cloud">
        {['Humanities', 'Social Sciences', 'Natural Sciences', 'Formal Sciences', 'Applied Sciences', 'Professional Fields'].map((subject, i) => (
          <div 
            key={subject}
            className="subject-bubble"
            style={{
              animationDelay: `${i * 0.15 + 0.6}s`,
              background: `radial-gradient(circle, ${['#F6C992', '#D396A6', '#09A1A1', '#ACCOD3', '#5484A4', '#30525C'][i]}, #0A1A24)`
            }}
          >
            {subject}
          </div>
        ))}
      </div>
    </div>
  )
}
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Calculate rotation angles for 3 sides
  const getTransform = () => {
    switch(current) {
      case 0: return "rotateY(0deg)";
      case 1: return "rotateY(-120deg)";
      case 2: return "rotateY(-240deg)";
      default: return "rotateY(0deg)";
    }
  };

  return (
    <section id="hero" className="relative bg-gradient-to-b from-[#0A1A24] via-[#30525C] to-[#0A1A24] pb-[1px]">
      <div className="hero-container">
        <div className="cube" style={{ transform: getTransform() }}>
          {/* Front face */}
          <div className="cube-face cube-front">
            <SlideContent {...slides[0]} />
          </div>
          {/* Right face */}
          <div className="cube-face cube-right">
            <SlideContent {...slides[1]} />
          </div>
          {/* Left face */}
          <div className="cube-face cube-left">
            {slides[2].content || <SlideContent {...slides[2]} />}
          </div>
        </div>
      </div>
    </section>
  );
}

function SlideContent({ title, subtitle, image, content }) {
  return (
    <div className="hero-content">
      <div className="hero-text">
        <h1 className="hero-title">{title}</h1>
        <h2 className="hero-subtitle">{subtitle}</h2>
        {content}
      </div>
      {image && (
        <div className="hero-image-container">
          <img src={image} alt="Slide" className="hero-image" />
        </div>
      )}
    </div>
  );
}