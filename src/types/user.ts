export interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  from: string;
  to: string;
  bio: string;
  interests: string[];
  verified: boolean;
  profileImage: string;
  commuteTime: string;
  routeDistance: string;
  preferredGender: string;
}

export interface RouteMatch {
  user: User;
  matchScore: number;
  commonInterests: string[];
  routeOverlap: string;
}
