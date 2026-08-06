import Head from "next/head";
import AppShell from "../components/layout/AppShell";
import HeroSection from "../components/home/HeroSection";
import SearchForm from "../components/home/SearchForm";
import StatsSection from "../components/home/StatsSection";
import SuccessStories from "../components/home/SuccessStories";
import IntentPassportCard from "../components/home/IntentPassportCard";
import PremiumPlans from "../components/home/PremiumPlans";
import Testimonials from "../components/home/Testimonials";

export default function HomePage(){return <><Head><title>DestinyOne · Date to marry</title><meta name="description" content="Thoughtful, verified introductions for people dating with marriage in mind."/></Head><AppShell title="Where meaningful futures begin" eyebrow="DestinyOne"><div className="content-stack"><HeroSection/><SearchForm/><IntentPassportCard/><StatsSection/><SuccessStories/><PremiumPlans/><Testimonials/></div></AppShell></>}
