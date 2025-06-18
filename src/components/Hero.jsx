import { useEffect, useState } from "react";
import "./HeroSection.css";

const slides = [
  {
    title: "Stressed out with your workload?",
    subtitle: "Reach out to us for support.",
    image: "/images/stressed.jpg",
  },
  {
    title: "We’re here to help.",
    subtitle: "Specialists in tutoring and academic writing.",
    image: "/images/happy.jpg",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000); // 6s delay

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-container">
      <div className="cube" style={{ transform: `rotateY(-${current * 180}deg)` }}>
        <div className="cube-face cube-front">
          <SlideContent {...slides[0]} />
        </div>
        <div className="cube-face cube-back">
          <SlideContent {...slides[1]} />
        </div>
      </div>
    </div>
  );
}

function SlideContent({ title, subtitle, image }) {
  return (
    <div className="hero-content">
      <div className="hero-text">
        <h1 className="hero-title">{title}</h1>
        <h2 className="hero-subtitle">{subtitle}</h2>
      </div>
      <div className="hero-image-container">
        <img src={image} alt="Slide" className="hero-image" />
      </div>
    </div>
  );
}
