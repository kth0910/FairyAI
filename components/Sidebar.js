"use client";

import Image from 'next/image';
import { stories } from '../data/stories';

export default function Sidebar({ onSelectStory }) {
    
    return (
        <aside style={{
            width: '260px',
            backgroundColor: '#FFE8D6', // Soft peach/orange
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            borderRight: '4px solid #F7C5A8',
            height: '100vh',
            overflowY: 'auto'
        }}>
            {stories.map((story) => (
                <div key={story.id} 
                    onClick={() => onSelectStory(story)}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        padding: '10px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        height: '120px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        border: '2px solid #FFD3B6'
                    }}>
                        <Image
                            src={story.thumbnail}
                            alt={story.title}
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'top' }}
                        />
                    </div>
                    <p style={{
                        textAlign: 'center',
                        marginTop: '8px',
                        fontWeight: 'bold',
                        color: '#FF6B6B'
                    }}>{story.title}</p>
                </div>
            ))}
        </aside>
    );
}
