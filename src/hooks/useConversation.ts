import { useCallback, useEffect, useRef, useState } from "react";

// Frontend-only interaction adapter. It mirrors future realtime callbacks but
// intentionally opens no socket and sends no network request.
type ConversationHandlers = {
  onTyping?: (payload: Record<string, unknown>) => void;
  onReceipt?: (payload: Record<string, unknown>) => void;
  onCallEvent?: (payload: Record<string, unknown>) => void;
};

export default function useConversation(conversationId: number, handlers: ConversationHandlers = {}) {
  const handlersRef = useRef(handlers);
  const [connected, setConnected] = useState(false);
  handlersRef.current = handlers;
  useEffect(() => { setConnected(false); return () => setConnected(false); }, [conversationId]);
  const emitTyping = useCallback((typing) => {
    if (!typing) return;
    const timer = setTimeout(() => handlersRef.current.onTyping?.({ conversationId, typing: false, previewOnly: true }), 900);
    return () => clearTimeout(timer);
  }, [conversationId]);
  const markRead = useCallback((messageId) => handlersRef.current.onReceipt?.({ conversationId, messageId, status: "read", previewOnly: true }), [conversationId]);
  const emitCall = useCallback((event, payload = {}) => handlersRef.current.onCallEvent?.({ conversationId, event, ...payload, previewOnly: true }), [conversationId]);
  return { connected, emitTyping, markRead, emitCall, mode: "frontend-preview" };
}
