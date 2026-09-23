/**
 * ChatPage
 *
 * Displays the message thread between the customer and restaurant staff.
 * The chat input lives in Layout.tsx (bottom nav area) and calls sendChat()
 * from context. This page only renders the message list and scroll target.
 */

import { MessageCircle } from 'lucide-react';
import { useTableOrder } from './TableOrderContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ChatPage() {
  const { t, lang } = useLanguage();
  const { messages, chatBottomRef } = useTableOrder();

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-1 space-y-2.5 min-h-64" role="log" aria-live="polite" aria-label={t.messageStaff}>
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-14 text-center text-muted-foreground">
            <MessageCircle className="w-10 h-10 mb-3 opacity-40" />
            <p className="text-sm">{t.messageStaffPlaceholder}</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderType === 'CUSTOMER' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-layered ${
                msg.senderType === 'CUSTOMER'
                  ? 'bg-primary text-white rounded-br-sm'
                  : 'bg-card border border-border text-foreground rounded-bl-sm'
              }`}
            >
              {msg.senderType !== 'CUSTOMER' && (
                <p className="text-xs font-semibold text-primary mb-0.5">{msg.senderType === 'SYSTEM' ? 'Trợ lý Mix Food' : t.staff}</p>
              )}
              <p>{msg.message}</p>
              <p
                className={`text-[10px] mt-1 ${
                  msg.senderType === 'CUSTOMER'
                    ? 'text-white/60'
                    : 'text-muted-foreground'
                }`}
              >
                {new Date(msg.createdAt).toLocaleTimeString(lang === 'vn' ? 'vi-VN' : 'en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={chatBottomRef} />
      </div>
    </div>
  );
}
