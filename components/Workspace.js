"use client";

import { useState } from 'react';
import ContentArea from './ContentArea';
import CardArea from './CardArea';

export default function Workspace() {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleReorder = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
        }, 2000);
    };

    return (
        <main style={{
            flex: 1,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: '#FFDAC1' // Soft peach background for main area
        }}>
            <ContentArea isGenerating={isGenerating} />
            <CardArea onReorder={handleReorder} />
        </main>
    );
}
