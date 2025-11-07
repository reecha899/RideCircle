const fs = require('fs');

const locations = ['Downtown Toronto', 'North York', 'Scarborough', 'Markham', 'Mississauga', 'Etobicoke', 'Richmond Hill'];
const interests = [
  'Technology', 'Podcasts', 'Music', 'Books', 'Coffee', 'Fitness', 'Yoga',
  'Travel', 'Art', 'Design', 'Gaming', 'Sports', 'Cooking', 'Photography',
  'Sustainability', 'Wellness', 'Business', 'Networking', 'Reading',
  'Science', 'Nature', 'Fashion', 'Healthcare', 'Education'
];

const firstNames = {
  Male: ['Alex', 'Michael', 'James', 'David', 'Ryan', 'Chris', 'Daniel', 'Nathan', 'Marcus', 'Ethan', 'Jack', 'Noah', 'Liam', 'Owen', 'Samuel', 'Benjamin', 'Carter', 'Logan', 'Aiden', 'Tyler', 'Asher', 'Cameron', 'Sebastian', 'Kai', 'River', 'Orion', 'Atlas', 'Blaze', 'Quinn', 'Reed', 'Griffin', 'Archer', 'Jasper', 'Stone', 'Forest', 'Phoenix', 'Sterling', 'Flint', 'Obsidian', 'Quartz', 'Basalt', 'Cobalt', 'Slate', 'Granite'],
  Female: ['Sarah', 'Emily', 'Olivia', 'Sophie', 'Isabella', 'Maya', 'Luna', 'Grace', 'Zoe', 'Ava', 'Chloe', 'Emma', 'Hannah', 'Lily', 'Charlotte', 'Amelia', 'Ivy', 'Natalie', 'Elena', 'Zara', 'Ruby', 'Iris', 'Jade', 'Ocean', 'Sky', 'Hazel', 'Marigold', 'Lavender', 'Pearl', 'Coral', 'Daisy', 'Tulip', 'Violet', 'Rose', 'Saffron', 'Amber', 'Celeste', 'Penelope', 'Victoria', 'Aria', 'Willow', 'Sage', 'Opal', 'Scarlett']
};

const lastNames = ['Chen', 'Johnson', 'Park', 'Davis', 'Wilson', 'Martinez', 'Kim', 'Anderson', 'Thompson', 'Garcia', 'Lee', 'Patel', 'Brown', 'Wang', 'Singh', 'Taylor', 'Rodriguez', 'White', 'Jackson', 'O\'Brien', 'Harris', 'Mitchell', 'Garcia', 'Thompson', 'Brown', 'Martinez', 'Garcia', 'Taylor', 'Rodriguez', 'White', 'Jackson', 'O\'Brien', 'Harris', 'Mitchell', 'Garcia', 'Thompson', 'Brown', 'Martinez', 'Garcia', 'Taylor', 'Rodriguez', 'White', 'Jackson', 'O\'Brien', 'Harris', 'Mitchell'];

const professions = [
  'Software Engineer', 'Marketing Professional', 'Finance Analyst', 'Graphic Designer', 'Teacher',
  'Nurse Practitioner', 'Startup Founder', 'Data Scientist', 'Engineer', 'Content Creator',
  'Product Manager', 'Doctor', 'Architect', 'Consultant', 'Event Planner', 'Lawyer',
  'Musician', 'Fitness Instructor', 'Sales Manager', 'HR Professional', 'Project Manager',
  'Accountant', 'Operations Manager', 'Journalist', 'DevOps Engineer', 'Yoga Instructor',
  'Investment Banker', 'Interior Designer', 'IT Director', 'Veterinarian', 'Sales Engineer',
  'Real Estate Agent', 'Chef', 'Biologist', 'Social Worker', 'Finance Manager', 'Student',
  'Game Developer', 'Photographer', 'UX Designer', 'Marketing Director', 'Fashion Designer',
  'Software Developer', 'Psychologist', 'Life Coach', 'Network Engineer', 'Research Analyst',
  'IT Consultant', 'Pediatrician', 'Construction Manager', 'Educational Consultant', 'Firefighter',
  'Astronomer', 'Audio Engineer', 'Florist', 'Financial Advisor', 'Aromatherapist', 'Pilot',
  'Jewelry Designer', 'Sports Coach', 'Marine Biologist', 'Geologist', 'Gemologist',
  'Environmental Engineer', 'Chef', 'Chemist', 'Paleontologist', 'Herbalist', 'Volcanologist',
  'Agricultural Scientist', 'Mineralogist', 'Horticulturist', 'Perfumer', 'Archaeologist'
];

const bios = [
  'Passionate about connecting with like-minded commuters and building community through shared rides.',
  'Love meaningful conversations during commute. Always open to meeting new people and sharing experiences!',
  'Committed to sustainable commuting and reducing carbon footprint. Let\'s carpool together!',
  'Enjoy productive commutes with good company. Love discussing work, life, and everything in between.',
  'Safety-first commuter looking for reliable carpool partners. Verified connections preferred.',
  'Morning person who loves early commutes. Great conversation starter and always punctual!',
  'Committed to building a strong commute community. Love meeting new people and making friends!',
  'Professional who values efficiency and good company during commute. Let\'s make the journey better together!',
  'Passionate about networking and connecting with professionals. Commute time is networking time!',
  'Love sharing rides and reducing traffic. Always up for interesting conversations and new connections!',
  'Committed to eco-friendly commuting. Let\'s share the ride and reduce our environmental impact!',
  'Enjoy peaceful commutes with respectful companions. Value safety and comfort above all.',
  'Social butterfly who loves meeting new people. Commute buddies make the journey fun!',
  'Professional seeking reliable carpool partners. Punctual, respectful, and great conversation!',
  'Love early morning drives with good music and great company. Always open to new connections!',
  'Committed to building community through shared commutes. Let\'s connect and make the journey better!',
  'Passionate about sustainable living and eco-friendly transportation. Carpooling is the way!',
  'Enjoy productive commutes with interesting people. Love discussing ideas and sharing experiences!',
  'Safety-conscious commuter looking for verified and reliable carpool partners.',
  'Love meeting new people and building connections. Commute time is perfect for networking!',
  'Committed to reducing traffic and environmental impact. Let\'s carpool together!',
  'Professional who values punctuality and good company. Great conversation partner!',
  'Passionate about community building and shared experiences. Let\'s make commuting social!',
  'Love meaningful conversations during commute. Always open to meeting interesting people!',
  'Committed to sustainable commuting and building community. Carpooling makes a difference!',
  'Enjoy productive and enjoyable commutes. Great at starting conversations and making connections!',
  'Safety-first approach to commuting. Prefer verified connections and respectful companions.',
  'Social person who loves meeting new people. Commute buddies make every journey better!',
  'Professional seeking reliable and punctual carpool partners. Great conversation starter!',
  'Passionate about eco-friendly transportation. Let\'s share the ride and reduce our impact!'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInterests() {
  const count = Math.floor(Math.random() * 4) + 3;
  const shuffled = [...interests].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getRouteDistance(from, to) {
  const distances = {
    'Downtown Toronto': { 'North York': '15 km', 'Scarborough': '23 km', 'Markham': '25 km', 'Mississauga': '30 km', 'Etobicoke': '20 km', 'Richmond Hill': '28 km' },
    'North York': { 'Downtown Toronto': '18 km', 'Scarborough': '20 km', 'Markham': '22 km', 'Mississauga': '35 km', 'Etobicoke': '25 km', 'Richmond Hill': '15 km' },
    'Scarborough': { 'Downtown Toronto': '22 km', 'North York': '20 km', 'Markham': '18 km', 'Mississauga': '40 km', 'Etobicoke': '30 km', 'Richmond Hill': '25 km' },
    'Markham': { 'Downtown Toronto': '25 km', 'North York': '22 km', 'Scarborough': '18 km', 'Mississauga': '45 km', 'Etobicoke': '35 km', 'Richmond Hill': '12 km' },
    'Mississauga': { 'Downtown Toronto': '30 km', 'North York': '35 km', 'Scarborough': '40 km', 'Markham': '45 km', 'Etobicoke': '15 km', 'Richmond Hill': '50 km' },
    'Etobicoke': { 'Downtown Toronto': '20 km', 'North York': '25 km', 'Scarborough': '30 km', 'Markham': '35 km', 'Mississauga': '15 km', 'Richmond Hill': '40 km' },
    'Richmond Hill': { 'Downtown Toronto': '28 km', 'North York': '15 km', 'Scarborough': '25 km', 'Markham': '12 km', 'Mississauga': '50 km', 'Etobicoke': '40 km' }
  };
  return distances[from]?.[to] || '25 km';
}

function getCommuteTime() {
  const hours = [6, 7, 8];
  const minutes = [0, 15, 30, 45];
  const hour = getRandomElement(hours);
  const minute = getRandomElement(minutes);
  const period = hour < 7 ? 'AM' : (hour === 7 && minute <= 30) ? 'AM' : 'AM';
  return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
}

const users = [];
let id = 1;

locations.forEach(from => {
  locations.forEach(to => {
    if (from !== to) {
      for (let i = 0; i < 3; i++) {
        const gender = getRandomElement(['Male', 'Female']);
        const firstName = getRandomElement(firstNames[gender]);
        const lastName = getRandomElement(lastNames);
        const age = Math.floor(Math.random() * 20) + 22;
        const verified = Math.random() > 0.3;
        const preferredGender = Math.random() > 0.7 ? (gender === 'Male' ? 'Female' : 'Male') : 'Any';
        
        users.push({
          id: id.toString(),
          name: `${firstName} ${lastName}`,
          age: age,
          gender: gender,
          from: from,
          to: to,
          bio: getRandomElement(bios),
          interests: getRandomInterests(),
          verified: verified,
          profileImage: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName)}&background=3b82f6&color=fff&size=128&bold=true`,
          commuteTime: getCommuteTime(),
          routeDistance: getRouteDistance(from, to),
          preferredGender: preferredGender
        });
        id++;
      }
    }
  });
});

fs.writeFileSync('./src/data/users.json', JSON.stringify(users, null, 2));
console.log(`Generated ${users.length} users covering all route combinations with 3 users per route.`);

