"use client";

import { useState } from 'react';
import Image from 'next/image';
import jsPDF from 'jspdf';

export default function ContentArea({ isGenerating, story, currentPage, onPageChange }) {
    const [showPdfModal, setShowPdfModal] = useState(false);
    
    const storyPages = story ? story.pages : [];

    const handleNext = () => {
        if (currentPage < storyPages.length - 1) {
            onPageChange(currentPage + 1);
        } else {
            setShowPdfModal(true);
        }
    };

    const handlePrev = () => {
        if (currentPage > 0) {
            onPageChange(currentPage - 1);
        }
    };

    const generatePDF = async () => {
        const doc = new jsPDF();
        
        for (let i = 0; i < storyPages.length; i++) {
            const page = storyPages[i];
            if (i > 0) doc.addPage();
            
            try {
                // Combine image and text into a single image using Canvas to handle Korean text
                const pageImageData = await createPageImage(page.image, page.text);
                
                if (pageImageData) {
                    const imgProps = doc.getImageProperties(pageImageData);
                    const pdfWidth = doc.internal.pageSize.getWidth();
                    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                    
                    doc.addImage(pageImageData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                }
            } catch (e) {
                console.error("Error adding page to PDF", e);
            }
        }
        
        doc.save(`${story.title || 'fairy-tale'}.pdf`);
        setShowPdfModal(false);
    };

    const createPageImage = (imageUrl, text) => {
        return new Promise((resolve, reject) => {
            const img = new window.Image();
            img.crossOrigin = "Anonymous";
            // Use a fallback image if URL is missing or invalid
            img.src = imageUrl || "/image.png"; 
            
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                
                // Set canvas size (High resolution for quality)
                const width = 1024;
                const imageHeight = 1024; 
                const textPadding = 40;
                const fontSize = 40;
                const lineHeight = 60;
                
                // Prepare Text for Wrapping
                // Use system fonts that support Korean
                ctx.font = `bold ${fontSize}px "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`; 
                const words = text ? text.split(' ') : [];
                let line = '';
                const lines = [];
                
                for(let n = 0; n < words.length; n++) {
                    const testLine = line + words[n] + ' ';
                    const metrics = ctx.measureText(testLine);
                    const testWidth = metrics.width;
                    if (testWidth > width - (textPadding * 3) && n > 0) {
                        lines.push(line);
                        line = words[n] + ' ';
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line);
                
                // Calculate Canvas Height based on text content
                const textBlockHeight = (lines.length * lineHeight) + (textPadding * 3);
                canvas.width = width;
                canvas.height = imageHeight + textBlockHeight; 
                
                // 1. Fill White Background
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // 2. Draw Image
                ctx.drawImage(img, 0, 0, width, imageHeight);
                
                // 3. Draw Text
                ctx.fillStyle = '#5c4b51'; // Dark text color matching theme
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                // Reset font to ensure it's applied
                ctx.font = `bold ${fontSize}px "Malgun Gothic", "Apple SD Gothic Neo", sans-serif`; 

                lines.forEach((line, index) => {
                   ctx.fillText(line, width / 2, imageHeight + textPadding + (index * lineHeight) + 20); 
                });
                
                resolve(canvas.toDataURL("image/jpeg", 0.8));
            };
            
            img.onerror = (e) => {
                console.error("Image load error", e);
                resolve(null);
            };
        });
    };

    if (isGenerating) {
        return (
            <div style={{
                flex: 1,
                minHeight: 0,
                backgroundColor: '#FFF0F5',
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                border: '4px solid white',
                color: '#FF9AA2',
                fontSize: '1.8rem',
                fontWeight: 'bold',
                gap: '20px',
                overflow: 'hidden',
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

    if (!story || storyPages.length === 0) {
        return (
            <div style={{
                flex: 1,
                minHeight: 0,
                backgroundColor: '#FFF0F5',
                borderRadius: '20px',
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                border: '4px solid white',
                color: '#5D5C61',
                fontSize: '1.3rem',
                overflow: 'hidden',
            }}>
                <p>카드를 배치하여 이야기를 만들어보세요!</p>
            </div>
        );
    }

    const isLastPage = currentPage === storyPages.length - 1;

    return (
        <div style={{
            flex: 1,
            minHeight: 0,
            backgroundColor: '#FFF0F5',
            borderRadius: '20px',
            padding: '20px',
            display: 'flex',
            gap: '20px',
            alignItems: 'stretch',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            border: '4px solid white',
            position: 'relative',
            overflow: 'hidden',
            boxSizing: 'border-box',
        }}>
            {/* PDF Modal */}
            {showPdfModal && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000,
                    borderRadius: '20px'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '20px',
                        textAlign: 'center',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}>
                        <h3 style={{ marginBottom: '20px', color: '#5D5C61' }}>동화를 PDF로 저장할까요?</h3>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button 
                                onClick={generatePDF}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#FFB7B2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                다운로드
                            </button>
                            <button 
                                onClick={() => setShowPdfModal(false)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#E0E0E0',
                                    color: '#5D5C61',
                                    border: 'none',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 1:1 비율 이미지 컨테이너 */}
            <div style={{
                aspectRatio: '1 / 1',
                height: '100%',
                flexShrink: 0,
                position: 'relative',
                borderRadius: '15px',
                overflow: 'hidden',
                border: '3px solid #FFB7B2',
            }}>
                <Image
                    src={storyPages[currentPage].image || "/image.png"}
                    alt="Story Image"
                    fill
                    style={{ objectFit: 'cover' }}
                />
            </div>
            <div style={{
                flex: 1,
                minWidth: 0,
                fontSize: '1.1rem',
                lineHeight: '1.6',
                color: '#5D5C61',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                overflow: 'hidden',
            }}>
                <div>
{/* Title removed as per user request */}
                    <p style={{ whiteSpace: 'pre-line' }}>
                        {storyPages[currentPage].text}
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '15px',
                    marginTop: '20px',
                    position: 'relative' // For bubble positioning
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
                    
                    <div style={{ position: 'relative' }}>
                        {isLastPage && (
                           <div style={{
                               position: 'absolute',
                               bottom: '100%',
                               right: '0',
                               backgroundColor: '#FF9AA2',
                               color: 'white',
                               padding: '5px 10px',
                               borderRadius: '10px',
                               marginBottom: '10px',
                               whiteSpace: 'nowrap',
                               fontSize: '0.8rem',
                               fontWeight: 'bold',
                               boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                               animation: 'bounce 1s infinite'
                           }}>
                               PDF로 내보내기
                               <div style={{
                                   position: 'absolute',
                                   top: '100%',
                                   right: '20px',
                                   borderWidth: '5px',
                                   borderStyle: 'solid',
                                   borderColor: '#FF9AA2 transparent transparent transparent'
                               }}></div>
                               <style jsx>{`
                                   @keyframes bounce {
                                     0%, 100% { transform: translateY(0); }
                                     50% { transform: translateY(-5px); }
                                   }
                               `}</style>
                           </div> 
                        )}
                        <button
                            onClick={handleNext}
                            // disabled={currentPage === storyPages.length - 1} // Disabled condition removed
                            style={{
                                padding: '10px 20px',
                                border: 'none',
                                borderRadius: '50px',
                                backgroundColor: isLastPage ? '#FFB7B2' : '#FF9AA2', // Keep active color on last page
                                color: 'white',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                transition: 'transform 0.1s'
                            }}
                        >
                            {isLastPage ? '💾' : '▶'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
