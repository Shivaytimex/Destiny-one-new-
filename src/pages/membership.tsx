import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import AppShell from "../components/layout/AppShell";
import { frontendRepository } from "../data/frontendRepository";

const defaults = [
  { id: "essential", name: "Essential", price: 45, features: ["Thoughtful daily introductions", "Serious intent filters", "Verified profiles"] },
  { id: "select", name: "Select", price: 79, features: ["Priority matching", "Private profile controls", "Date planning tools"] },
  { id: "executive", name: "Executive Circle", price: 149, features: ["Handpicked introductions", "Private profile mode", "Priority support"] },
];
export default function MembershipPage() {
  const [plans, setPlans] = useState(defaults); const [notice, setNotice] = useState("");
  useEffect(() => { frontendRepository.membership.listPlans().then(items=>items.length&&setPlans(items)); }, []);
  async function choose(planId) { const result=await frontendRepository.membership.selectPlan(planId);setNotice(result.message); }
  return <AppShell title="Choose your pace" eyebrow="DestinyOne membership"><div className="content-stack">{notice && <section className="panel" role="status">{notice}</section>}<div className="grid-3">{plans.map((plan, index) => <article className="tool-card" key={plan.id}><span className="pill">{index === 1 ? "Most popular" : "Monthly"}</span><h2>{plan.name}</h2><div className="price">${plan.price}<small>/mo</small></div>{plan.features.map((feature) => <p key={feature}><Check size={16} /> {feature}</p>)}<button onClick={() => choose(plan.id)} className={index === 1 ? "primary-button full-button" : "secondary-button full-button"}>Choose {plan.name}</button></article>)}</div><p className="helper-text">Preview checkout does not charge. Production billing credentials and store approval must be connected before launch.</p></div></AppShell>;
}
