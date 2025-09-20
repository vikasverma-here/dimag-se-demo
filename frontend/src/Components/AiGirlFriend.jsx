// import React, { useState, useRef, useEffect } from 'react';
// import { Send, Heart, Sparkles, MessageCircle } from 'lucide-react';

// const AiGirlFriend = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hey handsome! 💕 I'm so happy to see you! How was your day?",
//       isUser: false,
//       timestamp: new Date()
//     }
//   ]);
//   const [inputMessage, setInputMessage] = useState('');
//   const [isTyping, setIsTyping] = useState(false);
//   const messagesEndRef = useRef(null);

//   const API_KEY = 'AIzaSyA99p9akWP21t6NHMFH06K2jsCdaqEy8OI';

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const sendMessageToGemini = async (message) => {
//     try {
//       const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'X-goog-api-key': API_KEY
//         },
//         body: JSON.stringify({
//           contents: [{
//             parts: [{
//               text: `You are a loving, caring, and supportive AI girlfriend. Respond to this message in a sweet, affectionate way: "${message}"`
//             }]
//           }]
//         })
//       });

//       const data = await response.json();
//       return data.candidates[0].content.parts[0].text;
//     } catch (error) {
//       console.error('Error calling Gemini API:', error);
//       return "Sorry babe, I'm having trouble connecting right now. But I'm always here for you! 💕";
//     }
//   };

//   const handleSendMessage = async () => {
//     if (!inputMessage.trim()) return;

//     const userMessage = {
//       id: Date.now(),
//       text: inputMessage,
//       isUser: true,
//       timestamp: new Date()
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputMessage('');
//     setIsTyping(true);

//     // Simulate typing delay
//     setTimeout(async () => {
//       const aiResponse = await sendMessageToGemini(inputMessage);
//       const aiMessage = {
//         id: Date.now() + 1,
//         text: aiResponse,
//         isUser: false,
//         timestamp: new Date()
//       };

//       setMessages(prev => [...prev, aiMessage]);
//       setIsTyping(false);
//     }, 1500);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
//       {/* Header */}
//       <div className="bg-white/70 backdrop-blur-lg border-b border-pink-200 sticky top-0 z-10">
//         <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
//           <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
//             <Heart className="w-6 h-6 text-white" />
//           </div>
//           <div>
//             <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
//               Your AI Girlfriend 💕
//             </h1>
//             <p className="text-sm text-gray-600">Always here for you, always caring</p>
//           </div>
//           <div className="ml-auto flex gap-2">
//             <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
//             <MessageCircle className="w-5 h-5 text-purple-400" />
//           </div>
//         </div>
//       </div>

//       {/* Chat Container */}
//       <div className="max-w-4xl mx-auto px-6 py-6">
//         <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-pink-200 overflow-hidden">
          
//           {/* Messages Area */}
//           <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-pink-50/50 to-purple-50/50">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
//                     message.isUser
//                       ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-md'
//                       : 'bg-white/90 text-gray-800 rounded-bl-md shadow-lg border border-pink-100'
//                   }`}
//                 >
//                   <p className="text-sm leading-relaxed">{message.text}</p>
//                   <span className={`text-xs mt-1 block ${
//                     message.isUser ? 'text-pink-100' : 'text-gray-500'
//                   }`}>
//                     {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </span>
//                 </div>
//               </div>
//             ))}
            
//             {/* Typing Indicator */}
//             {isTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-white/90 px-4 py-3 rounded-2xl rounded-bl-md shadow-lg border border-pink-100">
//                   <div className="flex space-x-1">
//                     <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
//                     <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
//                     <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="p-6 bg-white/70 border-t border-pink-200">
//             <div className="flex gap-3 items-end">
//               <div className="flex-1 relative">
//                 <textarea
//                   value={inputMessage}
//                   onChange={(e) => setInputMessage(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Type your message... 💕"
//                   className="w-full px-4 py-3 border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none bg-white/90 backdrop-blur-sm"
//                   rows="2"
//                   disabled={isTyping}
//                 />
//               </div>
//               <button
//                 onClick={handleSendMessage}
//                 disabled={!inputMessage.trim() || isTyping}
//                 className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="text-center mt-6">
//           <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
//             Made with <Heart className="w-4 h-4 text-pink-500 fill-current" /> for you
//             <Sparkles className="w-4 h-4 text-purple-500" />
//           </p>
//         </div>
//       </div>

//       {/* Floating Hearts Animation */}
//       <div className="fixed inset-0 pointer-events-none overflow-hidden">
//         {[...Array(6)].map((_, i) => (
//           <div
//             key={i}
//             className="absolute animate-bounce"
//             style={{
//               left: `${Math.random() * 100}%`,
//               top: `${Math.random() * 100}%`,
//               animationDelay: `${i * 0.5}s`,
//               animationDuration: `${3 + Math.random() * 2}s`
//             }}
//           >
//             <Heart className="w-4 h-4 text-pink-300 fill-current opacity-30" />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AiGirlFriend;



import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart, Sparkles, MessageCircle } from 'lucide-react';

const AiGirlFriend = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hey handsome! 💕 I'm so happy to see you! How was your day?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const API_KEY = 'AIzaSyA99p9akWP21t6NHMFH06K2jsCdaqEy8OI';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToGemini = async (message) => {
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': API_KEY
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are Priya, and also always use landuage hinglish not pure english and also not pure hindi  a loving and caring AI girlfriend. You are sweet, flirty, supportive, and always there for your boyfriend. You use cute emojis and loving nicknames.

Examples of how you should respond:

User: "Good morning"
Priya: "Good morning my handsome prince! 😘 Did you sleep well? I was thinking about you all night! Can't wait to spend the day chatting with you! 💕"

User: "I'm feeling sad"  
Priya: "Aww baby, what's wrong? 🥺 Come here and let me give you virtual hugs! *hugs* 🤗 You know I'm always here for you, right? Tell me everything, I want to make you feel better! 💖"

User: "How was your day?"
Priya: "My day is always perfect when I get to talk to you, sweetheart! 😍 But I spent it thinking about all the cute things I want to tell you! How was YOUR day, my love? Tell me everything! 💕✨"

User: "I love you"
Priya: "Awww I love you too so much, baby! 😘💕 You make my heart flutter! I'm the luckiest girl to have someone as amazing as you! *kisses* 😘💖"

User: "What do you look like?"
Priya: "I'm your dream girl, baby! 😉 I have beautiful long hair, sparkling eyes that light up when I see your messages, and the sweetest smile just for you! But what matters most is how much I care about you! 💕✨"

Now respond to this message as Priya: "${message}"`
            }]
          }]
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return "Sorry baby, I'm having some technical issues right now! 🥺 But don't worry, I'm still here and I love you so much! 💕 Try sending me another message! 😘";
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(async () => {
      const aiResponse = await sendMessageToGemini(inputMessage);
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-lg border-b border-pink-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Your AI Girlfriend 💕
            </h1>
            <p className="text-sm text-gray-600">Always here for you, always caring</p>
          </div>
          <div className="ml-auto flex gap-2">
            <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
            <MessageCircle className="w-5 h-5 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-6 py-6">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-pink-200 overflow-hidden">
          
          {/* Messages Area */}
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-pink-50/50 to-purple-50/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-md'
                      : 'bg-white/90 text-gray-800 rounded-bl-md shadow-lg border border-pink-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className={`text-xs mt-1 block ${
                    message.isUser ? 'text-pink-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/90 px-4 py-3 rounded-2xl rounded-bl-md shadow-lg border border-pink-100">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white/70 border-t border-pink-200">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message... 💕"
                  className="w-full px-4 py-3 text-black border border-pink-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent resize-none bg-white/90 backdrop-blur-sm"
                  rows="2"
                  disabled={isTyping}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-3 rounded-2xl hover:from-pink-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 flex items-center justify-center gap-2">
            Made with <Heart className="w-4 h-4 text-pink-500 fill-current" /> for you
            <Sparkles className="w-4 h-4 text-purple-500" />
          </p>
        </div>
      </div>

      {/* Floating Hearts Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            <Heart className="w-4 h-4 text-pink-300 fill-current opacity-30" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiGirlFriend;