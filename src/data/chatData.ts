export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  category?: 'ACADEMIC' | 'CAREER' | 'WELLNESS' | 'SCHOLARSHIP' | 'GENERAL';
}

export const initialChatMessages: ChatMessage[] = [
  {
    id: "msg_1",
    sender: "ai",
    text: "Hello Sreethar! I'm your AI Student Assistant. How can I help you today? You can ask me about your academics, career goals, scholarships, or even just check in on your wellness.",
    timestamp: new Date().toISOString(),
    category: "GENERAL"
  }
];

// Mock classification service
export function classifyQuery(query: string): 'ACADEMIC' | 'CAREER' | 'WELLNESS' | 'SCHOLARSHIP' | 'GENERAL' {
  const q = query.toLowerCase();
  if (q.includes('cgpa') || q.includes('subject') || q.includes('marks') || q.includes('study') || q.includes('dbms') || q.includes('quiz') || q.includes('perform')) {
    return 'ACADEMIC';
  }
  if (q.includes('job') || q.includes('placement') || q.includes('resume') || q.includes('interview') || q.includes('career') || q.includes('skill')) {
    return 'CAREER';
  }
  if (q.includes('stress') || q.includes('tired') || q.includes('feel') || q.includes('break') || q.includes('wellness') || q.includes('mental')) {
    return 'WELLNESS';
  }
  if (q.includes('scholarship') || q.includes('scheme') || q.includes('fund') || q.includes('money') || q.includes('government')) {
    return 'SCHOLARSHIP';
  }
  return 'GENERAL';
}

// Mock AI response generation
export function generateMockResponse(query: string, category: string): string {
  switch (category) {
    case 'ACADEMIC':
      if (query.toLowerCase().includes('dbms')) return "Your DBMS performance needs some attention (currently at 68%). I recommend revising Normalization concepts. Should I add a 30-minute revision task to your planner?";
      if (query.toLowerCase().includes('perform')) return "Your overall CGPA is 8.2, which is great! Your strongest subject right now is Data Structures (85%). However, DBMS could use some work.";
      return "Academically, you are doing well with an 87% attendance. Focus on maintaining consistency in your weak subjects.";
      
    case 'CAREER':
      if (query.toLowerCase().includes('placement')) return "Your current placement readiness is at 72%. For your target role as a Software Engineer, you should focus on improving your Advanced DSA and System Design skills.";
      if (query.toLowerCase().includes('resume')) return "Your resume currently has an ATS score of 78/100. It's missing key project keywords related to Machine Learning and full-stack development.";
      return "To reach your goal of Software Engineer, continue building projects in Python and C++, and practice mock interviews.";

    case 'WELLNESS':
      if (query.toLowerCase().includes('stress')) return "I hear you. Balancing academics and placement prep can be very stressful. Take a deep breath. Would you like me to rearrange your study planner to give you a lighter evening today?";
      return "It's important to take regular breaks. Consider trying the Pomodoro technique for your next study session.";

    case 'SCHOLARSHIP':
      return "Based on your profile (S5, AI & DS, CGPA 8.2), you might be eligible for the Pragati Scholarship for Technical Education. Would you like me to fetch the eligibility details?";

    default:
      return "I'm still learning, but I can help you check your academic performance, analyze your career readiness, or find scholarships. What would you like to explore?";
  }
}
