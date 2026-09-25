import { Bot, MessageCircle, Send, UserRound } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTableSession } from '@/contexts/TableSessionContext';
import { getChatbotReply } from '@/services/table-session.service';
import { useTableOrder } from './TableOrderContext';

type BotMessage = { id: number; sender: 'USER' | 'BOT'; message: string };

export default function ChatPage() {
  const { sessionToken } = useTableSession();
  const { messages, chatBottomRef, sendChat } = useTableOrder();
  const [mode, setMode] = useState<'BOT' | 'STAFF'>('BOT');
  const [input, setInput] = useState('');
  const [botMessages, setBotMessages] = useState<BotMessage[]>([]);
  const [pending, setPending] = useState(false);
  const send = async (event: FormEvent) => {
    event.preventDefault(); const message = input.trim(); if (!message) return; setInput('');
    if (mode === 'STAFF') { await sendChat(message); return; }
    setBotMessages((current) => [...current, { id: Date.now(), sender: 'USER', message }]); setPending(true);
    try { const reply = await getChatbotReply(sessionToken!, message); setBotMessages((current) => [...current, { id: Date.now() + 1, sender: 'BOT', message: reply.message }]); } finally { setPending(false); }
  };
  const visible = mode === 'BOT' ? botMessages : messages.map((message) => ({ id: message.id, sender: message.senderType === 'CUSTOMER' ? 'USER' as const : 'BOT' as const, message: message.message }));
  return <div className="flex h-full flex-col p-4">
    <div className="grid grid-cols-2 gap-2 pb-4"><Button variant={mode === 'BOT' ? 'default' : 'outline'} onClick={() => setMode('BOT')}><Bot />Chat với bot</Button><Button variant={mode === 'STAFF' ? 'default' : 'outline'} onClick={() => setMode('STAFF')}><UserRound />Chat với nhân viên</Button></div>
    <p className="mb-3 text-xs text-muted-foreground">{mode === 'BOT' ? 'Cuộc trò chuyện với bot không được lưu lại.' : 'Tin nhắn sẽ được gửi đến nhân viên hỗ trợ.'}</p>
    <div className="flex-1 space-y-2.5 overflow-y-auto" role="log">{visible.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground"><MessageCircle className="mx-auto mb-2 opacity-40" />{mode === 'BOT' ? 'Xin chào! Tôi có thể hỗ trợ bạn.' : 'Hãy gửi tin nhắn cho nhân viên.'}</div>}{visible.map((message) => <div key={message.id} className={`flex ${message.sender === 'USER' ? 'justify-end' : 'justify-start'}`}><p className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${message.sender === 'USER' ? 'bg-primary text-white' : 'border bg-card'}`}>{message.message}</p></div>)}<div ref={chatBottomRef} /></div>
    <form className="mt-3 flex gap-2 border-t pt-3" onSubmit={send}><Input value={input} onChange={(event) => setInput(event.target.value)} placeholder={mode === 'BOT' ? 'Nhập câu hỏi cho bot...' : 'Nhập tin nhắn cho nhân viên...'} /><Button type="submit" size="icon" disabled={!input.trim() || pending}><Send /></Button></form>
  </div>;
}
