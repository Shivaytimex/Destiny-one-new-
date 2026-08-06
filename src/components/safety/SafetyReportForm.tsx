import { useState } from "react";
import { frontendRepository } from "../../data/frontendRepository";

export default function SafetyReportForm() {
  const [reason, setReason] = useState("Inappropriate behaviour"); const [details, setDetails] = useState(""); const [status, setStatus] = useState("");
  async function submit(event) { event.preventDefault(); await frontendRepository.safety.saveReport({ reason, details }); setStatus("Report captured in this frontend preview. Production moderation will be connected later."); setDetails(""); }
  return <form className="form-card" onSubmit={submit}><h3>Private safety report</h3><div className="field"><label htmlFor="reason">Reason</label><select id="reason" value={reason} onChange={(event) => setReason(event.target.value)}><option>Inappropriate behaviour</option><option>Spam or scam</option><option>False identity</option><option>Safety concern</option></select></div><div className="field"><label htmlFor="details">Details</label><textarea id="details" value={details} onChange={(event) => setDetails(event.target.value)} maxLength={2000} /></div><button className="primary-button" type="submit">Submit privately</button>{status && <p role="status" className="helper-text">{status}</p>}</form>;
}
