import React, { useMemo, useState, useEffect, useRef } from 'react';
import myPic from '../assets/mypic.png';

// Import technology logos
import pytorchLogo from '../assets/icons8-torch-100.png';
import tensorflowLogo from '../assets/icons8-tensorflow-100.png';
import neuralNetLogo from '../assets/icons8-artificial-intelligence-brain-96.png';
import visionLogo from '../assets/icons8-vision-100.png';
import pythonLogo from '../assets/icons8-python-96.png';
import sqlLogo from '../assets/icons8-sql-100.png';
import jsLogo from '../assets/icons8-javascript-100.png';
import flaskLogo from '../assets/icons8-flask-100.png';
import postgresLogo from '../assets/icons8-postgresql-100.png';
import mysqlLogo from '../assets/icons8-mysql-logo-100.png';
import firebaseLogo from '../assets/icons8-google-firebase-console-100.png';
import dataAnalysisLogo from '../assets/icons8-data-analysis-100.png';
import powerbiLogo from '../assets/icons8-power-bi-100.png';
import reactLogo from '../assets/icons8-react-100.png';
import flutterLogo from '../assets/icons8-flutter-100.png';
import htmlLogo from '../assets/icons8-html-5-100.png';
import cssLogo from '../assets/icons8-css-100.png';
import streamlitLogo from '../assets/icons8-streamlit-100.png';
import networkLogo from '../assets/icons8-network-100.png';
import vscodeLogo from '../assets/icons8-vs-code-100.png';
import jupyterLogo from '../assets/icons8-jupyter-100.png';
import googleMapsLogo from '../assets/icons8-google-maps-100.png';
import opencvLogo from '../assets/icons8-opencv-100.png';

import { 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  Menu, 
  X, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Code, 
  ExternalLink, 
  Users, 
  TrendingUp, 
  Shield, 
  Cpu, 
  Database, 
  Brain, 
  Sparkles, 
  Trophy, 
  Rocket, 
  ChevronRight,
  MapPin,
  Download,
  Layout,
  Heart,
  Instagram,
  Facebook,
  Zap,
  Target,
  Star,
  Stethoscope,
  BookOpen
} from 'lucide-react';
import '../styles/Portfolio.css';
import Chatbot from './Chatbot';

// Data for services
const services = [
  {
    title: "Machine Learning",
    icon: <Brain size={28} />,
    description: "Building intelligent models using PyTorch, TensorFlow, and Graph Neural Networks for fraud detection, classification, and predictive analytics."
  },
  {
    title: "Data Science",
    icon: <Database size={28} />,
    description: "Transforming complex data into actionable insights through analysis, visualization, and statistical modeling using Python and SQL."
  },
  {
    title: "Web Development",
    icon: <Layout size={28} />,
    description: "Creating responsive and modern frontend interfaces with React, HTML/CSS, and JavaScript. Building beautiful user experiences."
  },
  {
    title: "Computer Vision",
    icon: <Cpu size={28} />,
    description: "Developing image recognition, biometric authentication, and visual AI systems using OpenCV, MediaPipe, and deep learning."
  },
  {
    title: "AI Solutions",
    icon: <Sparkles size={28} />,
    description: "Designing end-to-end AI-powered applications that solve real-world problems with social impact and scalability."
  },
  {
    title: "Research & Innovation",
    icon: <Rocket size={28} />,
    description: "Exploring cutting-edge technologies in GNNs, NLP, and deep learning to create award-winning innovative solutions."
  }
];

// Data for projects with detailed highlights
const projects = [
  {
    title: "MYTHOVERSE AI",
    rank: 5,
    github: "https://github.com/Venkatesh056/Story-Generation",
    subtitle: "AI-Powered Cultural World Mythology & Tamil Heritage Storytelling Engine ",
    icon: <BookOpen size={28} />,
    tech: [
      "Hugging Face Transformers",
      "OpenAI Image API",
      "LangChain",
      "FastAPI",
      "PostgreSQL",
      "Streamlit",
      "React",
      "NLP"
    ],
    description:
      "Generative AI platform that creates culturally rich mythology and historical stories across Indian and global traditions. The system uses Hugging Face language models for narrative generation and OpenAI-powered image generation to produce immersive, age-adaptive stories accompanied by visually rich artwork.",
    highlights: [
      "LLM-powered story generation using Hugging Face models",
      "AI-generated illustrations via OpenAI image APIs",
      "Supports Indian mythology, regional history, and global legends",
      "Age-adaptive storytelling: kids, teens, and adults",
      "Multi-language support with cultural context preservation",
      "Outputs stories as web experiences, PDFs, and audio-ready formats"
    ],
    impact:
      "Transforms cultural heritage into scalable, engaging AI-driven storytelling experiences for education, preservation, and global audiences"
  },
  {
    title: "TRI-BIOMETRIX",
    rank: 2,
    github: "https://github.com/Venkatesh056/TRI-BIOMETRIX",
    subtitle: "Next-Gen Multimodal Security Platform",
    icon: <Cpu size={28} />,
    tech: ["TensorFlow", "OpenCV", "MediaPipe", "CNN", "Voice AI", "Streamlit"],
    description: "Cutting-edge security system combining facial recognition, voice biometrics, and hand-gesture verification for impenetrable three-factor authentication.",
    highlights: [
      "Triple-layer biometric verification",
      "99.2% authentication accuracy",
      "Anti-spoofing technology integrated",
      "Banking, healthcare & smart surveillance ready"
    ],
    impact: "95% reduction in unauthorized access"
  },
  {
    title: "NETRATAX",
    rank: 1,
    github: "https://github.com/Venkatesh056/GNN_NETRATAX",
    subtitle: "AI-Powered Tax Fraud Detection System",
    icon: <Shield size={28} />,
    tech: ["PyTorch Geometric", "GNN", "Flask", "NetworkX", "PostgreSQL", "ReactJS"],
    description: "Revolutionary AI system leveraging Graph Neural Networks to combat financial fraud at scale. Analyzes complex invoice networks and identifies shell companies with unprecedented accuracy.",
    highlights: [
      "87% fraud detection accuracy with <5% false positives",
      "Processes 10,000+ invoice networks in real-time",
      "Automated graph construction & risk scoring",
      "Interactive fraud visualization dashboards"
    ],
    impact: "Potentially saving millions in tax revenue"
  },
  {
    title: "FoodBridge",
    rank: 3,
    github: "https://github.com/Venkatesh056/FoodBridge-",
    subtitle: "Community-Driven Food Redistribution",
    icon: <Users size={28} />,
    tech: ["Flutter", "Firebase", "Google Maps API", "REST API", "Python"],
    description: "Social impact platform connecting food surplus with communities in need. Real-time matching, GPS tracking, and seamless donation coordination.",
    highlights: [
      "Real-time location tracking & alerts",
      "Connects households, restaurants & NGOs",
      "Transparent community-driven sharing",
      "Reduces food waste while fighting hunger"
    ],
    impact: "1000+ meals donated, 40% waste reduction"
  },
  {
    title: "AI-Multimodal MEDI-INTERPRETER",
    rank: 4,
    github: "https://github.com/Venkatesh056/AI-Multimodal-MEDI-INTERPRETER",
    subtitle: "AI-Powered Multimodal Medical Interpreter",
    icon: <Stethoscope size={28} />,
    tech: [
      "TensorFlow",
      "EfficientNet",
      "CNN",
      "NLP",
      "Whisper",
      "DeepFace",
      "Flask",
      "Streamlit",
      "OpenCV"
    ],
    description:
      "Advanced healthcare AI system that bridges doctor–patient communication gaps using multimodal intelligence. The platform processes multilingual voice, text, medical images, and facial emotions to assist in accurate skin disease analysis and clinical decision support.",
    highlights: [
      "Trained on 30,000+ class-labeled skin disease images",
      "Multi-class skin disease classification across 20+ conditions",
      "Achieved ~75–85% validation accuracy after fine-tuning",
      "Real-time multilingual speech-to-text & translation",
      "Emotion-aware analysis for patient stress and severity detection",
      "Automated remedies, causes, and treatment recommendations"
    ],
    impact:
      "Enhances diagnostic accuracy, accessibility, and empathetic care in telemedicine, rural clinics, and multilingual healthcare environments"
  },
];

// Data for achievements with icons
const achievements = [
  {
    title: "SMART INDIA HACKATHON 2025",
    subtitle: "National Innovation Challenge",
    description: "Selected among top 50 teams nationwide from 10,000+ applicants",
    icon: <Trophy size={24} />,
    badge: "TOP 50",
    badgeColor: "badge-gold"
  },
  {
    title: "TECH SCULPT EXPO 2025",
    subtitle: "IEEE Student Branch CIT",
    description: "Winner - Excellence in technological innovation and project presentation",
    icon: <Award size={24} />,
    badge: "WINNER",
    badgeColor: "badge-orange"
  },
  {
    title: "CIT SPARK GRANT 2025",
    subtitle: "Innovation Funding",
    description: "Finalist - Exceptional community impact and technical excellence",
    icon: <Zap size={24} />,
    badge: "FINALIST",
    badgeColor: "badge-yellow"
  },
    {
      title: "ASTRANOVA HACKATHON 2026",
      subtitle: "Dept of IT, CIT",
      description: "First Runner-up, recognized for high-impact innovation.",
      icon: <Rocket size={24} />,
      badge: "RUNNER-UP",
      badgeColor: "badge-purple"
    },
  {
    title: "THE BIG HACK 2025",
    subtitle: "AIT Bangalore Hackathon",
    description: "Top 5 finalist from 82 teams - 24-hour innovation sprint",
    icon: <Rocket size={24} />,
    badge: "TOP 5",
    badgeColor: "badge-red"
  },
  {
    title: "GLYTCH 2025",
    subtitle: "VIT Chennai Hackathon",
    description: "Top 6 finalist from 60 teams - 24-hour innovation sprint",
    icon: <Rocket size={24} />,
    badge: "TOP 6",
    badgeColor: "badge-red"
  },
    {
      title: "HackXios 2k25",
      subtitle: "AXIOS & AWS",
      description: "Participant - Demonstrated enthusiasm, innovation, teamwork, and problem-solving skills as part of TEAM WIN.EXE at HackXios 2k25 (29th December, 2025)",
      icon: <Award size={24} />,
      badge: "PARTICIPANT",
      badgeColor: "badge-yellow"
    },
  {
    title: "TRIATHLON (AXIOS 2024)",
    subtitle: "PSG College of Technology",
    description: 
    "Finalist - Multi-disciplinary technical competition",
    icon: <Target size={24} />,
    badge: "FINALIST",
    badgeColor: "badge-purple"
  },
  {
    title: "SCOUT CAPTAIN",
    subtitle: "Leadership & Service",
    description: "'Seva Ratna' by Governor of Tamil Nadu - 2.5 years service",
    icon: <Star size={24} />,
    badge: "AWARDED",
    badgeColor: "badge-green"
  }
];

// Data for co-curricular activities
const coCurricularActivities = [
  {
    title: "Secretary, 403Strats Club",
    organization: "CIT, Coimbatore",
    duration: "Apr '25 - Jun '26",
    description: "Led a 20-member team, organizing events and workshops that fostered collaboration and skill-building.",
    icon: <Users size={24} />
  },
  {
    title: "Event Coordinator, Rotaract Club - Athena",
    organization: "CIT, Coimbatore",
    duration: "Jul '25 - May '26",
    description: "Coordinating the 'Athena' event, managing logistics, volunteer teams, and ensuring smooth execution.",
    icon: <Target size={24} />
  },
  {
    title: "Innovation Lead & Editor, Datalytics Club",
    organization: "CIT, Coimbatore",
    duration: "Apr '24 - Mar '25",
    description: "Led creative projects and designed event posters using Canva to boost club visibility.",
    icon: <Sparkles size={24} />
  },
  {
    title: "Event Coordinator, Rotaract Club - Pagirvu",
    organization: "CIT, Coimbatore",
    duration: "Jan '25 - May '25",
    description: "Managed the 'Pagirvu' event, coordinating logistics and volunteer teams for successful delivery.",
    icon: <Target size={24} />
  }
];

// Technology Logo Image Components
const TechLogos = {
  PyTorch: () => <img src={pytorchLogo} alt="PyTorch" className="tech-logo-img" />,
  TensorFlow: () => <img src={tensorflowLogo} alt="TensorFlow" className="tech-logo-img" />,
  NeuralNet: () => <img src={neuralNetLogo} alt="Neural Networks" className="tech-logo-img" />,
  GNN: () => <img src={networkLogo} alt="GNN" className="tech-logo-img" />,
  ComputerVision: () => <img src={visionLogo} alt="Computer Vision" className="tech-logo-img" />,
  NLP: () => <img src={neuralNetLogo} alt="NLP" className="tech-logo-img" />,
  Python: () => <img src={pythonLogo} alt="Python" className="tech-logo-img" />,
  SQL: () => <img src={sqlLogo} alt="SQL" className="tech-logo-img" />,
  JavaScript: () => <img src={jsLogo} alt="JavaScript" className="tech-logo-img" />,
  Flask: () => <img src={flaskLogo} alt="Flask" className="tech-logo-img" />,
  API: () => <img src={networkLogo} alt="REST APIs" className="tech-logo-img" />,
  PostgreSQL: () => <img src={postgresLogo} alt="PostgreSQL" className="tech-logo-img" />,
  MySQL: () => <img src={mysqlLogo} alt="MySQL" className="tech-logo-img" />,
  Firebase: () => <img src={firebaseLogo} alt="Firebase" className="tech-logo-img" />,
  DataAnalysis: () => <img src={dataAnalysisLogo} alt="Data Analysis" className="tech-logo-img" />,
  PowerBI: () => <img src={powerbiLogo} alt="PowerBI" className="tech-logo-img" />,
  React: () => <img src={reactLogo} alt="React" className="tech-logo-img" />,
  Flutter: () => <img src={flutterLogo} alt="Flutter" className="tech-logo-img" />,
  HTML: () => <img src={htmlLogo} alt="HTML5" className="tech-logo-img" />,
  CSS: () => <img src={cssLogo} alt="CSS3" className="tech-logo-img" />,
  Streamlit: () => <img src={streamlitLogo} alt="Streamlit" className="tech-logo-img" />,
  NetworkX: () => <img src={networkLogo} alt="NetworkX" className="tech-logo-img" />,
  Git: () => <img src={networkLogo} alt="Git" className="tech-logo-img" />,
  VSCode: () => <img src={vscodeLogo} alt="VS Code" className="tech-logo-img" />,
  Jupyter: () => <img src={jupyterLogo} alt="Jupyter" className="tech-logo-img" />,
  GoogleMaps: () => <img src={googleMapsLogo} alt="Google Maps" className="tech-logo-img" />,
  OpenCV: () => <img src={opencvLogo} alt="OpenCV" className="tech-logo-img" />
};

// Data for skill categories with real logos
const skillCategories = [
  {
    title: "AI & Machine Learning",
    icon: <Brain size={20} />,
    skills: [
      { name: "PyTorch", icon: <TechLogos.PyTorch /> },
      { name: "TensorFlow", icon: <TechLogos.TensorFlow /> },
      { name: "Neural Networks", icon: <TechLogos.NeuralNet /> },
      { name: "GNN", icon: <TechLogos.GNN /> },
      { name: "Computer Vision", icon: <TechLogos.ComputerVision /> },
      { name: "NLP", icon: <TechLogos.NLP /> }
    ]
  },
  {
    title: "Programming",
    icon: <Code size={20} />,
    skills: [
      { name: "Python", icon: <TechLogos.Python /> },
      { name: "SQL", icon: <TechLogos.SQL /> },
      { name: "JavaScript", icon: <TechLogos.JavaScript /> },
      { name: "Flask", icon: <TechLogos.Flask /> },
      { name: "REST APIs", icon: <TechLogos.API /> }
    ]
  },
  {
    title: "Data & Databases",
    icon: <Database size={20} />,
    skills: [
      { name: "PostgreSQL", icon: <TechLogos.PostgreSQL /> },
      { name: "MySQL", icon: <TechLogos.MySQL /> },
      { name: "Firebase", icon: <TechLogos.Firebase /> },
      { name: "Data Analysis", icon: <TechLogos.DataAnalysis /> },
      { name: "PowerBI", icon: <TechLogos.PowerBI /> }
    ]
  },
  {
    title: "Web & Mobile Dev",
    icon: <Layout size={20} />,
    skills: [
      { name: "React", icon: <TechLogos.React /> },
      { name: "Flutter", icon: <TechLogos.Flutter /> },
      { name: "HTML/CSS", icon: <TechLogos.HTML /> },
      { name: "Streamlit", icon: <TechLogos.Streamlit /> },
      { name: "NetworkX", icon: <TechLogos.NetworkX /> }
    ]
  },
  {
    title: "Tools & Platforms",
    icon: <Cpu size={20} />,
    skills: [
      { name: "Git/GitHub", icon: <TechLogos.Git /> },
      { name: "VS Code", icon: <TechLogos.VSCode /> },
      { name: "Jupyter", icon: <TechLogos.Jupyter /> },
      { name: "Google Maps API", icon: <TechLogos.GoogleMaps /> },
      { name: "OpenCV", icon: <TechLogos.OpenCV /> }
    ]
  }
];

// Tech skills for About section with real logos
const aboutTechSkills = [
  { name: "HTML5", icon: <TechLogos.HTML /> },
  { name: "CSS3", icon: <TechLogos.CSS /> },
  { name: "JavaScript", icon: <TechLogos.JavaScript /> },
  { name: "Python", icon: <TechLogos.Python /> },
  { name: "React", icon: <TechLogos.React /> }
];

const Portfolio = () => {
  const [showCVOptions, setShowCVOptions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  // Find the index of NETRATAX (flagship) in the cards/projects array
  const flagshipId = "netra-tax";
  const flagshipIndex = projects.findIndex(p => (p.id || p.title.toLowerCase().includes("netra")));
  const [activeProject, setActiveProject] = useState(flagshipIndex !== -1 ? flagshipIndex : 0); // NETRATAX is active by default
  const [displayedName, setDisplayedName] = useState('');
  const [nameAnimationComplete, setNameAnimationComplete] = useState(false);
  const fullName = 'Venkatesh D';

  const portfolioSnapshot = useMemo(() => {
    const skills = [];
    for (const category of skillCategories) {
      for (const skill of category.skills || []) {
        if (skill?.name) skills.push(skill.name);
      }
    }

    return {
      name: 'Venkatesh D',
      tagline: 'Data Science Innovator & AI/ML Enthusiast',
      education: 'MSc Data Science @ Coimbatore Institute of Technology',
      email: 'venkatesdhanabalan06@gmail.com',
      phone: '+91 8667794170',
      location: 'Coimbatore, Tamil Nadu, India',
      skills,
      projects: projects.map((p) => ({
        title: p.title,
        subtitle: p.subtitle,
        description: p.description,
        tech: Array.isArray(p.tech) ? p.tech : [],
      })),
      achievements: achievements.map((a) => ({
        title: a.title,
        badge: a.badge,
      })),
    };
  }, []);

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ loading: false, success: false, message: '' });
  const [statsAnimated, setStatsAnimated] = useState(false);

  // EmailJS configuration from environment variables (CRA uses REACT_APP_ prefix)
  const emailJsConfig = {
    serviceId: process.env.REACT_APP_EMAILJS_SERVICE_ID || '',
    templateId: process.env.REACT_APP_EMAILJS_TEMPLATE_ID || '',
    userId: process.env.REACT_APP_EMAILJS_PUBLIC_KEY || ''
  };
  const isEmailJsConfigured = Boolean(emailJsConfig.serviceId && emailJsConfig.templateId && emailJsConfig.userId);

  const getParallaxStyle = (factor) => {
    if (typeof window === 'undefined') return {};
    const x = (mousePosition.x - window.innerWidth / 2) * factor;
    const y = (mousePosition.y - window.innerHeight / 2) * factor;
    return { transform: `translate3d(${x}px, ${y}px, 0)` };
  };

  // Refs for animated elements
  const sectionRefs = useRef({});

  // Page load animation
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Typewriter effect for name
  useEffect(() => {
    if (!isLoaded) return;
    
    let currentIndex = 0;
    const typingDelay = 150; // milliseconds per character
    
    const typeNextChar = () => {
      if (currentIndex < fullName.length) {
        setDisplayedName(fullName.slice(0, currentIndex + 1));
        currentIndex++;
        setTimeout(typeNextChar, typingDelay);
      } else {
        setNameAnimationComplete(true);
      }
    };
    
    // Start typing after a short delay
    const startDelay = setTimeout(() => {
      typeNextChar();
    }, 500);
    
    return () => clearTimeout(startDelay);
  }, [isLoaded]);

  const handleContactChange = (field) => (event) => {
    setContactForm((prev) => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const sendContactMessage = async (event) => {
    event.preventDefault();
    if (!isEmailJsConfigured) {
      setContactStatus({ loading: false, success: false, message: 'Configure EmailJS variables to send messages.' });
      return;
    }
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus({ loading: false, success: false, message: 'Please fill name, email, and message.' });
      return;
    }

    setContactStatus({ loading: true, success: false, message: 'Sending message...' });
    try {
      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: emailJsConfig.serviceId,
          template_id: emailJsConfig.templateId,
          user_id: emailJsConfig.userId,
          template_params: {
            from_name: contactForm.name,
            from_email: contactForm.email,
            subject: contactForm.subject || 'New message from portfolio',
            message: contactForm.message,
            to_email: 'venkatesdhanabalan056@gmail.com'
          }
        })
      });

      if (!response.ok) {
        throw new Error('Unable to send the message.');
      }

      setContactStatus({ loading: false, success: true, message: 'Message sent successfully!' });
      triggerConfetti();
      setContactForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setContactStatus({ loading: false, success: false, message: error.message });
    }
  };

  // Spotlight + tilt for project cards
  const handleCardMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);

    const rotateY = ((x - rect.width / 2) / rect.width) * 10; // deg
    const rotateX = ((y - rect.height / 2) / rect.height) * -10; // deg
    el.style.setProperty('--tiltX', `${rotateY}deg`);
    el.style.setProperty('--tiltY', `${rotateX}deg`);
  };

  const handleCardMouseLeave = (e) => {
    const el = e.currentTarget;
    el.style.setProperty('--mx', `50%`);
    el.style.setProperty('--my', `50%`);
    el.style.setProperty('--tiltX', `0deg`);
    el.style.setProperty('--tiltY', `0deg`);
  };

  // Ripple click for activity cards
  const handleActivityClick = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const circle = document.createElement('span');
    circle.className = 'ripple';
    const diameter = Math.max(rect.width, rect.height);
    circle.style.width = circle.style.height = `${diameter}px`;
    const x = e.clientX - rect.left - diameter / 2;
    const y = e.clientY - rect.top - diameter / 2;
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    el.appendChild(circle);
    circle.addEventListener('animationend', () => circle.remove());
  };

  // Confetti burst on contact success
  const triggerConfetti = () => {
    const container = document.querySelector('#contact .section-container');
    if (!container) return;
    const colors = ['#e53935', '#ffb300', '#00e5ff', '#7c4dff', '#00c853'];
    const rect = container.getBoundingClientRect();
    const count = 24;
    for (let i = 0; i < count; i++) {
      const conf = document.createElement('span');
      conf.className = 'confetti';
      conf.style.left = `${Math.random() * rect.width}px`;
      conf.style.top = `${20 + Math.random() * 40}px`;
      conf.style.backgroundColor = colors[i % colors.length];
      container.appendChild(conf);
      conf.addEventListener('animationend', () => conf.remove());
    }
  };

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Update scroll progress indicator
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      document.documentElement.style.setProperty('--scroll-progress', `${scrollPercent}%`);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({
            ...prev,
            [entry.target.id]: true
          }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('.animate-section');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Count-up animation for stats when section becomes visible
  useEffect(() => {
    if (statsAnimated || !visibleSections['stats']) return;

    const elements = document.querySelectorAll('.stat-number');
    elements.forEach((el) => {
      const targetValue = parseFloat(el.getAttribute('data-target') || '0');
      const isPercent = el.textContent.trim().includes('%');
      const duration = 1200; // ms
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.floor(progress * targetValue);
        el.textContent = isPercent ? `${current}%` : `${current}+`;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    });

    setStatsAnimated(true);
  }, [visibleSections, statsAnimated]);

  const navLinks = ['Home', 'About', 'Projects', 'Skills', 'Achievements', 'Contact'];
  const whatsappNumber = '918667794170'; // Without +
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <div className={`portfolio-root ${isLoaded ? 'loaded' : ''}`}>
      {/* Background Elements */}
      <div className="bg-gradient"></div>
      <div className="bg-stars"></div>
      
      {/* Animated Particles */}
      <div className="particles-container">
        {[...Array(20)].map((_, i) => (
          <div key={i} className={`particle particle-${i % 5}`} style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${15 + Math.random() * 10}s`
          }} />
        ))}
      </div>
      
      {/* Cursor Glow Effect */}
      <div 
        className="cursor-glow" 
        style={{ 
          left: mousePosition.x, 
          top: mousePosition.y 
        }} 
      />

      {/* Navigation */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#home" className="nav-logo">
            <div className="nav-logo-icon">
              <Code size={20} />
            </div>
          </a>

          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link}>
                <a href={`#${link.toLowerCase()}`} className="nav-link">
                  {link}
                </a>
              </li>
            ))}
            <li key="whatsapp">
              <a
                href={whatsappUrl}
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '1.2em', padding: '0 8px' }}
              >
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                  <path d="M16 3C8.82 3 3 8.82 3 16c0 2.64.7 5.13 2.03 7.32L3 29l5.85-2.01C11.01 28.3 13.43 29 16 29c7.18 0 13-5.82 13-13S23.18 3 16 3zm0 24c-2.24 0-4.37-.66-6.16-1.91l-.44-.29-3.47 1.19 1.16-3.36-.29-.45C5.66 20.37 5 18.24 5 16c0-6.08 4.92-11 11-11s11 4.92 11 11-4.92 11-11 11zm6.09-7.41c-.33-.17-1.95-.96-2.25-1.07-.3-.11-.52-.17-.74.17-.22.33-.85 1.07-1.04 1.29-.19.22-.38.25-.71.08-.33-.17-1.39-.51-2.65-1.62-.98-.87-1.64-1.94-1.83-2.27-.19-.33-.02-.51.15-.68.15-.15.33-.38.5-.57.17-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.09-.17-.74-1.78-1.01-2.44-.27-.65-.54-.56-.74-.57-.19-.01-.41-.01-.63-.01-.22 0-.57.08-.87.41-.3.33-1.14 1.12-1.14 2.73 0 1.6 1.17 3.15 1.33 3.37.16.22 2.3 3.51 5.57 4.79.78.34 1.39.54 1.87.69.79.25 1.51.22 2.08.13.64-.1 1.95-.8 2.23-1.57.28-.77.28-1.43.2-1.57-.08-.14-.3-.22-.63-.39z" fill="#FF0000"/>
                </svg>
              </a>
            </li>
          </ul>

          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link}
            </a>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero animate-section">
        {/* Animated Background Shapes */}
        <div className="hero-shapes">
          <div className="shape shape-1" style={getParallaxStyle(0.012)}></div>
          <div className="shape shape-2" style={getParallaxStyle(0.018)}></div>
          <div className="shape shape-3" style={getParallaxStyle(0.025)}></div>
        </div>
        
        <div className="availability-badge">
          <span className="availability-dot"></span>
          <span className="availability-text">Available for opportunities</span>
        </div>
        
        <div className="hero-centered">
          <h1 className="hero-intro">
            <span className="hero-hi">Hi, I'm</span>
            <span className={`hero-name-gradient typewriter-text ${nameAnimationComplete ? 'typing-complete' : ''}`}>
              {displayedName}
              <span className={`typing-cursor ${nameAnimationComplete ? 'cursor-blink' : ''}`}>|</span>
            </span>
          </h1>
          
          <p className="hero-roles">
            <span>Data Science Innovator</span>
            <span className="role-divider">|</span>
            <span>AI/ML Enthusiast</span>
          </p>
          
          <p className="hero-education">
            <GraduationCap size={18} />
            <span>MSc Data Science @ Coimbatore Institute of Technology</span>
          </p>
          
          <div className="hero-buttons-centered">
            <a href="#projects" className="btn btn-primary btn-animated">
              <Briefcase size={18} />
              View Projects
            </a>
            <a href="#contact" className="btn btn-secondary btn-animated">
              <Mail size={18} />
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section animate-section">
        <div className={`about-container-with-image ${visibleSections['about'] ? 'animate-visible' : 'animate-hidden'}`}>
          <div className="about-image-wrapper animate-fade-in">
            <div className="about-image-bg"></div>
            <div className="about-image">
              <img src={myPic} alt="Venkatesh D" className="about-photo" />
            </div>
          </div>
          
          <div className="about-content">
            <p className="section-label animate-slide-right">
              <ChevronRight size={16} /> About me
            </p>
            <h2 className="section-heading animate-slide-right delay-1">Who Am I</h2>
            
            <p className="about-text-full animate-fade-up delay-2">
              My name is <strong>Venkatesh D</strong>, and I am a passionate Machine Learning & Data Science enthusiast. I have always been fascinated by the intersection of AI and technology, and I am thrilled to be able to bring my creative ideas to life through coding. My primary focus is on developing intelligent AI solutions, where I excel in building systems that create real-world social impact. Currently pursuing my <strong>MSc. Data Science at Coimbatore Institute of Technology</strong>, my technical skills include proficiency in <strong>Python, PyTorch, TensorFlow, SQL, React</strong>, and various ML frameworks. I am well-versed in deep learning principles, ensuring that my models work great and function seamlessly across different applications and use cases. Continuously learning and staying up-to-date with the latest trends and technologies is a priority for me. I am always exploring new tools, frameworks, and techniques to enhance my skills and deliver cutting-edge solutions to real-world problems.
            </p>

            <div className="about-tech-grid animate-stagger">
              {aboutTechSkills.map((skill, index) => (
                <div key={index} className="about-tech-badge animate-pop" style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className="about-tech-icon">{skill.icon}</span>
                  <span className="about-tech-name">{skill.name}</span>
                </div>
              ))}
            </div>

            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                className="btn btn-primary about-download-btn btn-animated animate-fade-up delay-3"
                onClick={() => setShowCVOptions(true)}
              >
                <Download size={18} />
                Download CV
              </button>
              {showCVOptions && (
                <>
                  <div className="cv-backdrop" onClick={() => setShowCVOptions(false)} />
                  <div className="cv-options-dropdown cv-options-horizontal" style={{ position: 'absolute', top: '100%', left: 0, zIndex: 1001 }}>
                    <button
                      className="cv-option-btn"
                      onClick={() => {
                        window.open('/resume/Venkatesh_D_MSc_DS_CIT.pdf', '_blank');
                        setShowCVOptions(false);
                      }}
                    >
                      Data Science / AI-ML Resume
                    </button>
                    <button
                      className="cv-option-btn"
                      onClick={() => {
                        window.open('/resume/Venkatesh_D_MSc_DS_CIT(SS).pdf', '_blank');
                        setShowCVOptions(false);
                      }}
                    >
                      Full Stack / Software Resume
                    </button>
                    <button
                      className="cv-option-btn cv-cancel-btn"
                      onClick={() => setShowCVOptions(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      <section className="stats-section animate-section" id="stats">
        <div className={`stats-container ${visibleSections['stats'] ? 'animate-visible' : 'animate-hidden'}`}>
          <div className="stat-card">
            <div className="stat-number" data-target="5">5+</div>
            <div className="stat-label">Major Projects</div>
            <div className="stat-glow"></div>
          </div>
          <div className="stat-card">
            <div className="stat-number" data-target="7">7+</div>
            <div className="stat-label">Hackathon Awards</div>
            <div className="stat-glow"></div>
          </div>
          <div className="stat-card">
            <div className="stat-number" data-target="15">15+</div>
            <div className="stat-label">Technologies</div>
            <div className="stat-glow"></div>
          </div>
          <div className="stat-card">
            <div className="stat-number" data-target="87">87%</div>
            <div className="stat-label">AI Accuracy</div>
            <div className="stat-glow"></div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section animate-section">
        <div className={`section-container ${visibleSections['services'] ? 'animate-visible' : 'animate-hidden'}`}>
          <p className="section-label center animate-fade-up">
            <ChevronRight size={16} /> My Services
          </p>
          <h2 className="section-heading center animate-fade-up delay-1">What I Can Do</h2>

          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card animate-scale-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <div className="service-icon icon-float">
                  {service.icon}
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section - Fan Spread Carousel */}
      <section id="projects" className="section projects-section animate-section">
        <div className={`section-container ${visibleSections['projects'] ? 'animate-visible' : 'animate-hidden'}`}>
          <p className="section-label center animate-fade-up">
            <ChevronRight size={16} /> My Work
          </p>
          <h2 className="section-heading center animate-fade-up delay-1">Featured Projects</h2>
          <p className="section-subtitle center animate-fade-up delay-2">Hover over a project to see details</p>

          <div className="fan-carousel-wrapper">
            {/* Left Arrow */}
            <button 
              className="carousel-arrow carousel-arrow-left"
              onClick={() => setActiveProject(prev => prev > 0 ? prev - 1 : projects.length - 1)}
            >
              <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
            </button>

            <div className="fan-carousel">
              {projects.map((project, index) => {
                // Calculate position relative to active card
                const position = index - activeProject;
                const isActive = index === activeProject;
                return (
                  <div 
                    key={index} 
                    className={`fan-card ${isActive ? 'fan-card-active' : ''} fan-card-pos-${position}`}
                    onClick={() => setActiveProject(index)}
                    onMouseMove={handleCardMouseMove}
                    onMouseLeave={handleCardMouseLeave}
                    style={{
                      '--card-index': index,
                      '--position': position
                    }}
                  >
                    <div className="fan-card-inner">
                      <div className="fan-card-glow"></div>
                      <div className="fan-card-number">{project.rank}</div>
                      <div className="fan-card-badge">
                        {project.icon}
                      </div>
                      <div className="fan-card-content">
                        <h3 className="fan-card-title">{project.title}</h3>
                        <p className="fan-card-subtitle">{project.subtitle}</p>
                        
                        <div className="fan-card-preview">
                          <div className="fan-preview-tech">
                            {project.tech.slice(0, 3).map((tech, i) => (
                              <span key={i} className="fan-tech-mini">{tech}</span>
                            ))}
                            {project.tech.length > 3 && (
                              <span className="fan-tech-more">+{project.tech.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Hover Expanded Overlay */}
                    <div className="fan-card-expanded-overlay">
                      <div className="expanded-overlay-glow"></div>
                      <div className="expanded-overlay-header">
                        <div className="expanded-overlay-icon">
                          {project.icon}
                        </div>
                        <div className="expanded-overlay-titles">
                          <h3 className="expanded-overlay-title">{project.title}</h3>
                          <p className="expanded-overlay-subtitle">{project.subtitle}</p>
                        </div>
                      </div>
                      <p className="expanded-overlay-description">{project.description}</p>
                      <div className="expanded-overlay-highlights">
                        <h4 className="expanded-highlights-label">
                          <Sparkles size={14} /> Key Features
                        </h4>
                        {project.highlights.map((highlight, i) => (
                          <div key={i} className="expanded-highlight-item">
                            <ChevronRight size={12} className="highlight-chevron" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                      <div className="expanded-overlay-impact">
                        <TrendingUp size={18} className="impact-icon-glow" />
                        <div className="impact-text">
                          <span className="impact-label-text">Impact</span>
                          <span className="impact-value-text">{project.impact}</span>
                        </div>
                      </div>
                      <div className="expanded-overlay-tech">
                        <h4 className="expanded-tech-label">Tech Stack</h4>
                        <div className="expanded-tech-grid">
                          {project.tech.map((tech, i) => (
                            <span key={i} className="expanded-tech-pill">{tech}</span>
                          ))}
                        </div>
                      </div>
                      {project.github && (
                        <div className="expanded-overlay-github" style={{marginTop: '1rem'}}>
                          <a href={project.github} target="_blank" rel="noopener noreferrer" className="github-link">
                            <Github size={18} style={{verticalAlign: 'middle', marginRight: 6}} />
                            View on GitHub
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Arrow */}
            <button 
              className="carousel-arrow carousel-arrow-right"
              onClick={() => setActiveProject(prev => prev < projects.length - 1 ? prev + 1 : 0)}
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Carousel Dots */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === activeProject ? 'active' : ''}`}
                onClick={() => setActiveProject(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section - Categorized */}
      <section id="skills" className="section skills-section animate-section">
        <div className={`section-container ${visibleSections['skills'] ? 'animate-visible' : 'animate-hidden'}`}>
          <h2 className="section-heading-gradient center animate-fade-up">Technical Skills</h2>
          <p className="section-subtitle center animate-fade-up delay-1">Technologies and tools I work with</p>

          <div className="skills-grid">
            {skillCategories.map((category, index) => (
              <div key={index} className="skill-category-card animate-slide-up" style={{ animationDelay: `${0.2 + index * 0.1}s` }}>
                <div className="skill-category-header">
                  <div className="skill-category-icon icon-rotate-hover">
                    {category.icon}
                  </div>
                  <h3 className="skill-category-title">{category.title}</h3>
                </div>
                <div className="skill-tags">
                  {category.skills.map((skill, i) => (
                    <span key={i} className="skill-tag animate-tag" style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
                      <span className="skill-tag-icon">{skill.icon}</span>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section - Timeline Style */}
      <section id="achievements" className="section achievements-section animate-section">
        <div className={`section-container ${visibleSections['achievements'] ? 'animate-visible' : 'animate-hidden'}`}>
          <h2 className="section-heading-gradient center animate-fade-up">Achievements & Honors</h2>
          <p className="section-subtitle center animate-fade-up delay-1">Recognition for excellence and innovation</p>

          <div className="achievements-timeline">
            {achievements.map((achievement, index) => (
              <div key={index} className="achievement-timeline-item animate-slide-right" style={{ animationDelay: `${0.2 + index * 0.12}s` }}>
                <div className="achievement-timeline-card card-tilt">
                  <div className="achievement-header">
                    <div className="achievement-icon-box icon-glow">
                      {achievement.icon}
                    </div>
                    <span className={`achievement-badge ${achievement.badgeColor} badge-shine`}>
                      {achievement.badge}
                    </span>
                  </div>
                  <h3 className="achievement-title">{achievement.title}</h3>
                  <p className="achievement-subtitle">{achievement.subtitle}</p>
                  <p className="achievement-description">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Co-Curricular Activities Section */}
      <section id="activities" className="section activities-section animate-section">
        <div className={`section-container ${visibleSections['activities'] ? 'animate-visible' : 'animate-hidden'}`}>
          <p className="section-label center animate-fade-up">
            <ChevronRight size={16} /> Leadership & Involvement
          </p>
          <h2 className="section-heading center animate-fade-up delay-1">Co-Curricular Activities</h2>
          <p className="section-subtitle center animate-fade-up delay-2">Building communities and driving innovation</p>

          <div className="activities-grid">
            {coCurricularActivities.map((activity, index) => (
                <div key={index} className="activity-card animate-slide-up" style={{ animationDelay: `${0.2 + index * 0.15}s` }}>
                <div className="activity-icon-wrapper">
                  <div className="activity-icon">
                    {activity.icon}
                  </div>
                </div>
                <div className="activity-content">
                  <div className="activity-header">
                    <h3 className="activity-title">{activity.title}</h3>
                    <span className="activity-duration">{activity.duration}</span>
                  </div>
                  <p className="activity-organization">{activity.organization}</p>
                  <p className="activity-description">{activity.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section animate-section" id="cta">
        <div className={`cta-container ${visibleSections['cta'] ? 'animate-visible' : 'animate-hidden'}`}>
          <div className="cta-content animate-fade-up">
            <h2 className="cta-title">Let's work together on your next project</h2>
            <p className="cta-text">
              Collaboration is key! Let's join forces and combine our skills to tackle your next project with a powerful synergy that guarantees success.
            </p>
          </div>
          <a href="#contact" className="btn btn-primary btn-animated animate-scale-up delay-2">
            Contact
          </a>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section animate-section">
        <div className={`section-container ${visibleSections['contact'] ? 'animate-visible' : 'animate-hidden'}`}>
          <p className="section-label center animate-fade-up">
            <ChevronRight size={16} /> Get in Touch
          </p>
          <h2 className="section-heading center animate-fade-up delay-1">Contact Me</h2>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item animate-slide-right" style={{ animationDelay: '0.2s' }}>
                <div className="contact-icon icon-pulse">
                  <Mail size={24} />
                </div>
                <div className="contact-details">
                  <p className="contact-label">Email</p>
                  <a href="mailto:venkatesdhanabalan06@gmail.com" className="contact-value">
                    venkatesdhanabalan06@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-item animate-slide-right" style={{ animationDelay: '0.3s' }}>
                <div className="contact-icon icon-pulse">
                  <Phone size={24} />
                </div>
                <div className="contact-details">
                  <p className="contact-label">Phone</p>
                  <a href="tel:+918667794170" className="contact-value">
                    +91 8667794170
                  </a>
                </div>
              </div>

              <div className="contact-item animate-slide-right" style={{ animationDelay: '0.4s' }}>
                <div className="contact-icon icon-pulse">
                  <MapPin size={24} />
                </div>
                <div className="contact-details">
                  <p className="contact-label">Location</p>
                  <p className="contact-value">Coimbatore, Tamil Nadu, India</p>
                </div>
              </div>

              <div className="contact-item animate-slide-right" style={{ animationDelay: '0.5s' }}>
                <div className="contact-icon icon-pulse">
                  <GraduationCap size={24} />
                </div>
                <div className="contact-details">
                  <p className="contact-label">Education</p>
                  <p className="contact-value">MSc Data Science @ CIT</p>
                </div>
              </div>
            </div>

            <form className="contact-form animate-slide-left" style={{ animationDelay: '0.3s' }} onSubmit={sendContactMessage}>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input input-animated"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={handleContactChange('name')}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-input input-animated"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={handleContactChange('email')}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-input input-animated"
                  placeholder="Subject"
                  value={contactForm.subject}
                  onChange={handleContactChange('subject')}
                />
              </div>
              <div className="form-group">
                <textarea
                  className="form-textarea input-animated"
                  placeholder="Your Message"
                  rows={5}
                  value={contactForm.message}
                  onChange={handleContactChange('message')}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-animated" disabled={contactStatus.loading}>
                {contactStatus.loading ? 'Sending...' : 'Send Message'}
              </button>
              {!isEmailJsConfigured && (
                <p className="contact-status contact-status-error">
                  Configure EmailJS variables (REACT_APP_EMAILJS_SERVICE_ID, REACT_APP_EMAILJS_TEMPLATE_ID, REACT_APP_EMAILJS_PUBLIC_KEY) in .env to send messages.
                </p>
              )}
              {contactStatus.message && (
                <p className={`contact-status ${contactStatus.success ? 'contact-status-success' : 'contact-status-error'}`}>
                  {contactStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <a href="#home" className="footer-logo">
            <div className="nav-logo-icon">
              <Code size={20} />
            </div>
          </a>

          <div className="social-links">
            <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
              <Instagram size={20} />
            </a>
            <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">
              <Facebook size={20} />
            </a>
            <a href="https://www.linkedin.com/in/venkatesh-dhanabalan-04b164295/" className="social-link" target="_blank" rel="noopener noreferrer">
              <Linkedin size={20} />
            </a>
            <a href="https://github.com/Venkatesh056" className="social-link" target="_blank" rel="noopener noreferrer">
              <Github size={20} />
            </a>
          </div>

          <p className="footer-text">
            © Venkatesh D MSc Data Science | Coimbatore Institute of Technology 2023 - 2028
          </p>
        </div>
      </footer>
      {/* Chatbot Floating Assistant */}
      <Chatbot
        portfolioSnapshot={portfolioSnapshot}
      />
    </div>
  );
};

export default Portfolio;
