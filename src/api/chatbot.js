// src/api/chatbot.js
// Frontend API helper to call backend chatbot endpoint

export async function askChatbot(question) {
  const baseUrl = process.env.REACT_APP_CHATBOT_URL || 'http://127.0.0.1:8000';
  const res = await fetch(`${baseUrl}/api/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  if (!res.ok) throw new Error('Failed to get chatbot response');
  const data = await res.json();
  return data.answer;
}
