import Head from "next/head";
import AppShell from "../components/layout/AppShell";
import SuccessStories from "../components/home/SuccessStories";
import IntentPassportCard from "../components/home/IntentPassportCard";
import HomeDashboard from "../components/home/HomeDashboard";

export default function HomePage(){return <><Head><title>DestinyOne · Date to marry</title><meta name="description" content="Thoughtful, verified introductions for people dating with marriage in mind."/></Head><AppShell title="Good evening, Shivay 👋" eyebrow="Thoughtful connections · Meaningful futures"><div className="content-stack destiny-home"><HomeDashboard/><IntentPassportCard/><SuccessStories/></div></AppShell></>}
