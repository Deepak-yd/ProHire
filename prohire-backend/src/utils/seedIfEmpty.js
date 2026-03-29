const { User, Professional, Category, Service, Hire, Setting, Connection, Job } = require('../models');

async function seedIfEmpty() {
  const userCount = await User.count();
  if (userCount > 0) {
    const setting = await Setting.findByPk(1);
    if (!setting) {
      await Setting.upsert({ id: 1, platformName: 'ProHire', commissionRate: 10 });
    }
    return;
  }

  // Create categories - Now including 20+ skills
  const [dev, design, marketing] = await Promise.all([
    Category.create({ name: 'Development', description: 'Software and engineering services' }),
    Category.create({ name: 'Design', description: 'Product and UI/UX design services' }),
    Category.create({ name: 'Marketing', description: 'Growth and digital marketing services' }),
  ]);

  // Add 20+ skill categories
  const skillCategories = await Promise.all([
    Category.create({ name: 'React', description: 'React.js frontend library' }),
    Category.create({ name: 'Node.js', description: 'Node.js backend development' }),
    Category.create({ name: 'TypeScript', description: 'TypeScript programming language' }),
    Category.create({ name: 'Python', description: 'Python programming language' }),
    Category.create({ name: 'Java', description: 'Java programming language' }),
    Category.create({ name: 'C++', description: 'C++ programming language' }),
    Category.create({ name: 'PHP', description: 'PHP web development' }),
    Category.create({ name: 'Ruby', description: 'Ruby programming language' }),
    Category.create({ name: 'SQL', description: 'SQL database management' }),
    Category.create({ name: 'MongoDB', description: 'MongoDB NoSQL database' }),
    Category.create({ name: 'PostgreSQL', description: 'PostgreSQL relational database' }),
    Category.create({ name: 'AWS', description: 'Amazon Web Services cloud' }),
    Category.create({ name: 'Docker', description: 'Docker containerization' }),
    Category.create({ name: 'Kubernetes', description: 'Kubernetes orchestration' }),
    Category.create({ name: 'GraphQL', description: 'GraphQL API development' }),
    Category.create({ name: 'REST API', description: 'RESTful API development' }),
    Category.create({ name: 'UI Design', description: 'User interface design' }),
    Category.create({ name: 'UX Design', description: 'User experience design' }),
    Category.create({ name: 'Figma', description: 'Figma design tool' }),
    Category.create({ name: 'Adobe XD', description: 'Adobe XD design tool' }),
    Category.create({ name: 'SEO', description: 'Search engine optimization' }),
    Category.create({ name: 'Social Media Marketing', description: 'Social media marketing' }),
    Category.create({ name: 'Content Marketing', description: 'Content marketing strategy' }),
    Category.create({ name: 'Email Marketing', description: 'Email marketing campaigns' }),
    Category.create({ name: 'Google Analytics', description: 'Google Analytics expertise' }),
  ]);

  // Admin user
  const admin = await User.create({
    name: 'Platform Admin',
    username: 'admin',
    email: 'admin@prohire.app',
    password: 'Admin@123',
    role: 'admin',
    status: 'Active',
    provider: 'local',
    location: 'New York, US',
    company: 'ProHire',
    bio: 'Platform administrator managing ProHire ecosystem',
    linkedIn: 'https://linkedin.com/in/admin',
    github: 'https://github.com/admin',
    twitter: 'https://twitter.com/admin',
    portfolio: 'https://admin.prohire.app',
  });

  // Professionals
  const professionals = [];
  const professionalData = [
    {
      name: 'Alex Rivera',
      username: 'alexrivera',
      email: 'alex@prohire.app',
      password: 'AlexPass@2026',
      location: 'San Francisco, US',
      company: 'Tech Innovations',
      bio: 'Senior Software Engineer specializing in full-stack development with React and Node.js.',
      title: 'Senior Software Engineer',
      categoryId: dev.id,
      rate: 85,
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      rating: 4.9,
      reviewCount: 28,
    },
    {
      name: 'Maria Gonzalez',
      username: 'mariagonzalez',
      email: 'maria@prohire.app',
      password: 'MariaSecure@2026',
      location: 'Madrid, Spain',
      company: 'Data Insights Co',
      bio: 'Data Scientist with expertise in Python, machine learning, and big data analytics.',
      title: 'Data Scientist',
      categoryId: dev.id,
      rate: 90,
      skills: ['Python', 'SQL', 'Machine Learning', 'TensorFlow'],
      rating: 4.8,
      reviewCount: 22,
    },
    {
      name: 'James Chen',
      username: 'jameschen',
      email: 'james@prohire.app',
      password: 'JamesDev@2026',
      location: 'Toronto, Canada',
      company: 'Mobile Solutions',
      bio: 'Mobile App Developer creating cross-platform apps with React Native and Flutter.',
      title: 'Mobile App Developer',
      categoryId: dev.id,
      rate: 75,
      skills: ['React Native', 'Flutter', 'iOS', 'Android'],
      rating: 4.7,
      reviewCount: 35,
    },
    {
      name: 'Sarah Patel',
      username: 'sarahpatel',
      email: 'sarah@prohire.app',
      password: 'SarahOps@2026',
      location: 'London, UK',
      company: 'Cloud Systems Ltd',
      bio: 'DevOps Engineer managing cloud infrastructure and CI/CD pipelines.',
      title: 'DevOps Engineer',
      categoryId: dev.id,
      rate: 95,
      skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      rating: 4.9,
      reviewCount: 19,
    },
    {
      name: 'Emma Thompson',
      username: 'emmathompson',
      email: 'emma@prohire.app',
      password: 'EmmaDesign@2026',
      location: 'Sydney, Australia',
      company: 'Creative Studios',
      bio: 'Graphic Designer crafting stunning visuals and user interfaces.',
      title: 'Graphic Designer',
      categoryId: design.id,
      rate: 60,
      skills: ['UI Design', 'Figma', 'Adobe XD', 'Photoshop'],
      rating: 4.8,
      reviewCount: 41,
    },
    {
      name: 'David Kim',
      username: 'davidkim',
      email: 'david@prohire.app',
      password: 'DavidUX@2026',
      location: 'Seoul, South Korea',
      company: 'UX Research Lab',
      bio: 'UX Researcher conducting user studies and improving product experiences.',
      title: 'UX Researcher',
      categoryId: design.id,
      rate: 70,
      skills: ['UX Design', 'User Research', 'Prototyping', 'Analytics'],
      rating: 4.6,
      reviewCount: 27,
    },
    {
      name: 'Lisa Wong',
      username: 'lisawong',
      email: 'lisa@prohire.app',
      password: 'LisaMarket@2026',
      location: 'Singapore',
      company: 'Growth Marketing',
      bio: 'Digital Marketing Specialist driving online growth and brand awareness.',
      title: 'Digital Marketing Specialist',
      categoryId: marketing.id,
      rate: 65,
      skills: ['SEO', 'Social Media', 'Content Marketing', 'Google Analytics'],
      rating: 4.7,
      reviewCount: 33,
    },
    {
      name: 'Robert Johnson',
      username: 'robertjohnson',
      email: 'robert@prohire.app',
      password: 'RobertBiz@2026',
      location: 'Chicago, US',
      company: 'Business Analytics Inc',
      bio: 'Business Analyst providing data-driven insights and strategic recommendations.',
      title: 'Business Analyst',
      categoryId: marketing.id,
      rate: 80,
      skills: ['Analytics', 'SQL', 'Excel', 'Tableau'],
      rating: 4.5,
      reviewCount: 24,
    },
    {
      name: 'Anna Petrov',
      username: 'annapetrov',
      email: 'anna@prohire.app',
      password: 'AnnaSecure@2026',
      location: 'Berlin, Germany',
      company: 'Cyber Defense',
      bio: 'Cybersecurity Specialist protecting systems from threats and ensuring compliance.',
      title: 'Cybersecurity Specialist',
      categoryId: dev.id,
      rate: 100,
      skills: ['Security', 'Penetration Testing', 'Compliance', 'Firewalls'],
      rating: 4.9,
      reviewCount: 16,
    },
    {
      name: 'Carlos Silva',
      username: 'carlossilva',
      email: 'carlos@prohire.app',
      password: 'CarlosAI@2026',
      location: 'São Paulo, Brazil',
      company: 'AI Solutions',
      bio: 'AI/ML Engineer developing intelligent systems and natural language processing.',
      title: 'AI/ML Engineer',
      categoryId: dev.id,
      rate: 110,
      skills: ['Python', 'TensorFlow', 'NLP', 'Computer Vision'],
      rating: 4.8,
      reviewCount: 21,
    },
  ];

  for (const data of professionalData) {
    const user = await User.create({
      name: data.name,
      username: data.username,
      email: data.email,
      password: data.password,
      role: 'professional',
      status: 'Active',
      provider: 'local',
      location: data.location,
      company: data.company,
      bio: data.bio,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      website: `https://${data.username}.com`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
      linkedIn: `https://linkedin.com/in/${data.username}`,
      github: `https://github.com/${data.username}`,
      twitter: `https://twitter.com/${data.username}`,
      portfolio: `https://${data.username}.dev`,
    });

    const pro = await Professional.create({
      userId: user.id,
      categoryId: data.categoryId,
      name: data.name,
      title: data.title,
      location: data.location,
      rate: data.rate,
      bio: data.bio,
      skills: JSON.stringify(data.skills),
      rating: data.rating,
      reviewCount: data.reviewCount,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
    });

    professionals.push({ user, pro });
  }

  // Clients
  const ethan = await User.create({
    name: 'Ethan Carter',
    username: 'ethancarter',
    email: 'ethan@prohire.app',
    password: 'User@12345',
    role: 'user',
    status: 'Active',
    provider: 'local',
    location: 'Austin, US',
    company: 'Acme Labs',
    bio: 'Hiring manager at Acme Labs, looking for top talent to build amazing products.',
    phone: '+1-512-555-0123',
    website: 'https://acmelabs.io',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ethan',
    linkedIn: 'https://linkedin.com/in/ethancarter',
    twitter: 'https://twitter.com/ethancarter',
    portfolio: 'https://acmelabs.io',
  });

  const sophia = await User.create({
    name: 'Sophia Williams',
    username: 'sophiawilliams',
    email: 'sophia@prohire.app',
    password: 'User@12345',
    role: 'user',
    status: 'Active',
    provider: 'local',
    location: 'New York, US',
    company: 'TechStartup Inc',
    bio: 'CEO and founder of TechStartup. Looking for skilled professionals to grow our team.',
    phone: '+1-212-555-0456',
    website: 'https://techstartupinc.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophia',
    linkedIn: 'https://linkedin.com/in/sophiawilliams',
    twitter: 'https://twitter.com/sophiawilliams',
    portfolio: 'https://techstartupinc.com',
  });

  const michael = await User.create({
    name: 'Michael Brown',
    username: 'michaelbrown',
    email: 'michael@prohire.app',
    password: 'User@12345',
    role: 'user',
    status: 'Active',
    provider: 'local',
    location: 'Los Angeles, US',
    company: 'Creative Agency',
    bio: 'Creative director at a growing agency. Need talented professionals for client projects.',
    phone: '+1-323-555-0789',
    website: 'https://creativeagency.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    linkedIn: 'https://linkedin.com/in/michaelbrown',
    twitter: 'https://twitter.com/michaelbrown',
    portfolio: 'https://creativeagency.com',
  });

  // Professional profiles are already created above

  // Services
  const webApp = await Service.create({
    professionalId: professionals[0].pro.id,
    title: 'Full-Stack Web Development',
    description: 'Build modern web applications with React and Node.js.',
    price: 1500,
  });

  const dataAnalysis = await Service.create({
    professionalId: professionals[1].pro.id,
    title: 'Data Analysis & ML Models',
    description: 'Analyze data and build machine learning models.',
    price: 2000,
  });

  const mobileApp = await Service.create({
    professionalId: professionals[2].pro.id,
    title: 'Cross-Platform Mobile Apps',
    description: 'Develop mobile apps for iOS and Android.',
    price: 1800,
  });

  const cloudInfra = await Service.create({
    professionalId: professionals[3].pro.id,
    title: 'Cloud Infrastructure Setup',
    description: 'Set up scalable cloud infrastructure on AWS.',
    price: 1200,
  });

  const graphicDesign = await Service.create({
    professionalId: professionals[4].pro.id,
    title: 'Graphic & UI Design',
    description: 'Create stunning visuals and user interfaces.',
    price: 900,
  });

  const uxResearch = await Service.create({
    professionalId: professionals[5].pro.id,
    title: 'UX Research & Testing',
    description: 'Conduct user research and usability testing.',
    price: 1100,
  });

  const digitalMarketing = await Service.create({
    professionalId: professionals[6].pro.id,
    title: 'Digital Marketing Strategy',
    description: 'Develop comprehensive digital marketing plans.',
    price: 1000,
  });

  const businessAnalysis = await Service.create({
    professionalId: professionals[7].pro.id,
    title: 'Business Intelligence',
    description: 'Provide data-driven business insights.',
    price: 1300,
  });

  const cybersecurity = await Service.create({
    professionalId: professionals[8].pro.id,
    title: 'Security Audits',
    description: 'Perform security assessments and audits.',
    price: 2500,
  });

  const aiDevelopment = await Service.create({
    professionalId: professionals[9].pro.id,
    title: 'AI Solution Development',
    description: 'Build AI-powered applications and systems.',
    price: 3000,
  });

  // Hires - Active project
  await Hire.create({
    clientId: ethan.id,
    professionalId: professionals[0].pro.id,
    serviceId: webApp.id,
    serviceTitle: webApp.title,
    professionalName: professionals[0].pro.name,
    amount: webApp.price,
    status: 'Active',
    progress: 45,
    date: '2026-02-14',
  });

  // Hires - Completed project
  await Hire.create({
    clientId: sophia.id,
    professionalId: professionals[4].pro.id,
    serviceId: graphicDesign.id,
    serviceTitle: graphicDesign.title,
    professionalName: professionals[4].pro.name,
    amount: graphicDesign.price,
    status: 'Completed',
    progress: 100,
    date: '2026-01-15',
  });

  // Hires - Pending project
  await Hire.create({
    clientId: michael.id,
    professionalId: professionals[6].pro.id,
    serviceId: digitalMarketing.id,
    serviceTitle: digitalMarketing.title,
    professionalName: professionals[6].pro.name,
    amount: digitalMarketing.price,
    status: 'Pending',
    progress: 0,
    date: '2026-02-20',
  });

  // Another active hire
  await Hire.create({
    clientId: sophia.id,
    professionalId: professionals[1].pro.id,
    serviceId: dataAnalysis.id,
    serviceTitle: dataAnalysis.title,
    professionalName: professionals[1].pro.name,
    amount: dataAnalysis.price,
    status: 'Active',
    progress: 60,
    date: '2026-02-08',
  });

  // More hires
  await Hire.create({
    clientId: ethan.id,
    professionalId: professionals[2].pro.id,
    serviceId: mobileApp.id,
    serviceTitle: mobileApp.title,
    professionalName: professionals[2].pro.name,
    amount: mobileApp.price,
    status: 'Completed',
    progress: 100,
    date: '2026-01-20',
  });

  await Hire.create({
    clientId: michael.id,
    professionalId: professionals[5].pro.id,
    serviceId: uxResearch.id,
    serviceTitle: uxResearch.title,
    professionalName: professionals[5].pro.name,
    amount: uxResearch.price,
    status: 'Active',
    progress: 30,
    date: '2026-02-15',
  });

  await Hire.create({
    clientId: sophia.id,
    professionalId: professionals[8].pro.id,
    serviceId: cybersecurity.id,
    serviceTitle: cybersecurity.title,
    professionalName: professionals[8].pro.name,
    amount: cybersecurity.price,
    status: 'Pending',
    progress: 0,
    date: '2026-02-25',
  });

  await Hire.create({
    clientId: ethan.id,
    professionalId: professionals[9].pro.id,
    serviceId: aiDevelopment.id,
    serviceTitle: aiDevelopment.title,
    professionalName: professionals[9].pro.name,
    amount: aiDevelopment.price,
    status: 'Active',
    progress: 45,
    date: '2026-02-10',
  });

  // Connections
  await Connection.create({ requesterId: ethan.id, receiverId: professionals[0].user.id, status: 'accepted' });
  await Connection.create({ requesterId: sophia.id, receiverId: professionals[4].user.id, status: 'accepted' });
  await Connection.create({ requesterId: michael.id, receiverId: professionals[6].user.id, status: 'accepted' });
  await Connection.create({ requesterId: admin.id, receiverId: ethan.id, status: 'pending' });
  await Connection.create({ requesterId: professionals[0].user.id, receiverId: professionals[1].user.id, status: 'accepted' });
  await Connection.create({ requesterId: professionals[4].user.id, receiverId: professionals[6].user.id, status: 'accepted' });

  // Jobs posted by professionals
  await Job.bulkCreate([
    {
      professionalId: professionals[0].pro.id,
      title: 'E-Commerce Platform Development',
      description: 'Build a full-featured e-commerce platform with React frontend and Node.js backend including payment integration.',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe API'],
      budget: 5000,
      deadline: '2026-04-30',
      category: 'Web Development',
      status: 'open',
    },
    {
      professionalId: professionals[0].pro.id,
      title: 'REST API Development',
      description: 'Develop a scalable REST API for mobile application with proper authentication and rate limiting.',
      skills: ['Node.js', 'REST API', 'MongoDB', 'JWT'],
      budget: 3000,
      deadline: '2026-03-31',
      category: 'Backend',
      status: 'open',
    },
    {
      professionalId: professionals[3].pro.id,
      title: 'AWS Infrastructure Setup',
      description: 'Setup AWS infrastructure including EC2, RDS, and CloudFront for application deployment.',
      skills: ['AWS', 'Docker', 'Kubernetes', 'DevOps'],
      budget: 2500,
      deadline: '2026-03-15',
      category: 'Cloud Infrastructure',
      status: 'open',
    },
    {
      professionalId: professionals[4].pro.id,
      title: 'Mobile App UI Design',
      description: 'Complete UI design for iOS and Android mobile application with all screens and interactions in Figma.',
      skills: ['Figma', 'UI Design', 'Adobe XD', 'Prototyping'],
      budget: 2000,
      deadline: '2026-03-20',
      category: 'Mobile Design',
      status: 'open',
    },
    {
      professionalId: professionals[4].pro.id,
      title: 'Website Redesign',
      description: 'Complete redesign of corporate website with modern UX principles and responsive design.',
      skills: ['UI Design', 'UX Design', 'Figma', 'Prototyping'],
      budget: 3500,
      deadline: '2026-04-15',
      category: 'Web Design',
      status: 'open',
    },
    {
      professionalId: professionals[5].pro.id,
      title: 'Design System Creation',
      description: 'Create comprehensive design system with components, guidelines, and Figma file for team reuse.',
      skills: ['Figma', 'UI Design', 'Design Systems'],
      budget: 4000,
      deadline: '2026-05-01',
      category: 'Design Systems',
      status: 'open',
    },
    {
      professionalId: professionals[6].pro.id,
      title: 'Social Media Campaign',
      description: 'Plan and execute a 3-month social media marketing campaign across Instagram, Twitter, and LinkedIn.',
      skills: ['Social Media Marketing', 'Content Marketing', 'Analytics'],
      budget: 2500,
      deadline: '2026-03-31',
      category: 'Social Media',
      status: 'open',
    },
    {
      professionalId: professionals[6].pro.id,
      title: 'SEO Optimization',
      description: 'Complete SEO audit and optimization for website to improve search engine rankings.',
      skills: ['SEO', 'Google Analytics', 'Content Marketing'],
      budget: 1500,
      deadline: '2026-03-10',
      category: 'SEO',
      status: 'open',
    },
    {
      professionalId: professionals[7].pro.id,
      title: 'Email Marketing Campaign',
      description: 'Design and execute email marketing campaign with A/B testing and analytics tracking.',
      skills: ['Email Marketing', 'Content Marketing', 'Analytics'],
      budget: 1200,
      deadline: '2026-02-28',
      category: 'Email Marketing',
      status: 'open',
    },
  ]);

  // More jobs
  await Job.bulkCreate([
    {
      professionalId: professionals[1].pro.id,
      title: 'Machine Learning Model Development',
      description: 'Build and deploy ML models for predictive analytics using Python and TensorFlow.',
      skills: ['Python', 'Machine Learning', 'TensorFlow'],
      budget: 4000,
      deadline: '2026-04-10',
      category: 'AI/ML',
      status: 'open',
    },
    {
      professionalId: professionals[2].pro.id,
      title: 'iOS App Development',
      description: 'Develop a native iOS application with Swift and integrate with REST APIs.',
      skills: ['iOS', 'Swift', 'REST API'],
      budget: 3500,
      deadline: '2026-03-25',
      category: 'Mobile Development',
      status: 'open',
    },
    {
      professionalId: professionals[3].pro.id,
      title: 'Kubernetes Cluster Setup',
      description: 'Set up and configure Kubernetes cluster for microservices deployment.',
      skills: ['Kubernetes', 'Docker', 'DevOps'],
      budget: 2800,
      deadline: '2026-03-05',
      category: 'DevOps',
      status: 'open',
    },
    {
      professionalId: professionals[4].pro.id,
      title: 'Brand Identity Design',
      description: 'Create complete brand identity including logo, colors, and guidelines.',
      skills: ['UI Design', 'Figma', 'Brand Design'],
      budget: 1800,
      deadline: '2026-03-12',
      category: 'Branding',
      status: 'open',
    },
    {
      professionalId: professionals[5].pro.id,
      title: 'User Journey Mapping',
      description: 'Map user journeys and create personas for product improvement.',
      skills: ['UX Design', 'User Research', 'Prototyping'],
      budget: 1400,
      deadline: '2026-03-18',
      category: 'UX Research',
      status: 'open',
    },
    {
      professionalId: professionals[6].pro.id,
      title: 'PPC Campaign Management',
      description: 'Manage Google Ads and Facebook Ads campaigns for lead generation.',
      skills: ['PPC', 'Google Ads', 'Facebook Ads'],
      budget: 1600,
      deadline: '2026-03-30',
      category: 'Digital Marketing',
      status: 'open',
    },
  ]);

  await Setting.create({ id: 1, platformName: 'ProHire', commissionRate: 10 });
}

module.exports = { seedIfEmpty };
