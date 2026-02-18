"use client";

import { useState } from 'react';
import Image from 'next/image';

const storyPages = [
    {
        title: "옛날 옛적에...",
        text: "마법의 숲 속 깊은 곳에 그림 그리기를 좋아하는 작은 토끼가 살고 있었어요. 매일 산책을 하며 예쁜 꽃들을 찾아 멋진 그림을 그렸답니다."
    },
    {
        title: "갑작스러운 폭우",
        text: "어느 날, 갑자기 하늘이 어두워지더니 굵은 빗방울이 떨어지기 시작했어요. 숲속 친구들은 모두 깜짝 놀라 집으로 뛰어갔죠."
    },
    {
        title: "위험에 빠진 친구",
        text: "그때였어요! 개울가에서 다급한 목소리가 들려왔어요. 작은 다람쥐가 불어난 물에 고립되어 어쩔 줄 몰라하고 있었답니다."
    },
    {
        title: "용기 있는 행동",
        text: "토끼는 망설이지 않고 주변의 덩굴을 모아 다람쥐에게 던져주었어요. \"꽉 잡아! 내가 당겨줄게!\""
    }
];

export default function ContentArea({ isGenerating }) {
    const [currentPage, setCurrentPage] = useState(0);

    const handleNext = () => {
        if (currentPage < storyPages.length - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    if (isGenerating) {
        return (
            <div style={{
                flex: 1,
                backgroundColor: '#FFF0F5',
                borderRadius: '20px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                border: '4px solid white',
                color: '#FF9AA2',
                fontSize: '2rem',
                fontWeight: 'bold',
                gap: '20px',
            }}>
                <style jsx>{`
                    @keyframes pulseText {
                      0% { opacity: 0.5; }
                      50% { opacity: 1; }
                      100% { opacity: 0.5; }
                    }
                  `}</style>
                <p style={{ animation: 'pulseText 1.5s infinite ease-in-out' }}>이야기를 생성중이에요...</p>
            </div>
        );
    }

    return (
        <div style={{
            flex: 1,
            backgroundColor: '#FFF0F5', // Lavender blush
            borderRadius: '20px',
            padding: '30px',
            display: 'flex',
            gap: '30px',
            alignItems: 'center',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            border: '4px solid white',
            position: 'relative'
        }}>
            <div style={{
                flex: 1,
                height: '100%',
                minHeight: '300px',
                position: 'relative',
                borderRadius: '15px',
                overflow: 'hidden',
                border: '3px solid #FFB7B2'
            }}>
                <Image
                    src="/image.png"
                    alt="Story Image"
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </div>
            <div style={{
                flex: 1,
                fontSize: '1.2rem',
                lineHeight: '1.6',
                color: '#5D5C61',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%'
            }}>
                <div>
                    <h2 style={{
                        color: '#FF9AA2',
                        marginBottom: '15px',
                        fontSize: '2rem'
                    }}>{storyPages[currentPage].title}</h2>
                    <p style={{ whiteSpace: 'pre-line' }}>
                        {storyPages[currentPage].text}
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '15px',
                    marginTop: '20px'
                }}>
                    <button
                        onClick={handlePrev}
                        disabled={currentPage === 0}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '50px',
                            backgroundColor: currentPage === 0 ? '#E0E0E0' : '#FFB7B2',
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            boxShadow: currentPage === 0 ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'transform 0.1s'
                        }}
                    >
                        ◀
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={currentPage === storyPages.length - 1}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '50px',
                            backgroundColor: currentPage === storyPages.length - 1 ? '#E0E0E0' : '#FF9AA2',
                            color: 'white',
                            fontSize: '1.2rem',
                            cursor: currentPage === storyPages.length - 1 ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            boxShadow: currentPage === storyPages.length - 1 ? 'none' : '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'transform 0.1s'
                        }}
                    >
                        ▶
                    </button>
                </div>
            </div>
        </div>
    );
}
