
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
// TEKS_MODULES tidak lagi diperlukan untuk konteks AI, tetapi mungkin masih digunakan oleh bahagian lain aplikasi
// import { TEKS_MODULES } from '../constants';

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => (
  <div className={`chat-bubble ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
    {message.isLoading ? (
      <div className="flex items-center space-x-1">
        <span className="text-xs">Tyson Assistant sedang berfikir</span>
        <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
      </div>
    ) : (
      <p>{message.text}</p>
    )}
  </div>
);

const TysonAssistantSection: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: crypto.randomUUID(), text: "Assalamualaikum! Saya Tyson Assistant, pakar subjek Kelas Kemahiran Al-Quran (KKQ). Sedia membantu anda dengan sebarang pertanyaan berkaitan ilmu tajwid, tarannum, dan topik KKQ yang lain. Apa yang boleh saya bantu hari ini?", sender: 'bot' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    if (!process.env.API_KEY) {
        console.error("API_KEY is not defined in environment variables for Tyson Assistant.");
    }
    aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmedText = inputText.trim();
    if (!trimmedText || isLoading) return;

    const newUserMessage: ChatMessage = { id: crypto.randomUUID(), text: trimmedText, sender: 'user' };
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');
    setIsLoading(true);

    const thinkingMessageId = crypto.randomUUID();
    setMessages(prevMessages => [...prevMessages, { id: thinkingMessageId, text: "Tyson Assistant sedang berfikir...", sender: 'bot', isLoading: true }]);

    if (!aiRef.current) {
      const errorMessage = "Pembantu AI tidak dapat diinisialisasi. Sila pastikan API Key telah ditetapkan dengan betul.";
      setMessages(prevMessages => prevMessages.map(msg => msg.id === thinkingMessageId ? { ...msg, text: errorMessage, isLoading: false } : msg ));
      setIsLoading(false);
      return;
    }

    try {
      // const articlesContext = TEKS_MODULES.map(module => `Tajuk: ${module.title}\nDeskripsi: ${module.description}\nKandungan Penuh:\n${module.content}`).join('\n\n---\n\n');
      
      const systemInstruction = "Anda adalah Tyson Assistant, pakar subjek Kelas Kemahiran Al-Quran (KKQ). Jawab soalan pengguna berkaitan KKQ, merangkumi ilmu tajwid, tarannum, makhraj huruf, sifat huruf, dan topik-topik lain yang berkaitan dengan pembelajaran Al-Quran. Berikan jawapan dalam Bahasa Melayu yang jelas, tepat, dan mudah difahami. Anda boleh menggunakan pengetahuan umum anda mengenai KKQ untuk menjawab. Mulakan jawapan anda dengan sopan.";
      
      // Artikel konteks tidak lagi dimasukkan. AI akan guna pengetahuan umumnya.
      const fullPrompt = `${systemInstruction}\n\nSoalan Pengguna: ${trimmedText}`;

      const response: GenerateContentResponse = await aiRef.current.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: fullPrompt,
        // config: { tools: [{googleSearch: {}}] } // Boleh ditambah jika mahu guna Google Search
      });

      const botResponseText = response.text;
      setMessages(prevMessages => prevMessages.map(msg => msg.id === thinkingMessageId ? { ...msg, text: botResponseText, isLoading: false } : msg ));

    } catch (error) {
      console.error("Error calling Gemini API:", error);
      let errorMessageText = "Maaf, berlaku ralat semasa menghubungi Tyson Assistant. Sila cuba lagi sebentar lagi.";
      if (error instanceof Error && error.message.includes("API key not valid")) {
        errorMessageText = "Maaf, konfigurasi API Key tidak sah. Sila hubungi pentadbir.";
      } else if (error instanceof Error) {
        // Attempt to parse GoogleGenAIError details if available
        // Note: Direct casting to GoogleGenAIError might not work well if the error structure is different.
        // It's safer to check for properties common in API error responses.
        const googleError = error as any; // Use 'any' for broader compatibility with error structures
        if (googleError.message && googleError.message.includes("400") && googleError.message.includes("API_KEY_INVALID")) {
             errorMessageText = "Kunci API tidak sah atau telah disekat. Sila semak konfigurasi anda.";
        } else if (googleError.message && googleError.message.toLowerCase().includes("quota")) {
             errorMessageText = "Kuota API telah dicapai. Sila cuba lagi nanti atau hubungi pentadbir.";
        } else {
             errorMessageText = `Maaf, berlaku ralat: ${error.message}. Sila cuba lagi.`;
        }
      }
      setMessages(prevMessages => prevMessages.map(msg => msg.id === thinkingMessageId ? { ...msg, text: errorMessageText, isLoading: false } : msg ));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="tyson-assistant" className="content-section">
      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 flex items-center">
          <i className="fas fa-robot mr-3 text-accent"></i> TYSON ASSISTANT
        </h2>
        <div className="bg-light rounded-xl p-4 h-[500px] flex flex-col">
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto mb-4 space-y-3 flex flex-col pr-2" id="chat-container">
            {messages.map(msg => <ChatBubble key={msg.id} message={msg} />)}
          </div>
          <div className="flex items-center mt-auto">
            <input
              type="text"
              id="chat-input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleSendMessage(); }}}
              placeholder={isLoading ? "Sedang memproses..." : "Tanya soalan mengenai KKQ..."}
              className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={isLoading}
            />
            <button
              id="send-chat-button"
              onClick={handleSendMessage}
              className="bg-primary text-white px-5 py-3 rounded-r-lg hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TysonAssistantSection;
