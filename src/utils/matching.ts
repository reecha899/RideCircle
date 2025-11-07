import { User, RouteMatch } from '@/types/user';

export function findMatchingUsers(
  currentRoute: { from: string; to: string },
  allUsers: User[],
  currentUserId?: string
): RouteMatch[] {
  const matches: RouteMatch[] = [];

  allUsers.forEach((user) => {
    if (currentUserId && user.id === currentUserId) return;

    const isExactMatch =
      user.from.toLowerCase() === currentRoute.from.toLowerCase() &&
      user.to.toLowerCase() === currentRoute.to.toLowerCase();

    if (isExactMatch) {
      matches.push({
        user,
        matchScore: 0,
        commonInterests: [],
        routeOverlap: '',
      });
    }
  });

  return matches;
}

export function filterUsers(
  users: RouteMatch[],
  filters: {
    verified?: boolean;
    gender?: string;
    minAge?: number;
    maxAge?: number;
    interests?: string[];
  }
): RouteMatch[] {
  const hasFilters = 
    filters.verified !== undefined ||
    filters.gender !== undefined ||
    filters.minAge !== undefined ||
    filters.maxAge !== undefined ||
    (filters.interests !== undefined && filters.interests.length > 0);

  if (!hasFilters) {
    return users;
  }

  let filtered = [...users];

  if (filters.verified !== undefined) {
    filtered = filtered.filter(
      (match) => match.user.verified === filters.verified
    );
  }

  if (filters.gender !== undefined && filters.gender !== '') {
    filtered = filtered.filter(
      (match) => match.user.gender.toLowerCase() === filters.gender?.toLowerCase()
    );
  }

  if (filters.minAge !== undefined && filters.minAge > 0) {
    filtered = filtered.filter((match) => match.user.age >= filters.minAge!);
  }

  if (filters.maxAge !== undefined && filters.maxAge > 0) {
    filtered = filtered.filter((match) => match.user.age <= filters.maxAge!);
  }

  if (filters.interests !== undefined && filters.interests.length > 0) {
    filtered = filtered.filter((match) =>
      filters.interests!.some((interest) =>
        match.user.interests.some((userInterest) =>
          userInterest.toLowerCase().includes(interest.toLowerCase())
        )
      )
    );
  }

  return filtered;
}
