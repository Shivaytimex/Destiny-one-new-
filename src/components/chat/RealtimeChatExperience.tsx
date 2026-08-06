// @ts-nocheck -- Legacy interaction-dense UI; typed repository boundaries remain enforced.
import {
  Archive, Bell, CalendarDays, Check, CheckCheck, ChevronLeft, Edit3, FileText, Forward, Image as ImageIcon,
  Gamepad2, Link2, MapPin, MoreVertical, Pause, Phone, Pin, Play, RotateCcw, Search, Settings, ShieldCheck, Trash2, Video, Wifi, WifiOff, X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChatComposer from "./ChatComposer";
import useConversation from "../../hooks/useConversation";
import useWebRtcCall from "../../hooks/useWebRtcCall";
import { frontendRepository } from "../../data/frontendRepository";
import { registerBrowserPush } from "../../services/push";
import ChatMediaPicker from "./ChatMediaPicker";
import CoupleGamesPanel from "./CoupleGamesPanel";
import { classifyEmojiMotion } from "../../data/chatMediaCatalog";

const people = [
  { id: 1, name: "Anika", initial: "A", preview: "That sounds perfect 😊", verified: true, online: true },
  { id: 2, name: "Maya", initial: "M", preview: "You shared a date idea", verified: true, online: false },
  { id: 3, name: "Riya", initial: "R", preview: "Voice note · 0:18", verified: true, online: true },
];

// Stable preview timestamps prevent server/client hydration drift in static builds.
const seedTime = Date.UTC(2026, 7, 5, 20, 0, 0);
const fallback = {
  1: [
    { id: "seed-1", senderId: 102, body: "Your ideal first date: a quiet café or something outdoors?", createdAt: seedTime - 9 * 60000, status: "read", type: "text" },
    { id: "seed-2", senderId: 1, body: "A café first, then a walk if the conversation is flowing.", createdAt: seedTime - 7 * 60000, status: "read", type: "text" },
    { id: "seed-3", senderId: 102, body: "That sounds perfect 😊", createdAt: seedTime - 5 * 60000, status: "read", type: "text" },
  ],
  2: [{ id: "seed-4", senderId: 1, body: "Date idea · Saturday, 7:30 PM", createdAt: seedTime - 86400000, status: "delivered", type: "text" }],
  3: [{ id: "seed-5", senderId: 103, body: "I would love to hear your travel story.", createdAt: seedTime - 3600000, status: "read", type: "text" }],
};

const replyPool = [
  "I like that. Tell me a little more?",
  "That sounds thoughtful — I’d be open to it 😊",
  "Yes, that pace feels comfortable to me.",
];

const GIF_CACHE_KEY = "destinyone:chat-gif-library-v1";
function uid(prefix = "msg") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatMessageTime(value) {
  const date = new Date(value);
  let hour = date.getUTCHours();
  const minute = String(date.getUTCMinutes()).padStart(2, "0");
  const suffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${suffix}`;
}

function Receipt({ status }) {
  const title = status === "sent" ? "Sent · one tick" : status === "delivered" ? "Delivered · two ticks" : "Read · blue ticks";
  return <span className={`pro-chat-receipt ${status}`} title={title} aria-label={title}>{status === "sent" ? <Check size={15} /> : <CheckCheck size={15} />}</span>;
}

function safeLinkPreview(body) {
  const candidate = String(body || "").match(/https?:\/\/[^\s<>"')\]]+/i)?.[0];
  if (!candidate) return null;
  try {
    const url = new URL(candidate); const host = url.hostname.replace(/^www\./, "").toLowerCase();
    const short = ["bit.ly", "tinyurl.com", "t.co", "cutt.ly", "rb.gy", "is.gd"].includes(host);
    const sensitive = /login|verify|wallet|crypto|payment|gift-card|password|otp|seed-phrase/i.test(`${host}${url.pathname}`);
    const level = short || url.protocol !== "https:" ? "danger" : sensitive ? "caution" : "safe";
    return { url: url.toString(), host, level, title: decodeURIComponent(url.pathname).replace(/[\/_-]+/g, " ").trim() || "Shared link" };
  } catch { return { url: candidate, host: "Unverified destination", level: "danger", title: "Check this link before opening" }; }
}

function VoiceMessage({ message }) {
  const audioRef = useRef(null); const [rate, setRate] = useState(1); const [showTranscript, setShowTranscript] = useState(false); const [playing, setPlaying] = useState(false); const [current, setCurrent] = useState(0); const [duration, setDuration] = useState(Number(message.payload?.duration || 0));
  const progress = duration > 0 ? Math.min(1, current / duration) : 0;
  const bars = [8,14,21,12,27,18,10,23,31,16,25,12,19,28,14,22,9,26,18,30,13,23,16,11];
  function cycleRate() { const next = rate === 1 ? 1.5 : rate === 1.5 ? 2 : 1; setRate(next); if (audioRef.current) audioRef.current.playbackRate = next; }
  async function togglePlayback() { const audio = audioRef.current; if (!audio) return; if (audio.paused) { await audio.play(); setPlaying(true); } else { audio.pause(); setPlaying(false); } }
  function seek(event) { const audio = audioRef.current; if (!audio || !duration) return; const bounds = event.currentTarget.getBoundingClientRect(); const next = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)); audio.currentTime = next * duration; setCurrent(audio.currentTime); }
  const format = (value) => `${Math.floor(value / 60)}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
  return <div className="pro-voice-note"><audio ref={audioRef} preload="metadata" src={message.payload?.url} onLoadedMetadata={(event) => setDuration(Number.isFinite(event.currentTarget.duration) ? event.currentTarget.duration : duration)} onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)} onEnded={() => { setPlaying(false); setCurrent(0); }} /><div className="pro-voice-player"><button className="pro-voice-play" onClick={togglePlayback} aria-label={`${playing ? "Pause" : "Play"} voice note`}>{playing ? <Pause size={15} /> : <Play size={15} />}</button><button className="pro-voice-wave" onClick={seek} aria-label={`Voice note position ${Math.round(progress * 100)} percent`}><span className="pro-voice-bars">{bars.map((height, index) => <i key={index} className={index / bars.length <= progress ? "played" : ""} style={{ height }} />)}</span><small>{format(playing ? current : duration)}</small></button></div><div className="pro-voice-tools"><button onClick={cycleRate} aria-label={`Playback speed ${rate} times`}>{rate}×</button><button onClick={() => setShowTranscript((value) => !value)} aria-expanded={showTranscript}>Transcript</button></div>{showTranscript && <p className="pro-voice-transcript">{message.payload?.transcript || (message.payload?.transcriptStatus === "processing" ? "Transcription is processing securely…" : "A transcript was not captured for this voice note.")}</p>}</div>;
}

function RichLinkCard({ body, serverSafety }) {
  const preview = serverSafety || safeLinkPreview(body); const [confirmed, setConfirmed] = useState(false);
  if (!preview) return null;
  function open() { if (preview.level !== "safe" && !confirmed) { setConfirmed(true); return; } window.open(preview.url, "_blank", "noopener,noreferrer"); }
  return <button className={`pro-link-card ${preview.level}`} onClick={open}><span><Link2 size={17} /></span><span><small>{preview.host}</small><strong>{preview.title || "Shared link"}</strong><em>{confirmed ? "Domain reviewed · tap again to open" : preview.level === "safe" ? "Secure HTTPS link" : "Review this destination before opening"}</em></span></button>;
}

function CallDialog({ person, mode, onClose, emitCall, callEvent, incomingCallId = null }) {
  const [seconds, setSeconds] = useState(0);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const call = useWebRtcCall({ mode, incomingCallId, emitCall, callEvent, onRemoteEnded: onClose });
  const { state, error, muted, setMuted, camera, setCamera } = call;
  useEffect(() => { if (localVideoRef.current) localVideoRef.current.srcObject = call.localStream; }, [call.localStream]);
  useEffect(() => { if (remoteVideoRef.current) remoteVideoRef.current.srcObject = call.remoteStream; }, [call.remoteStream]);
  useEffect(() => {
    if (state !== "connected") return undefined;
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => clearInterval(timer);
  }, [state]);
  function end() {
    call.end();
    onClose();
  }
  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  const status = state === "permission" ? "Checking device permissions…" : state === "ringing" ? `Ringing ${person.name}…` : state === "connecting" ? "Creating secure connection…" : state === "blocked" ? "Permission needed" : `Secure ${mode} call · ${time}`;
  return <div className="pro-chat-modal pro-call-modal" role="dialog" aria-modal="true" aria-label={`${mode} call with ${person.name}`}>
    <div className="pro-call-security"><ShieldCheck size={16} /> Mutual-match encrypted call</div>
    <div className={`pro-call-avatar ${state === "connected" ? "connected" : ""}`}>{person.initial}</div>
    <h2>{person.name}</h2><p>{status}</p>
    {mode === "video" && state !== "blocked" && <div className="pro-call-video">{call.remoteStream ? <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" /> : <div className="pro-call-remote">{person.initial}<span>{state === "connected" ? "Connected" : "Securing video"}</span></div>}<video ref={localVideoRef} autoPlay muted playsInline className={camera ? "" : "camera-off"} /></div>}
    {error && <div className="pro-call-error">{error}<button onClick={call.retry}>Retry</button></div>}
    <div className="pro-call-actions">
      <button onClick={() => setMuted((value) => !value)} className={muted ? "active" : ""}>{muted ? "Unmute" : "Mute"}</button>
      {mode === "video" && <button onClick={() => setCamera((value) => !value)} className={!camera ? "active" : ""}>{camera ? "Camera on" : "Camera off"}</button>}
      <button className="end" onClick={end}>End call</button>
    </div>
    <small>Ringing, permission, media-track and signaling lifecycle are active.</small>
  </div>;
}

function DateDialog({ onClose, onSend }) {
  const [form, setForm] = useState({ venue: "Juniper & Ivy", area: "Little Italy", date: "2026-08-08", time: "19:30", safety: true });
  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.type === "checkbox" ? event.target.checked : event.target.value }));
  return <div className="pro-chat-modal pro-date-modal" role="dialog" aria-modal="true" aria-label="Plan a date">
    <button className="pro-chat-modal-close" onClick={onClose} aria-label="Close date planner"><X size={19} /></button>
    <div className="pro-chat-modal-icon"><CalendarDays /></div><p className="eyebrow">PRIVATE DATE PLAN</p><h2>Plan something thoughtful.</h2>
    <div className="pro-date-grid"><label>Venue<input value={form.venue} onChange={update("venue")} /></label><label>Area<input value={form.area} onChange={update("area")} /></label><label>Date<input type="date" value={form.date} onChange={update("date")} /></label><label>Time<input type="time" value={form.time} onChange={update("time")} /></label></div>
    <label className="pro-date-safety"><input type="checkbox" checked={form.safety} onChange={update("safety")} /><ShieldCheck size={18} /><span><strong>Safety check-in</strong><small>Private reminder before and after the date.</small></span></label>
    <div className="pro-date-actions"><button className="secondary-button" onClick={onClose}>Cancel</button><button className="primary-button" onClick={() => onSend(form)}>Send date proposal</button></div>
  </div>;
}

export default function RealtimeChatExperience() {
  const [activeId, setActiveId] = useState(1);
  const [currentUserId, setCurrentUserId] = useState(1);
  const [messagesByConversation, setMessagesByConversation] = useState(fallback);
  const [online, setOnline] = useState(true);
  const [partnerTyping, setPartnerTyping] = useState(false);
  const [presence, setPresence] = useState("online");
  const [nickname, setNickname] = useState("");
  const [nicknameDraft, setNicknameDraft] = useState("");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [panel, setPanel] = useState(null);
  const [callMode, setCallMode] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [incomingCallId, setIncomingCallId] = useState(null);
  const [lastCallEvent, setLastCallEvent] = useState(null);
  const [attachments, setAttachments] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [gifOpen, setGifOpen] = useState(false);
  const [gifTab, setGifTab] = useState("all");
  const [gifQuery, setGifQuery] = useState("");
  const [gifLibrary, setGifLibrary] = useState({ recents: [], favourites: [] });
  const [gamesOpen, setGamesOpen] = useState(false);
  const [recording, setRecording] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editDraft, setEditDraft] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [pinnedIds, setPinnedIds] = useState([]);
  const [forwardMessage, setForwardMessage] = useState(null);
  const [forwardRecipients, setForwardRecipients] = useState([]);
  const [conversationPreferences, setConversationPreferences] = useState({});
  const timers = useRef([]);
  const messageRefs = useRef({});
  const deleteTimer = useRef(null);
  const recorder = useRef(null);
  const chunks = useRef([]);
  const fileInput = useRef(null);
  const person = people.find((item) => item.id === activeId) || people[0];
  const messages = messagesByConversation[activeId] || [];
  const activePreference = { pinned: false, archived: false, notificationMode: "all", notificationSound: "Destiny Chime", mutedUntil: null, ...(conversationPreferences[activeId] || {}) };

  const receive = useCallback((message) => {
    setMessagesByConversation((current) => {
      const items = current[activeId] || [];
      const existing = items.find((item) => item.id === message.id || (message.clientId && item.clientId === message.clientId));
      if (existing) return { ...current, [activeId]: items.map((item) => item === existing ? { ...message, id: item.id, senderId: item.senderId, status: item.status, type: message.type || item.type || "text" } : item) };
      return { ...current, [activeId]: [...items, { ...message, status: message.status || "delivered", type: message.type || "text" }] };
    });
  }, [activeId]);
  const realtime = useConversation(activeId, {
    onMessage: (message) => { receive(message); if (message.senderId !== currentUserId) setTimeout(() => realtime.markRead(message.id), 250); },
    onMessageUpdated: receive,
    onMessageDeleted: ({ messageId, deletedForEveryoneAt }) => setMessagesByConversation((current) => ({ ...current, [activeId]: (current[activeId] || []).map((item) => String(item.id) === String(messageId) ? { ...item, body: "", payload: null, deletedForEveryoneAt } : item) })),
    onTyping: (payload) => setPartnerTyping(Boolean(payload?.typing)),
    onPresence: (payload) => setPresence(payload?.online ? "online" : "offline"),
    onReceipt: ({ messageId, clientId, status }) => setMessagesByConversation((current) => ({ ...current, [activeId]: (current[activeId] || []).map((item) => String(item.id) === String(messageId) || (clientId && item.clientId === clientId) ? { ...item, status } : item) })),
    onCallEvent: (payload) => {
      setLastCallEvent(payload);
      if (payload.event === "invite") setIncomingCall(payload);
      if (payload.event === "reject") { setCallMode(null); setNotice(`${person.name} could not take the call`); }
      if (["end", "missed"].includes(payload.event)) { setCallMode(null); setIncomingCall(null); setNotice(payload.event === "missed" ? "Call was not answered" : "Call ended securely"); }
    },
  });

  useEffect(() => {
    const previewViewer = Number(new URLSearchParams(window.location.search).get("viewer"));
    if (previewViewer > 0) setCurrentUserId(previewViewer);
    else frontendRepository.session.currentUser().then((user) => user?.id && setCurrentUserId(Number(user.id)));
  }, []);
  useEffect(() => {
    let saved = {}; try { saved = JSON.parse(localStorage.getItem("destinyone:conversation-preferences") || "{}"); } catch { localStorage.removeItem("destinyone:conversation-preferences"); }
    setConversationPreferences(saved);
    frontendRepository.chat.inbox().then((items) => setConversationPreferences((current) => ({ ...current, ...(items || {}) })));
  }, []);
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(GIF_CACHE_KEY) || "{}");
      setGifLibrary({ recents: Array.isArray(saved.recents) ? saved.recents : [], favourites: Array.isArray(saved.favourites) ? saved.favourites : [] });
    } catch { localStorage.removeItem(GIF_CACHE_KEY); }
  }, []);
  useEffect(() => {
    const saved = localStorage.getItem(`destinyone:nickname:${activeId}`) || "";
    setNickname(saved); setNicknameDraft(saved);
    frontendRepository.chat.messages(activeId).then((items) => items?.length && setMessagesByConversation((current) => ({ ...current, [activeId]: items.map((item) => ({ ...item, type: item.type || "text", status: item.status || "delivered" })) })));
    frontendRepository.chat.pinned(activeId).then((items) => Array.isArray(items) && setPinnedIds(items.map((item) => item.id)));
    frontendRepository.chat.preferences(activeId).then((item) => item && setConversationPreferences((current) => ({ ...current, [activeId]: { ...current[activeId], ...item } })));
  }, [activeId]);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync(); window.addEventListener("online", sync); window.addEventListener("offline", sync);
    return () => { window.removeEventListener("online", sync); window.removeEventListener("offline", sync); };
  }, []);
  useEffect(() => {
    if (!online || realtime.connected) return;
    setMessagesByConversation((current) => ({ ...current, [activeId]: (current[activeId] || []).map((item) => item.senderId === currentUserId && item.status === "sent" ? { ...item, status: "delivered" } : item) }));
  }, [activeId, currentUserId, online, realtime.connected]);
  useEffect(() => () => { timers.current.forEach(clearTimeout); if (deleteTimer.current) clearTimeout(deleteTimer.current); }, []);

  function updateStatus(id, status) {
    setMessagesByConversation((current) => ({ ...current, [activeId]: (current[activeId] || []).map((item) => item.id === id ? { ...item, status } : item) }));
  }
  function scheduleLifecycle(message) {
    if (!online) return;
    timers.current.push(setTimeout(() => { updateStatus(message.id, "delivered"); setPartnerTyping(true); }, 650));
    timers.current.push(setTimeout(() => { updateStatus(message.id, "read"); setPartnerTyping(false); }, 2100));
    timers.current.push(setTimeout(() => {
      const reply = { id: uid("reply"), senderId: currentUserId === 1 ? 102 : 1, body: replyPool[Math.floor(Math.random() * replyPool.length)], createdAt: Date.now(), status: "read", type: "text" };
      receive(reply); setNotice(`${person.name} replied`);
      if ("Notification" in window && Notification.permission === "granted" && document.hidden) new Notification(`${person.name} · DestinyOne`, { body: reply.body });
    }, 3100));
  }
  async function send(body, extra = {}) {
    const replyPayload = replyTo ? { replyToMessageId: replyTo.id, replyQuote: replyTo.body } : {};
    const optimistic = { id: uid(), clientId: uid("client"), senderId: currentUserId, body, createdAt: Date.now(), status: "sent", type: extra.type || "text", ...extra, payload: { ...(extra.payload || {}), ...replyPayload } };
    setReplyTo(null);
    receive(optimistic); if (!realtime.connected) scheduleLifecycle(optimistic); setAttachments(false); setEmojiOpen(false);
    try {
      const stored = await frontendRepository.chat.send({ conversationId:activeId,body,clientId:optimistic.clientId,type:optimistic.type,payload:extra.payload });
      if (stored) receive(stored);
    } catch { setNotice(online ? "Preview mode · realtime behavior is running locally" : "Offline · message queued with one tick"); }
  }
  function sendDate(form) {
    send(`${form.venue} · ${form.area}`, { type: "date", payload: { ...form, status: "proposed" } }); setPanel(null);
  }
  function saveNickname() {
    const value = nicknameDraft.trim(); setNickname(value); localStorage.setItem(`destinyone:nickname:${activeId}`, value); void saveConversationPreference({ nickname: value }); setNotice(value ? `Chat name saved as ${value}` : "Custom name removed"); setPanel(null);
  }
  async function saveConversationPreference(patch) {
    const next = { ...activePreference, ...patch, nickname: patch.nickname ?? nickname, theme: activePreference.theme || "Ruby Velvet" };
    setConversationPreferences((current) => { const updated = { ...current, [activeId]: next }; localStorage.setItem("destinyone:conversation-preferences", JSON.stringify(updated)); return updated; });
    await frontendRepository.chat.savePreferences({ ...conversationPreferences, [activeId]:next });
  }
  async function saveEdit() {
    const body = editDraft.trim(); if (!editingMessage || !body) return;
    const updated = { ...editingMessage, body, editedAt: new Date().toISOString(), payload: { ...(editingMessage.payload || {}), linkSafety: safeLinkPreview(body) } };
    receive(updated); setEditingMessage(null); setEditDraft("");
    await frontendRepository.chat.edit({ conversationId:activeId,messageId:editingMessage.id,body });
  }
  function requestDelete(message) {
    if (deleteTimer.current) clearTimeout(deleteTimer.current);
    setMessagesByConversation((current) => ({ ...current, [activeId]: (current[activeId] || []).filter((item) => item.id !== message.id) }));
    setPendingDelete({ message, activeId });
    deleteTimer.current = setTimeout(async () => { await frontendRepository.chat.remove({ conversationId:activeId,messageId:message.id });setPendingDelete(null);deleteTimer.current=null; }, 5000);
  }
  function undoDelete() {
    if (!pendingDelete) return; if (deleteTimer.current) clearTimeout(deleteTimer.current);
    setMessagesByConversation((current) => ({ ...current, [pendingDelete.activeId]: [...(current[pendingDelete.activeId] || []), pendingDelete.message].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) }));
    setPendingDelete(null); deleteTimer.current = null;
  }
  async function togglePin(message) {
    const pinned = !pinnedIds.some((id) => String(id) === String(message.id));
    setPinnedIds((current) => pinned ? [...current, message.id] : current.filter((id) => String(id) !== String(message.id)));
    await frontendRepository.chat.pin({ conversationId:activeId,messageId:message.id,pinned });
  }
  async function forwardSelected() {
    if (!forwardMessage || !forwardRecipients.length) return;
    const source = forwardMessage; const targets = [...forwardRecipients];
    targets.forEach((targetId) => setMessagesByConversation((current) => ({ ...current, [targetId]: [...(current[targetId] || []), { ...source, id: uid("forward"), senderId: currentUserId, createdAt: Date.now(), status: "sent", forwardedFromMessageId: source.id, payload: { ...(source.payload || {}), forwarded: true } }] })));
    setForwardMessage(null); setForwardRecipients([]); setPanel(null);
    await frontendRepository.chat.forward({ sourceConversationId:activeId,messageIds:[source.id],targetConversationIds:targets });
  }
  async function enableNotifications() {
    try { await registerBrowserPush(); setNotice("Real message and call notifications enabled"); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Notifications were not enabled"); }
  }
  async function voiceNote() {
    if (recording) { recorder.current?.stop(); setRecording(false); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = []; recorder.current = new MediaRecorder(stream);
      recorder.current.ondataavailable = (event) => chunks.current.push(event.data);
      recorder.current.onstop = () => { const url = URL.createObjectURL(new Blob(chunks.current, { type: "audio/webm" })); stream.getTracks().forEach((track) => track.stop()); send("Voice note", { type: "voice", payload: { url } }); };
      recorder.current.start(); setRecording(true);
    } catch { setNotice("Microphone permission is needed for a voice note"); }
  }
  function cacheGif(next) {
    setGifLibrary(next); localStorage.setItem(GIF_CACHE_KEY, JSON.stringify(next));
  }
  function selectGif(gif) {
    const recents = [gif, ...gifLibrary.recents.filter((item) => item.id !== gif.id)].slice(0, 24);
    cacheGif({ ...gifLibrary, recents }); setGifOpen(false); setGifQuery("");
    send(gif.title, { type: "gif", payload: { gif } });
  }
  function selectSticker(sticker) {
    setGifOpen(false); setGifQuery("");
    send(sticker.label, { type: "sticker", payload: { sticker } });
  }
  function sendGame(game, prompt) {
    setGamesOpen(false);
    send(prompt, { type: "game", payload: { gameId: game.id, gameTitle: game.title, gameTag: game.tag, prompt, answers: [] } });
  }
  function toggleGifFavourite(gif) {
    const exists = gifLibrary.favourites.some((item) => item.id === gif.id);
    const favourites = exists ? gifLibrary.favourites.filter((item) => item.id !== gif.id) : [gif, ...gifLibrary.favourites].slice(0, 60);
    cacheGif({ ...gifLibrary, favourites });
  }
  function shareLocation() {
    navigator.geolocation?.getCurrentPosition((position) => send("Live location shared", { type: "location", payload: { latitude: position.coords.latitude, longitude: position.coords.longitude } }), () => setNotice("Location permission is needed"));
  }
  function selectPhoto(event) {
    const file = event.target.files?.[0]; if (!file) return;
    send(file.name, { type: "image", payload: { url: URL.createObjectURL(file) } }); event.target.value = "";
  }
  const filteredMessages = useMemo(() => messages.filter((item) => !search.trim() || String(item.body || "").toLowerCase().includes(search.trim().toLowerCase())), [messages, search]);
  const pinnedMessages = messages.filter((message) => pinnedIds.some((id) => String(id) === String(message.id)) && !message.deletedForEveryoneAt);
  const visiblePeople = [...people].filter((item) => !conversationPreferences[item.id]?.archived || item.id === activeId).sort((a, b) => Number(Boolean(conversationPreferences[b.id]?.pinned)) - Number(Boolean(conversationPreferences[a.id]?.pinned)));

  return <div className="pro-chat-shell">
    <aside className="pro-chat-sidebar"><div className="pro-chat-sidebar-head"><div><small>MESSAGES</small><h2>Conversations</h2></div><button aria-label="Search conversations"><Search size={18} /></button></div>{visiblePeople.map((item) => <button key={item.id} onClick={() => setActiveId(item.id)} className={`pro-chat-person ${item.id === activeId ? "active" : ""}`}><span className="pro-chat-person-avatar">{item.initial}<i className={item.online ? "online" : ""} /></span><span><strong>{item.id === activeId && nickname ? nickname : item.name}{conversationPreferences[item.id]?.pinned && <Pin size={11} />}</strong><small>{item.preview}</small></span><time>{conversationPreferences[item.id]?.notificationMode === "muted" ? "muted" : item.id === 1 ? "now" : "1h"}</time></button>)}{people.some((item) => conversationPreferences[item.id]?.archived) && <button className="pro-chat-archive-link" onClick={() => { const archived = people.find((item) => conversationPreferences[item.id]?.archived); if (archived) setActiveId(archived.id); }}><Archive size={15} /> Archived conversations</button>}</aside>
    <section className="pro-chat-main">
      <header className="pro-chat-header"><button className="pro-chat-back" aria-label="Back to conversations"><ChevronLeft /></button><span className="pro-chat-person-avatar large">{person.initial}<i className={(online && presence !== "offline") ? "online" : ""} /></span><button className="pro-chat-identity" onClick={() => setPanel("settings")}><strong>{nickname || person.name}{person.verified && <ShieldCheck size={14} />}</strong><small className={partnerTyping ? "typing" : ""}>{partnerTyping ? `${person.name} is typing…` : !online ? "Waiting for connection" : realtime.connected ? "Online · realtime connected" : "Online now"}</small></button><div className="pro-chat-header-actions"><button onClick={() => { setIncomingCallId(null); setCallMode("audio"); }} aria-label="Audio call"><Phone /></button><button onClick={() => { setIncomingCallId(null); setCallMode("video"); }} aria-label="Video call"><Video /></button><button onClick={() => setPanel("date")} aria-label="Plan a date"><CalendarDays /></button><button onClick={() => setPanel("settings")} aria-label="Chat settings"><MoreVertical /></button></div></header>
      <div className="pro-chat-toolbar"><span><ShieldCheck size={15} /> Private, mutual-match conversation</span><button onClick={() => setPanel("date")}><CalendarDays size={15} /> Plan date</button><button onClick={enableNotifications}><Bell size={15} /> Notifications</button><label><Search size={15} /><input aria-label="Search this conversation" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" /></label></div>
      {notice && <button className="pro-chat-notice" onClick={() => setNotice("")}><span>{notice}</span><X size={16} /></button>}
      {!!pinnedMessages.length && <button className="pro-pinned-banner" onClick={() => messageRefs.current[pinnedMessages[0].id]?.scrollIntoView({ behavior: "smooth", block: "center" })}><Pin size={15} /><span><strong>{pinnedMessages.length} pinned {pinnedMessages.length === 1 ? "message" : "messages"}</strong><small>{pinnedMessages[0].body || "Shared item"}</small></span></button>}
      {pendingDelete && <div className="pro-undo-delete" role="status"><span>Message deleted</span><button onClick={undoDelete}><RotateCcw size={14} /> Undo</button></div>}
      <div className="pro-chat-messages"><div className="pro-chat-day">TODAY</div>{filteredMessages.map((message) => {
        const mine = message.senderId === currentUserId; const reply = message.payload?.replyToMessageId ? messages.find((item) => String(item.id) === String(message.payload.replyToMessageId)) : null;
        return <div ref={(node) => { if (node) messageRefs.current[message.id] = node; }} id={`message-${message.id}`} key={message.id} className={`pro-message-row ${mine ? "mine" : "theirs"}`}><div className={`pro-message ${message.type}`}>
          {message.deletedForEveryoneAt ? <p className="pro-message-deleted">This message was deleted</p> : <>
            {message.payload?.forwarded && <small className="pro-forwarded-label"><Forward size={11} /> Forwarded</small>}
            {message.payload?.replyToMessageId && <button className="pro-reply-quote" onClick={() => messageRefs.current[message.payload.replyToMessageId]?.scrollIntoView({ behavior: "smooth", block: "center" })}><strong>Reply · tap to view</strong><span>{reply?.body || message.payload?.replyQuote || "Original message"}</span></button>}
            {message.type === "date" && <div className="pro-message-date"><CalendarDays size={19} /><span><small>DATE PROPOSAL</small><strong>{message.payload?.venue || message.body}</strong><em>{message.payload?.date} · {message.payload?.time}</em></span></div>}
            {message.type === "image" && message.payload?.url && <img src={message.payload.url} alt={message.body} />}
            {message.type === "location" && <div className="pro-message-location"><MapPin /><span><strong>Live location</strong><small>Shared securely</small></span></div>}
            {message.type === "voice" && <VoiceMessage message={message} />}
            {message.type === "gif" && <div className="pro-message-gif" role="img" aria-label={`${message.payload?.gif?.title || message.body} animated GIF`}><span>{message.payload?.gif?.previewEmoji || "✨"}</span><strong>{message.payload?.gif?.title || message.body}</strong><small>{message.payload?.gif?.style || "Animated reaction"}</small></div>}
            {message.type === "sticker" && <div className={`pro-message-sticker motion-${message.payload?.sticker?.motion || "bounce"}`} role="img" aria-label={`${message.payload?.sticker?.label || message.body} sticker`}><span>{message.payload?.sticker?.emoji || "✨"}</span><strong>{message.payload?.sticker?.label || message.body}</strong><small>{message.payload?.sticker?.caption}</small></div>}
            {message.type === "game" && <div className="pro-message-game"><small>COUPLE GAME · {message.payload?.gameTag}</small><strong>{message.payload?.gameTitle}</strong><p>{message.payload?.prompt || message.body}</p><button onClick={() => setReplyTo(message)}>Reply inside this card</button></div>}
            {!["date", "image", "location", "voice", "gif", "sticker", "game"].includes(message.type) && <p className={message.type === "text" && /^\p{Extended_Pictographic}+$/u.test(String(message.body || "")) ? `pro-single-emoji motion-${classifyEmojiMotion(message.body)}` : ""}>{message.body}</p>}
            {message.type === "text" && <RichLinkCard body={message.body} serverSafety={message.payload?.linkSafety} />}
          </>}
          <div className="pro-message-meta">{message.editedAt && <small>edited</small>}{pinnedIds.some((id) => String(id) === String(message.id)) && <Pin size={9} />}<time dateTime={new Date(message.createdAt).toISOString()}>{formatMessageTime(message.createdAt)}</time>{mine && <Receipt status={message.status} />}</div>
          {!message.deletedForEveryoneAt && <div className="pro-message-tools"><button title="Reply" aria-label="Reply" onClick={() => setReplyTo(message)}>↩</button><button title="Pin" aria-label="Pin message" onClick={() => togglePin(message)}><Pin size={13} /></button><button title="Forward" aria-label="Forward message" onClick={() => { setForwardMessage(message); setForwardRecipients([]); setPanel("forward"); }}><Forward size={13} /></button>{mine && message.type === "text" && <button title="Edit" aria-label="Edit message" onClick={() => { setEditingMessage(message); setEditDraft(message.body); }}><Edit3 size={13} /></button>}{mine && <button title="Delete" aria-label="Delete for everyone" onClick={() => requestDelete(message)}><Trash2 size={13} /></button>}</div>}
        </div></div>;
      })}{partnerTyping && <div className="pro-chat-typing"><span>{person.initial}</span><div><i /><i /><i /></div><small>{person.name} is typing</small></div>}</div>
      {attachments && <div className="pro-chat-attachments"><button onClick={() => fileInput.current?.click()}><ImageIcon />Photo</button><button onClick={() => { setGifOpen(true); setGifTab("all"); setAttachments(false); }}><ImageIcon />GIF & stickers</button><button onClick={() => { setGamesOpen(true); setAttachments(false); }}><Gamepad2 />Games</button><button onClick={shareLocation}><MapPin />Location</button><button onClick={() => setPanel("date")}><CalendarDays />Date plan</button><button onClick={() => send("Relationship values.pdf", { type: "document", payload: { name: "Relationship values.pdf" } })}><FileText />Document</button></div>}
      {gifOpen && <ChatMediaPicker tab={gifTab} query={gifQuery} library={gifLibrary} onTab={setGifTab} onQuery={setGifQuery} onClose={() => setGifOpen(false)} onSelectGif={selectGif} onToggleFavourite={toggleGifFavourite} onSelectSticker={selectSticker} />}
      {emojiOpen && <div className="pro-chat-emojis">{["❤️", "😊", "😂", "😍", "🙏", "✨", "🌹", "☕", "💍", "🥰"].map((emoji) => <button aria-label={`Send ${emoji}`} key={emoji} onClick={() => send(emoji)}>{emoji}</button>)}</div>}
      {replyTo && <div className="pro-composer-context"><span><strong>Replying to {replyTo.senderId === currentUserId ? "your message" : person.name}</strong><small>{replyTo.body}</small></span><button onClick={() => setReplyTo(null)} aria-label="Cancel reply"><X size={16} /></button></div>}
      {editingMessage && <div className="pro-inline-edit"><input aria-label="Edit message" value={editDraft} onChange={(event) => setEditDraft(event.target.value)} maxLength={2000} autoFocus /><button onClick={() => { setEditingMessage(null); setEditDraft(""); }}>Cancel</button><button className="save" disabled={!editDraft.trim()} onClick={saveEdit}>Save edit</button></div>}
      <input ref={fileInput} hidden type="file" accept="image/*" onChange={selectPhoto} />
      <ChatComposer onSend={send} onTyping={realtime.emitTyping} onAttach={() => { setAttachments((value) => !value); setEmojiOpen(false); setGifOpen(false); }} onEmoji={() => { setEmojiOpen((value) => !value); setAttachments(false); setGifOpen(false); }} onVoice={voiceNote} recording={recording} online={online} />
    </section>
    {panel && <div className="pro-chat-overlay" onMouseDown={(event) => event.target === event.currentTarget && setPanel(null)}>{panel === "date" ? <DateDialog onClose={() => setPanel(null)} onSend={sendDate} /> : panel === "forward" ? <div className="pro-chat-modal pro-forward-modal" role="dialog" aria-modal="true" aria-label="Forward message"><button className="pro-chat-modal-close" onClick={() => setPanel(null)}><X /></button><div className="pro-chat-modal-icon"><Forward /></div><p className="eyebrow">FORWARD PRIVATELY</p><h2>Choose conversations.</h2><p>Select one or more verified conversations. Deleted messages cannot be forwarded.</p><div className="pro-forward-recipients">{people.filter((item) => item.id !== activeId).map((item) => <label key={item.id}><input type="checkbox" checked={forwardRecipients.includes(item.id)} onChange={() => setForwardRecipients((current) => current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id])} /><span className="pro-chat-person-avatar">{item.initial}</span><span><strong>{item.name}</strong><small>Verified conversation</small></span></label>)}</div><button className="primary-button" disabled={!forwardRecipients.length} onClick={forwardSelected}>Forward to {forwardRecipients.length || "selected"}</button></div> : <div className="pro-chat-modal pro-settings-modal" role="dialog" aria-modal="true" aria-label="Chat settings"><button className="pro-chat-modal-close" onClick={() => setPanel(null)}><X /></button><div className="pro-chat-modal-icon"><Settings /></div><p className="eyebrow">CHAT SETTINGS</p><h2>Make this conversation yours.</h2><label>Custom name for {person.name}<input value={nicknameDraft} onChange={(event) => setNicknameDraft(event.target.value)} placeholder="e.g. Sunshine" maxLength={32} /></label><small>Only you see this nickname. The other person’s real identity stays unchanged.</small><div className="pro-preference-switches"><button className={activePreference.pinned ? "active" : ""} onClick={() => saveConversationPreference({ pinned: !activePreference.pinned })}><Pin size={15} /> {activePreference.pinned ? "Pinned" : "Pin conversation"}</button><button className={activePreference.archived ? "active" : ""} onClick={() => saveConversationPreference({ archived: !activePreference.archived })}><Archive size={15} /> {activePreference.archived ? "Archived" : "Archive"}</button></div><label>Notifications<select value={activePreference.notificationMode} onChange={(event) => saveConversationPreference({ notificationMode: event.target.value, mutedUntil: event.target.value === "muted" ? activePreference.mutedUntil : null })}><option value="all">All messages</option><option value="mentions">Important only</option><option value="muted">Muted</option></select></label>{activePreference.notificationMode === "muted" && <div className="pro-mute-durations">{[["1 hour", 3600000], ["8 hours", 28800000], ["1 week", 604800000], ["Always", null]].map(([label, duration]) => <button key={label} onClick={() => saveConversationPreference({ notificationMode: "muted", mutedUntil: duration ? new Date(Date.now() + duration).toISOString() : null })}>{label}</button>)}</div>}<label>Notification sound<select value={activePreference.notificationSound} onChange={(event) => saveConversationPreference({ notificationSound: event.target.value })}>{["Destiny Chime", "Soft Rose", "Classic", "Silent"].map((sound) => <option key={sound}>{sound}</option>)}</select></label><button className="primary-button" onClick={saveNickname}>Save chat settings</button></div>}</div>}
    {incomingCall && !callMode && <div className="pro-incoming-call" role="alert"><span className="pro-chat-person-avatar">{person.initial}</span><div><strong>Incoming {incomingCall.mode || "audio"} call</strong><small>{person.name} · Mutual match</small></div><button className="decline" onClick={() => { realtime.emitCall("reject", { clientCallId: incomingCall.clientCallId }); setIncomingCall(null); }}>Decline</button><button className="accept" onClick={() => { setIncomingCallId(incomingCall.clientCallId); setCallMode(incomingCall.mode || "audio"); setIncomingCall(null); }}>Accept</button></div>}
    {callMode && <div className="pro-chat-overlay"><CallDialog person={person} mode={callMode} incomingCallId={incomingCallId} callEvent={lastCallEvent} onClose={() => { setCallMode(null); setIncomingCallId(null); }} emitCall={realtime.emitCall} /></div>}
    {gamesOpen && <div className="pro-chat-overlay" onMouseDown={(event) => event.target === event.currentTarget && setGamesOpen(false)}><CoupleGamesPanel onClose={() => setGamesOpen(false)} onSend={sendGame} /></div>}
    <div className="pro-chat-connection">{online ? <Wifi size={14} /> : <WifiOff size={14} />}{online ? "Connected" : "Offline"}</div>
  </div>;
}
