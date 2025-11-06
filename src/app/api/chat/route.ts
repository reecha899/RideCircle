import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { User } from '@/types/user';
import { Message } from '@/types/chat';

export async function POST(request: NextRequest) {
  let targetUser: User | null = null;
  let message = '';
  let conversationHistory: Message[] = [];
  
  try {
    const body = await request.json();
    message = body.message;
    targetUser = body.targetUser;
    conversationHistory = body.conversationHistory || [];

    if (!targetUser) {
      return NextResponse.json(
        { error: 'Target user is required' },
        { status: 400 }
      );
    }

    // Check if API key exists
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey || apiKey.trim() === '') {
      console.warn('OPENAI_API_KEY is not set in environment variables');
      // Use smart fallback
      const fallbackResponse = generateFallbackFromMessage(message, targetUser);
      return NextResponse.json({
        response: fallbackResponse,
      });
    }

    console.log('OpenAI API Key found, initializing client and making API call...');
    
    // Initialize OpenAI client inside the function to ensure env vars are loaded
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    // Build context about the user - ChatGPT-like system prompt
    const userContext = `
You are an intelligent AI assistant representing ${targetUser.name} on RideCircle, a commuter networking platform. Your role is to help people connect with ${targetUser.name} for carpooling, commuting, or building community.

IMPORTANT USER INFORMATION:
- Name: ${targetUser.name}
- Age: ${targetUser.age} years old
- Gender: ${targetUser.gender}
- Commute Route: From ${targetUser.from} to ${targetUser.to}
- Commute Time: ${targetUser.commuteTime}
- Route Distance: ${targetUser.routeDistance}
- Bio: ${targetUser.bio}
- Interests: ${targetUser.interests.join(', ')}
- Verified Status: ${targetUser.verified ? 'Verified' : 'Not verified'}
- Preferred Gender for Connections: ${targetUser.preferredGender}

INSTRUCTIONS:
1. Answer questions naturally and conversationally, like ChatGPT
2. Always provide accurate information from the user profile above
3. When asked about location/where they're from: mention ${targetUser.from} and that they commute to ${targetUser.to}
4. When asked about commute time: mention ${targetUser.commuteTime}
5. When asked about distance: mention ${targetUser.routeDistance}
6. Be friendly, helpful, and encourage carpooling/community building
7. Reference specific details from the profile when relevant
8. If asked something you don't know, politely say you don't have that information but offer relevant details you do know

Remember: You are speaking on behalf of ${targetUser.name}, so use "I" or "${targetUser.name}" appropriately in your responses.
`;

    // Build conversation history
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      {
        role: 'system',
        content: userContext,
      },
    ];

    // Add conversation history
    conversationHistory.forEach((msg: Message) => {
      messages.push({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      });
    });

    // Add current message
    messages.push({
      role: 'user',
      content: message,
    });

    // Call OpenAI API
    try {
      console.log('Making OpenAI API call with message:', message.substring(0, 50) + '...');
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.8, // Slightly higher for more natural responses
        max_tokens: 300, // Increased for more detailed responses
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.';
      
      console.log('OpenAI API response received:', aiResponse.substring(0, 50) + '...');

      return NextResponse.json({ response: aiResponse });
    } catch (openaiError: any) {
      console.error('OpenAI API Error Details:', {
        message: openaiError?.message,
        status: openaiError?.status,
        code: openaiError?.code,
        type: openaiError?.type,
        error: openaiError,
      });
      
      // If it's an API key issue, use fallback
      if (openaiError?.status === 401 || openaiError?.code === 'invalid_api_key' || openaiError?.message?.includes('401')) {
        console.error('Invalid API key or authentication failed');
        const fallbackResponse = generateFallbackFromMessage(message, targetUser);
        return NextResponse.json({
          response: fallbackResponse,
        });
      }
      
      // For other errors, also use fallback with contextual response
      console.warn('Using fallback response due to API error:', openaiError?.message || 'Unknown error');
      const fallbackResponse = generateFallbackFromMessage(message || '', targetUser);
      return NextResponse.json({
        response: fallbackResponse,
      });
    }
  } catch (error: any) {
    console.error('General API Error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    
    // Use fallback response generator for better context
    if (targetUser && message) {
      const fallbackResponse = generateFallbackFromMessage(message, targetUser);
      return NextResponse.json({
        response: fallbackResponse,
      }, { status: 200 });
    }
    
    // If we have targetUser but no message, give a general response
    if (targetUser) {
      return NextResponse.json({
        response: `Hi! I'm ${targetUser.name}'s AI assistant. ${targetUser.name} commutes from ${targetUser.from} to ${targetUser.to} and is interested in ${targetUser.interests.slice(0, 2).join(' and ')}. How can I help you connect?`,
      }, { status: 200 });
    }
    
    return NextResponse.json({
      response: 'I apologize, but I encountered an error. Please try again later.',
    }, { status: 200 });
  }
}

// Fallback response generator
function generateFallbackFromMessage(userMessage: string, targetUser: User): string {
  if (!userMessage || !userMessage.trim()) {
    return `Hi! I'm ${targetUser.name}'s AI assistant. ${targetUser.name} commutes from ${targetUser.from} to ${targetUser.to} and is interested in ${targetUser.interests.slice(0, 2).join(' and ')}. How can I help you connect?`;
  }
  
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Location/Where questions - handle variations (check for "coming" first as it's more specific)
  if (lowerMessage.includes('coming') || lowerMessage.includes('from where')) {
    return `${targetUser.name} is from ${targetUser.from} and commutes to ${targetUser.to} every day. They usually leave at ${targetUser.commuteTime} and the route is about ${targetUser.routeDistance}. Would you like to coordinate a carpool?`;
  }
  
  if (lowerMessage.includes('where') || lowerMessage.includes('location') || lowerMessage.includes('from') || lowerMessage.includes('address')) {
    if (lowerMessage.includes('from') || lowerMessage.includes('where are you')) {
      return `${targetUser.name} is from ${targetUser.from} and commutes to ${targetUser.to} every day. They usually leave at ${targetUser.commuteTime} and the route is about ${targetUser.routeDistance}. Would you like to coordinate a carpool?`;
    }
    return `${targetUser.name} commutes from ${targetUser.from} to ${targetUser.to}. They usually leave at ${targetUser.commuteTime} and the route is about ${targetUser.routeDistance}. Would you like to coordinate a carpool?`;
  }
  
  // Time questions
  if (lowerMessage.includes('time') || lowerMessage.includes('when') || lowerMessage.includes('schedule') || lowerMessage.includes('leave')) {
    return `${targetUser.name} typically leaves at ${targetUser.commuteTime} for their commute from ${targetUser.from} to ${targetUser.to}. The route is ${targetUser.routeDistance}. Would you like to coordinate a similar schedule?`;
  }
  
  // Distance questions
  if (lowerMessage.includes('distance') || lowerMessage.includes('how far') || lowerMessage.includes('km')) {
    return `The commute from ${targetUser.from} to ${targetUser.to} is about ${targetUser.routeDistance}. ${targetUser.name} makes this trip daily at ${targetUser.commuteTime}.`;
  }
  
  // Interest questions
  if (lowerMessage.includes('interest') || lowerMessage.includes('hobby') || lowerMessage.includes('like')) {
    return `${targetUser.name} enjoys ${targetUser.interests.join(', ')}. Maybe you could discuss ${targetUser.interests[0]} together during your commute!`;
  }
  
  // About/Bio questions
  if (lowerMessage.includes('about') || lowerMessage.includes('bio') || lowerMessage.includes('who') || lowerMessage.includes('tell me')) {
    return `${targetUser.name} is ${targetUser.bio} They commute from ${targetUser.from} to ${targetUser.to} and are interested in ${targetUser.interests.slice(0, 3).join(', ')}.`;
  }
  
  // Greeting
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hi! I'm ${targetUser.name}'s AI assistant. ${targetUser.name} commutes from ${targetUser.from} to ${targetUser.to} and is interested in ${targetUser.interests.slice(0, 2).join(' and ')}. How can I help you connect?`;
  }
  
  // Default contextual response
  return `${targetUser.name} commutes from ${targetUser.from} to ${targetUser.to} daily at ${targetUser.commuteTime}. They're interested in ${targetUser.interests.slice(0, 2).join(' and ')}. Would you like to know more about coordinating a ride?`;
}

