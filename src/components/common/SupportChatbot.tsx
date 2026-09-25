import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { io } from 'socket.io-client';

type ChatMessage = { id: number | string; sender: 'USER' | 'BOT'; text: string };
type TypingEvent = { senderType: 'VISITOR' | 'STAFF'; isTyping: boolean };

const chatbotDataset = [
  { keywords: ['thực đơn', 'menu', 'món ăn', 'giá món', 'đồ ăn'], reply: 'Bạn có thể xem toàn bộ thực đơn, giá và món đặc sắc tại mục Thực đơn ở thanh điều hướng.' },
  { keywords: ['giờ mở cửa', 'mở cửa', 'đóng cửa', 'mấy giờ', 'thời gian'], reply: 'Mix Food phục vụ hằng ngày từ 09:00 đến 21:50.' },
  { keywords: ['đặt bàn', 'đặt chỗ', 'giữ bàn', 'reservation'], reply: 'Bạn có thể đặt bàn tại nút Đặt bàn trên đầu trang. Vui lòng chọn ngày, giờ và số lượng khách.' },
  { keywords: ['địa chỉ', 'ở đâu', 'vị trí', 'đường đi', 'location'], reply: 'Mix Food ở K49 Nguyễn Văn Thoại, Hòa Thuận Tây, Hải Châu, Đà Nẵng.' },
  { keywords: ['điện thoại', 'số điện thoại', 'liên hệ', 'gọi'], reply: 'Bạn có thể liên hệ Mix Food qua số 0905 473 728.' },
  { keywords: ['dị ứng', 'ăn chay', 'không cay', 'allergy'], reply: 'Vui lòng ghi chú yêu cầu ăn chay, dị ứng hoặc mức độ cay khi đặt món. Nhà hàng sẽ hỗ trợ xác nhận lại.' },
];

function normalize(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('vi-VN'); }
function getReply(message: string) {
  const normalizedMessage = normalize(message);
  const matched = chatbotDataset.find((item) => item.keywords.some((keyword) => normalizedMessage.includes(normalize(keyword))));
  return matched?.reply ?? 'Tôi chưa hiểu rõ câu hỏi. Bạn có thể hỏi về thực đơn, giờ mở cửa, đặt bàn, địa chỉ hoặc liên hệ nhà hàng.';
}

function TypingIndicator({ staff }: { staff: boolean }) {
  return <div className="flex justify-start"><span className="flex items-center gap-1.5 rounded-2xl bg-muted px-3 py-2 text-xs text-muted-foreground"><span>{staff ? 'Nhân viên đang nhập' : 'Đang nhập'}</span><span className="flex items-center gap-1"><i className="typing-wave-dot size-1.5 rounded-full bg-black" style={{ animationDelay: '0ms' }} /><i className="typing-wave-dot size-1.5 rounded-full bg-black" style={{ animationDelay: '150ms' }} /><i className="typing-wave-dot size-1.5 rounded-full bg-black" style={{ animationDelay: '300ms' }} /></span></span></div>;
}

export default function SupportChatbot() {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'BOT' | 'STAFF'>('BOT');
  const [botTyping, setBotTyping] = useState(false);
  const [staffTyping, setStaffTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([{ id: 0, sender: 'BOT', text: 'Xin chào! Bạn cần Mix Food hỗ trợ thông tin gì?' }]);
  const socketRef = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    const visitorId = localStorage.getItem('mixfood.website-chat-visitor') ?? crypto.randomUUID();
    localStorage.setItem('mixfood.website-chat-visitor', visitorId);
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
    fetch(`${baseUrl}/website-chat/${visitorId}/messages`).then((response) => response.ok ? response.json() : []).then((rows) => { if (rows.length) setMessages(rows.map((row: { id: string; senderType: 'VISITOR' | 'STAFF'; message: string }) => ({ id: row.id, sender: row.senderType === 'STAFF' ? 'BOT' : 'USER', text: row.message }))); }).catch(() => undefined);
    const socket = io(import.meta.env.VITE_WS_URL || baseUrl, {
      auth: { websiteVisitorId: visitorId },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
    socketRef.current = socket;
    socket.on('WEBSITE_CHAT_MESSAGE', (message: { id: string; message: string }) => { setStaffTyping(false); setMessages((current) => current.some((item) => item.id === message.id) ? current : [...current, { id: message.id, sender: 'BOT', text: message.message }]); });
    socket.on('WEBSITE_CHAT_TYPING', (event: TypingEvent) => { if (event.senderType === 'STAFF') setStaffTyping(event.isTyping); });
    return () => { socket.emit('WEBSITE_CHAT_TYPING', { isTyping: false }); socket.disconnect(); socketRef.current = null; };
  }, []);

  const replyTo = (text: string) => {
    setMessages((current) => [...current, { id: Date.now(), sender: 'USER', text }]);
    setBotTyping(true);
    window.setTimeout(() => { setMessages((current) => [...current, { id: Date.now(), sender: 'BOT', text: getReply(text) }]); setBotTyping(false); }, 700);
  };
  const emitStaffTyping = (value: string) => {
    socketRef.current?.emit('WEBSITE_CHAT_TYPING', { isTyping: Boolean(value.trim()) });
  };
  const send = (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    if (mode === 'BOT') replyTo(text);
    else {
      const visitorId = localStorage.getItem('mixfood.website-chat-visitor') ?? crypto.randomUUID();
      localStorage.setItem('mixfood.website-chat-visitor', visitorId);
      emitStaffTyping('');
      setMessages((current) => [...current, { id: Date.now(), sender: 'USER', text }]);
      fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'}/website-chat/messages`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ visitorId, message: text }) }).catch(() => undefined);
    }
    setInput('');
  };

  return <div className="fixed bottom-5 right-5 z-50">
    {open && <section className="mb-3 flex h-[28rem] w-80 flex-col rounded-2xl border bg-card shadow-2xl" aria-label="Trợ lý Mix Food">
      <header className="flex items-center justify-between border-b px-4 py-3"><b className="flex items-center gap-2"><Bot className="text-primary" />{mode === 'BOT' ? 'Trợ lý Mix Food' : lang === 'vn' ? 'Nhân viên hỗ trợ' : 'Staff support'}</b><button onClick={() => setOpen(false)} aria-label="Đóng"><X className="size-4" /></button></header>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">{messages.map((message) => <div key={message.id} className={`flex ${message.sender === 'USER' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${message.sender === 'USER' ? 'bg-primary-gradient text-primary-foreground' : 'bg-muted text-foreground'}`}>{message.text}</p></div>)}{botTyping && <TypingIndicator staff={false} />}{staffTyping && <TypingIndicator staff />}</div>
      <nav className="border-t px-3 py-2 text-xs" aria-label="Chuyển chế độ chat"><button className="w-full rounded-lg border border-primary/30 px-2 py-1.5 text-primary" onClick={() => setMode(mode === 'BOT' ? 'STAFF' : 'BOT')}>{mode === 'BOT' ? (lang === 'vn' ? 'Chat nhân viên' : 'Chat with staff') : (lang === 'vn' ? 'Chat với bot' : 'Chat with bot')}</button></nav>
      <form className="flex items-center gap-2 border-t p-3" onSubmit={send}><input className="h-11 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary" value={input} onChange={(event) => { setInput(event.target.value); if (mode === 'STAFF') emitStaffTyping(event.target.value); }} placeholder={mode === 'BOT' ? (lang === 'vn' ? 'Nhập câu hỏi của bạn...' : 'Ask a question...') : (lang === 'vn' ? 'Nhắn cho nhân viên...' : 'Message staff...')} /><button className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary-gradient text-primary-foreground shadow-sm disabled:opacity-50" disabled={!input.trim() || botTyping} aria-label="Gửi tin nhắn"><Send className="size-4" /></button></form>
    </section>}
    {!open && <button onClick={() => setOpen(true)} className="grid size-14 place-items-center rounded-full bg-primary-gradient text-primary-foreground shadow-lg" aria-label="Mở trợ lý hỗ trợ"><MessageCircle /></button>}
  </div>;
}
