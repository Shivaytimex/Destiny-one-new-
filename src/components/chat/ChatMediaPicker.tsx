import { Search, Star, X } from "lucide-react";
import {
  chatGifCatalog,
  customChatStickers,
  searchChatGifCatalog,
  type ChatGifCatalogItem,
  type CustomChatSticker,
} from "../../data/chatMediaCatalog";

type Library = { recents: ChatGifCatalogItem[]; favourites: ChatGifCatalogItem[] };
type Tab = "all" | "recent" | "favourites" | "stickers";

type Props = {
  tab: Tab;
  query: string;
  library: Library;
  onTab: (tab: Tab) => void;
  onQuery: (query: string) => void;
  onClose: () => void;
  onSelectGif: (gif: ChatGifCatalogItem) => void;
  onToggleFavourite: (gif: ChatGifCatalogItem) => void;
  onSelectSticker: (sticker: CustomChatSticker) => void;
};

export default function ChatMediaPicker({ tab, query, library, onTab, onQuery, onClose, onSelectGif, onToggleFavourite, onSelectSticker }: Props) {
  const gifs = tab === "recent"
    ? library.recents
    : tab === "favourites"
      ? library.favourites
      : searchChatGifCatalog(query);
  const filteredGifs = tab === "all" ? gifs : gifs.filter((gif) => !query.trim() || `${gif.title} ${gif.style || ""} ${gif.searchText || ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  const stickers = customChatStickers.filter((sticker) => !query.trim() || `${sticker.label} ${sticker.caption} ${sticker.tags}`.toLowerCase().includes(query.trim().toLowerCase()));

  return <div className="pro-gif-library" role="dialog" aria-label="GIF and sticker library">
    <div className="pro-gif-head"><div><strong>GIFs & stickers</strong><small>1,000 searchable GIF reactions plus original DestinyOne stickers.</small></div><button onClick={onClose} aria-label="Close media library"><X size={16} /></button></div>
    <div className="pro-gif-tabs" role="tablist">{([['all','GIFs'],['recent','Recents'],['favourites','Favourites'],['stickers','Stickers']] as const).map(([id,label]) => <button key={id} role="tab" aria-selected={tab === id} className={tab === id ? "active" : ""} onClick={() => onTab(id)}>{label}</button>)}</div>
    <label className="pro-gif-search"><Search size={14} /><input aria-label={`Search ${tab === "stickers" ? "stickers" : "GIFs"}`} value={query} onChange={(event) => onQuery(event.target.value)} placeholder="Search love, hug, morning, kiss…" /></label>
    {tab === "stickers" ? <div className="pro-sticker-grid">{stickers.map((sticker) => <button className={`pro-sticker-tile motion-${sticker.motion}`} key={sticker.id} onClick={() => onSelectSticker(sticker)}><span>{sticker.emoji}</span><strong>{sticker.label}</strong><small>{sticker.caption}</small></button>)}{!stickers.length && <p className="pro-gif-empty">No sticker matched that search.</p>}</div> : <div className="pro-gif-grid">{filteredGifs.slice(0, 120).map((gif) => {
      const favourite = library.favourites.some((item) => item.id === gif.id);
      return <div className="pro-gif-tile" key={gif.id}><button className="pro-gif-send" onClick={() => onSelectGif(gif)} aria-label={`Send ${gif.title} ${gif.style} GIF`}><span>{gif.previewEmoji || "✨"}</span><strong>{gif.title}</strong><small>{gif.style}</small></button><button className={`pro-gif-star ${favourite ? "active" : ""}`} onClick={() => onToggleFavourite(gif)} aria-label={`${favourite ? "Remove" : "Add"} ${gif.title} ${favourite ? "from" : "to"} favourites`}><Star size={13} /></button></div>;
    })}{!filteredGifs.length && <p className="pro-gif-empty">{tab === "all" ? "No GIF matched that search." : `Your ${tab} GIFs will appear here.`}</p>}</div>}
  </div>;
}

export { chatGifCatalog };
