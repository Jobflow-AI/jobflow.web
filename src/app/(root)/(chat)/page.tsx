"use client"
import React from 'react';
import Navbar from './_components/Navbar';
import HeroSection from './_components/heroSection';
import FeatureSection from './_components/featureSection';
import Sidebar from './_components/sidebar';
import ChatLayout from './layout';
import { useAppSelector } from '@/redux/hooks';

export default function LandingPage() {
  const user = useAppSelector(state => state.user.user); // Use selector to get user
  const isLoggedIn = !!user; // Determine if user is logged in

  return (
    <div className="min-h-screen overflow-auto">
      {/* Hero Section with Sidebar */}
      <HeroSection isLoggedIn={isLoggedIn} />

      {/* Feature Section - Only for logged-out users */}
      {!isLoggedIn && <FeatureSection />}
    </div>
  );
}