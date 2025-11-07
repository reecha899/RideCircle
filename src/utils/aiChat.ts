import { User } from '@/types/user';
import { Message as ChatMessage } from '@/types/chat';

export async function generateAIResponse(
  userMessage: string,
  targetUser: User,
  conversationHistory: ChatMessage[]
): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        targetUser,
        conversationHistory,
      }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error calling AI API:', error);
    return generateFallbackResponse(userMessage, targetUser);
  }
}

function generateFallbackResponse(userMessage: string, targetUser: User): string {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('from') || lowerMessage.includes('address')) {
    if (lowerMessage.includes('from') || lowerMessage.includes('live') || lowerMessage.includes('stay')) {
      return `${targetUser.name} is from ${targetUser.from} and commutes to ${targetUser.to} every day. The commute distance is about ${targetUser.routeDistance}. Would you like to know more about coordinating a ride?`;
    }
    if (lowerMessage.includes('location') || lowerMessage.includes('send')) {
      return `${targetUser.name}'s commute route is from ${targetUser.from} to ${targetUser.to}. They usually leave at ${targetUser.commuteTime}. The route is approximately ${targetUser.routeDistance}. Would you like to coordinate a carpool?`;
    }
    return `${targetUser.name} commutes from ${targetUser.from} to ${targetUser.to}. Would you like to know more about their route?`;
  }

  if (lowerMessage.includes('commute') || lowerMessage.includes('route') || lowerMessage.includes('travel') || lowerMessage.includes('journey')) {
    return `${targetUser.name} commutes from ${targetUser.from} to ${targetUser.to} daily at ${targetUser.commuteTime}. The route is ${targetUser.routeDistance} long. ${targetUser.name} is ${targetUser.verified ? 'verified' : 'looking for'} commute buddies and would love to coordinate!`;
  }

  if (lowerMessage.includes('time') || lowerMessage.includes('when') || lowerMessage.includes('schedule') || lowerMessage.includes('leave')) {
    return `${targetUser.name} typically leaves at ${targetUser.commuteTime} for their commute from ${targetUser.from} to ${targetUser.to}. Would you like to coordinate a similar schedule?`;
  }

  if (lowerMessage.includes('distance') || lowerMessage.includes('how far') || lowerMessage.includes('km') || lowerMessage.includes('kilometer')) {
    return `The commute from ${targetUser.from} to ${targetUser.to} is about ${targetUser.routeDistance}. ${targetUser.name} makes this trip daily. Are you interested in sharing the ride?`;
  }

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hi! I'm ${targetUser.name}'s AI assistant. ${targetUser.name} commutes from ${targetUser.from} to ${targetUser.to} and is interested in ${targetUser.interests.slice(0, 2).join(' and ')}. How can I help you connect?`;
  }

  if (lowerMessage.includes('interest') || lowerMessage.includes('hobby') || lowerMessage.includes('like') || lowerMessage.includes('enjoy')) {
    return `${targetUser.name} enjoys ${targetUser.interests.join(', ')}. Maybe you could discuss ${targetUser.interests[0]} together during your commute!`;
  }

  if (lowerMessage.includes('age') || lowerMessage.includes('old') || lowerMessage.includes('how old')) {
    return `${targetUser.name} is ${targetUser.age} years old. ${targetUser.name} is ${targetUser.gender} and looking for commute buddies!`;
  }

  if (lowerMessage.includes('meet') || lowerMessage.includes('connect') || lowerMessage.includes('coordinate') || lowerMessage.includes('carpool')) {
    return `Great! ${targetUser.name} would love to connect. They're ${targetUser.verified ? 'verified' : 'looking forward to meeting'} and interested in building the RideCircle community! Their route is ${targetUser.from} → ${targetUser.to} at ${targetUser.commuteTime}.`;
  }

  if (lowerMessage.includes('about') || lowerMessage.includes('bio') || lowerMessage.includes('who') || lowerMessage.includes('tell me')) {
    return `${targetUser.name} is ${targetUser.bio} They commute from ${targetUser.from} to ${targetUser.to} and are interested in ${targetUser.interests.slice(0, 3).join(', ')}.`;
  }

  if (lowerMessage.includes('verified') || lowerMessage.includes('safety') || lowerMessage.includes('trust') || lowerMessage.includes('safe')) {
    return `${targetUser.name} is ${targetUser.verified ? 'verified on RideCircle' : 'new to RideCircle'}. ${targetUser.verified ? 'You can trust this profile!' : 'All users go through our verification process for safety.'}`;
  }

  const defaultResponses = [
    `That's a great question! ${targetUser.name} commutes from ${targetUser.from} to ${targetUser.to} and would be happy to discuss this further.`,
    `I'll let ${targetUser.name} know about your message. They're usually available during commute hours (${targetUser.commuteTime}).`,
    `Thanks for reaching out! ${targetUser.name} values meaningful connections. They're from ${targetUser.from} and commute to ${targetUser.to}.`,
    `${targetUser.name} would appreciate that! Would you like to know more about their commute route from ${targetUser.from} to ${targetUser.to}?`,
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export function generateConversationStarter(targetUser: User): string {
  const starters = [
    `Ask ${targetUser.name} about their commute experience!`,
    `You both share interest in ${targetUser.interests[0]} - great conversation starter!`,
    `Since you're both going ${targetUser.to}, why not coordinate?`,
    `${targetUser.name} is ${targetUser.verified ? 'verified' : 'active'} and looking for commute buddies!`,
  ];

  return starters[Math.floor(Math.random() * starters.length)];
}
