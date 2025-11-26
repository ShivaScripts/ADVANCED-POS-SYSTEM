import React from 'react';
import { Database, Server, Layout, Shield, Cloud, HardDrive } from 'lucide-react';

const TechStackSection = () => {
  const technologies = [
    {
      icon: <Server className="w-10 h-10 text-green-600 dark:text-green-400" />,
      name: "Spring Boot",
      role: "Robust Backend",
      description: "Built on Java 17, providing enterprise-level scalability, REST APIs, and high performance.",
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "group-hover:border-green-300 dark:group-hover:border-green-700"
    },
    {
      icon: <Layout className="w-10 h-10 text-blue-500 dark:text-blue-400" />,
      name: "React + Vite",
      role: "Modern Frontend",
      description: "A lightning-fast, responsive UI built with the latest React ecosystem and Redux Toolkit.",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "group-hover:border-blue-300 dark:group-hover:border-blue-700"
    },
    {
      icon: <Cloud className="w-10 h-10 text-orange-500 dark:text-orange-400" />,
      name: "AWS Cloud",
      role: "Scalable Hosting",
      description: "Hosted on AWS Lambda/EC2 for high availability and auto-scaling infrastructure.",
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "group-hover:border-orange-300 dark:group-hover:border-orange-700"
    },
    {
      icon: <Database className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />,
      name: "MySQL Database",
      role: "Relational Data",
      description: "ACID-compliant data storage optimized for complex transaction handling and reporting.",
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      border: "group-hover:border-indigo-300 dark:group-hover:border-indigo-700"
    },
    {
      icon: <HardDrive className="w-10 h-10 text-yellow-600 dark:text-yellow-400" />,
      name: "AWS S3",
      role: "Secure Storage",
      description: "Integrated object storage for securely managing product images, invoices, and documents.",
      bg: "bg-yellow-50 dark:bg-yellow-900/20",
      border: "group-hover:border-yellow-300 dark:group-hover:border-yellow-700"
    },
    {
      icon: <Shield className="w-10 h-10 text-purple-600 dark:text-purple-400" />,
      name: "Spring Security",
      role: "Bank-Grade Auth",
      description: "Stateless authentication utilizing JWT (JSON Web Tokens) with Role-Based Access Control.",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "group-hover:border-purple-300 dark:group-hover:border-purple-700"
    }
  ];

  return (
    <section className="py-24 bg-background border-t border-border/50 transition-colors duration-300">
      {/* UPDATED: w-full for edge-to-edge layout */}
      <div className="w-full px-6 md:px-12 lg:px-20">
        
        <div className="text-center mb-20">
          <div className="inline-block px-4 py-1.5 mb-4 text-sm font-bold tracking-wider text-muted-foreground uppercase bg-muted rounded-full">
            Infrastructure
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
            Powered by <span className="text-primary">Cloud Technology</span>
          </h2>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Z-POS utilizes a modern, cloud-native architecture designed for security, speed, and seamless scalability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {technologies.map((tech, index) => (
            <div 
              key={index} 
              className={`group p-10 rounded-[2rem] border-2 border-transparent transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${tech.bg} ${tech.border}`}
            >
              <div className="mb-8 p-5 bg-background rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-300 group-hover:shadow-md border border-border/10">
                {tech.icon}
              </div>
              
              <h3 className="text-3xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                {tech.name}
              </h3>
              
              <div className="text-sm font-bold text-muted-foreground mb-6 uppercase tracking-widest border-b border-border/20 pb-3 w-fit">
                {tech.role}
              </div>
              
              <p className="text-lg leading-relaxed font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {tech.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;