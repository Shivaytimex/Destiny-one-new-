import { ArrowLeft, RefreshCw, Send, X } from "lucide-react";
import { useMemo, useState } from "react";
import { coupleGames, type CoupleGame } from "../../data/coupleGames";

type Props = { onClose: () => void; onSend: (game: CoupleGame, prompt: string) => void };

export default function CoupleGamesPanel({ onClose, onSend }: Props) {
  const [gameId, setGameId] = useState<string | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [customPrompt, setCustomPrompt] = useState("");
  const game = useMemo(() => coupleGames.find((item) => item.id === gameId) || null, [gameId]);
  const prompt = game?.prompts[promptIndex % game.prompts.length] || "";

  function choose(next: CoupleGame) { setGameId(next.id); setPromptIndex(0); setCustomPrompt(""); }
  function nextPrompt() { if (game) setPromptIndex((value) => (value + 1) % game.prompts.length); }
  function send() { if (game) onSend(game, customPrompt.trim() || prompt); }

  return <div className="pro-chat-modal pro-games-modal" role="dialog" aria-modal="true" aria-label="Couple games">
    <button className="pro-chat-modal-close" onClick={onClose} aria-label="Close couple games"><X /></button>
    {game ? <>
      <button className="pro-games-back" onClick={() => setGameId(null)}><ArrowLeft size={15} /> All games</button>
      <p className="eyebrow">{game.tag}</p><h2>{game.title}</h2><p>{game.description}</p>
      <div className="pro-game-how"><strong>How to play</strong><span>{game.howToPlay}</span></div>
      <div className="pro-game-prompt"><small>ROUND {promptIndex + 1} OF {game.prompts.length}</small><strong>{customPrompt.trim() || prompt}</strong></div>
      <label className="pro-game-custom">Custom prompt (optional)<textarea value={customPrompt} onChange={(event) => setCustomPrompt(event.target.value)} maxLength={280} placeholder="Write your own private prompt…" /></label>
      <div className="pro-game-actions"><button className="secondary-button" onClick={nextPrompt}><RefreshCw size={15} /> New prompt</button><button className="primary-button" disabled={!prompt && !customPrompt.trim()} onClick={send}><Send size={15} /> Send this round</button></div>
      <small>The card is sent inside this chat. The other person replies inside the same card.</small>
    </> : <>
      <p className="eyebrow">PLAY INSIDE CHAT</p><h2>Couple games</h2><p>Six private games for laughter, real conversation and future alignment.</p>
      <div className="pro-games-grid">{coupleGames.map((item) => <button key={item.id} onClick={() => choose(item)}><span>🎮</span><small>{item.tag}</small><strong>{item.title}</strong><em>{item.description}</em></button>)}</div>
    </>}
  </div>;
}

