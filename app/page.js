"use client";

import { useState } from 'react';
import styles from "./page.module.css";
import Sidebar from "../components/Sidebar";
import Workspace from "../components/Workspace";
import { stories } from '../data/stories';

export default function Home() {
  const [selectedStory, setSelectedStory] = useState(stories[0]);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar onSelectStory={setSelectedStory} />
      <Workspace story={selectedStory} />
    </div>
  );
}
