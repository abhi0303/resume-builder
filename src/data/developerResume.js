import { uid } from '../utils/id'

const b = (text) => ({ id: uid('b'), text })
const tag = (text) => ({ id: uid('b'), text })

/** Sample document that shows off the Modern Minimal template. */
export const developerResume = {
  version: 1,
  templateId: 'modernMinimal',
  theme: { accent: '#3cb9d2', bannerBg: '#14384a', syncHeadingColors: true },
  header: {
    name: 'ADDISON HARRIS',
    title: 'Full Stack Developer | Cloud & Microservices Specialist',
    phone: '(234)-555-1234',
    email: 'harris@enhancv.com',
    website: 'linkedin.com',
    address: 'Indianapolis, Indiana',
  },
  sections: [
    {
      id: uid('sec'),
      type: 'summary',
      heading: 'SUMMARY',
      column: 'main',
      visible: true,
      text:
        'Full Stack Developer with 5+ years of experience building and scaling cloud-native applications. Skilled in Java, Spring Boot, React, and AWS, with a proven track record of boosting performance by 25%, cutting deployment times by 40%, and improving code quality through automated testing. Adept at collaborating with clients and cross-functional teams to deliver reliable, user-focused software solutions.',
    },
    {
      id: uid('sec'),
      type: 'experience',
      heading: 'EXPERIENCE',
      column: 'main',
      visible: true,
      items: [
        {
          id: uid('exp'),
          title: 'Full Stack Developer',
          organization: 'Tech Solutions Inc.',
          dateRange: '06/2021 - 01/2023',
          location: 'Indianapolis, IN',
          bullets: [
            b('Led a team of developers to enhance application performance, resulting in a 25% increase in processing speed and improved user satisfaction.'),
            b('Developed and deployed microservice-based applications in AWS environment, increasing system reliability by 20% with strong emphasis on maintainable code.'),
            b('Implemented unit and integration tests, improving code quality by achieving a 95% test coverage rate.'),
            b('Collaborated closely with clients for custom solutions, enhancing project delivery timelines by 15% due to agile methodologies.'),
            b('Worked with databases such as PostgreSQL and DynamoDB for data integrity, leading to a 30% reduction in data retrieval times.'),
            b('Identified process inefficiencies and proposed creative solutions, resulting in streamlining operations and reducing costs by 10%.'),
          ],
        },
        {
          id: uid('exp'),
          title: 'Software Engineer',
          organization: 'Innovatech LLC',
          dateRange: '04/2019 - 05/2021',
          location: 'Cincinnati, OH',
          bullets: [
            b('Developed seamless user interfaces using ReactJS, enhancing user engagement metrics by 30% through improved UI/UX design.'),
            b('Worked on AWS EC2, ECS, and Lambda to deploy scalable applications, leading to a 40% improvement in deployment efficiency.'),
            b('Conducted thorough code reviews and mentorship, improving team coding standards and decreasing bug count by 20%.'),
            b('Integrated New Relic monitoring tools, successfully reducing application downtime by 15% through proactive alerting.'),
          ],
        },
        {
          id: uid('exp'),
          title: 'Junior Developer',
          organization: 'Future Tech Hub',
          dateRange: '01/2018 - 03/2019',
          location: 'Louisville, KY',
          bullets: [
            b('Assisted in developing features for a Ruby on Rails application, leading to a 20% increase in customer satisfaction ratings.'),
            b('Collaborated with cross-functional teams to smooth deployment cycles, shortening response times to customer feedback by 25%.'),
            b('Examined and optimized front-end Javascript codebase, enhancing performance and reducing load times by 15%.'),
          ],
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'education',
      heading: 'EDUCATION',
      column: 'main',
      visible: true,
      items: [
        {
          id: uid('edu'),
          degree: 'Master of Science in Computer Science',
          institution: 'Purdue University',
          date: '2015',
          location: 'West Lafayette, IN',
          score: '',
          badge: '',
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'highlights',
      heading: 'CERTIFICATION',
      column: 'main',
      visible: true,
      items: [
        {
          id: uid('hl'),
          title: 'AWS Certified Solutions Architect',
          description: 'Offered by Amazon Web Services, focusing on designing distributed applications on AWS.',
          icon: '',
        },
        {
          id: uid('hl'),
          title: 'Full Stack Development with React',
          description: 'Provided by Coursera, taught techniques for building robust React applications.',
          icon: '',
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'skillGroups',
      heading: 'TECHNICAL STACK',
      column: 'side',
      visible: true,
      groups: [
        {
          id: uid('grp'),
          label: 'Front-End Development',
          items: [tag('ReactJS'), tag('JavaScript (ES6+)'), tag('HTML5'), tag('CSS3'), tag('UI/UX Design Principles')],
        },
        {
          id: uid('grp'),
          label: 'Back-End Development',
          items: [tag('Java'), tag('Spring Boot'), tag('Ruby on Rails'), tag('Python'), tag('REST APIs')],
        },
        {
          id: uid('grp'),
          label: 'Cloud & Infrastructure',
          items: [
            tag('AWS (EC2, ECS, Lambda, DynamoDB, S3)'),
            tag('CI/CD Pipelines'),
            tag('Docker'),
            tag('New Relic Monitoring'),
          ],
        },
        { id: uid('grp'), label: 'Databases', items: [tag('PostgreSQL'), tag('DynamoDB')] },
        {
          id: uid('grp'),
          label: 'Collaboration & Process',
          items: [tag('Agile Methodologies'), tag('Code Reviews'), tag('Client Collaboration'), tag('Technical Documentation')],
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'highlights',
      heading: 'PROJECTS & PORTFOLIO',
      column: 'side',
      visible: true,
      items: [
        {
          id: uid('hl'),
          title: 'E-commerce Platform',
          description: 'Built flexible platform using ReactJS + AWS, adopted by 200+ users.',
          icon: '',
        },
        {
          id: uid('hl'),
          title: 'Chat Application',
          description: 'Enhanced real-time communication, improving response speed by 35%.',
          icon: '',
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'highlights',
      heading: 'KEY ACHIEVEMENTS',
      column: 'side',
      visible: true,
      items: [
        {
          id: uid('hl'),
          title: 'Enhanced System Performance',
          description:
            'Optimized application processes and increased efficiency by 25%, improving client satisfaction and user retention rates.',
          icon: '●',
        },
        {
          id: uid('hl'),
          title: 'Decreased Deployment Times',
          description:
            'Streamlined CI/CD processes, reducing deployment times by 40% and ensuring faster delivery of client projects.',
          icon: '★',
        },
        {
          id: uid('hl'),
          title: 'Improved Code Quality Standards',
          description:
            'Established automated testing solutions, resulting in a 95% coverage rate and significantly reducing production bugs.',
          icon: '◆',
        },
      ],
    },
    {
      id: uid('sec'),
      type: 'ratings',
      heading: 'LANGUAGES',
      column: 'side',
      visible: true,
      items: [
        { id: uid('rt'), label: 'English', note: 'Native', level: 5 },
        { id: uid('rt'), label: 'Spanish', note: 'Proficient', level: 4 },
      ],
    },
  ],
}
