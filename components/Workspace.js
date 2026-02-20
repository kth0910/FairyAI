"use client";

import { useState, useEffect } from 'react';
import ContentArea from './ContentArea';
import CardArea from './CardArea';

export default function Workspace({ story }) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedStory, setGeneratedStory] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [scenes, setScenes] = useState([]);

    const handleGenerate = async (currentScenes) => {
        setIsGenerating(true);
        
        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scenes: currentScenes }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate story');
            }

            const data = await response.json();
            setGeneratedStory(data);
        } catch (error) {
            console.error("Error generating story:", error);
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleUpdatePage = async (updatedScene, referenceImagePath = null) => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/update-page', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ scene: updatedScene, referenceImagePath }),
            });

            if (!response.ok) {
                throw new Error('Failed to update scene');
            }

            const data = await response.json();

            setGeneratedStory(prev => {
                if (!prev || !prev.pages) return prev;
                
                const newPages = [...prev.pages];
                // Find the index of the updated scene
                const sceneIndex = scenes.findIndex(s => s.id === updatedScene.id);
                
                if (sceneIndex !== -1) {
                    newPages[sceneIndex] = {
                        ...newPages[sceneIndex],
                        text: data.page.text,
                        image: data.page.image
                        // Not overwriting title if not returned, or explicitly updating it
                    };
                }
                return { ...prev, pages: newPages };
            });

        } catch (error) {
            console.error("Error updating scene:", error);
        } finally {
            setIsGenerating(false);
        }
    };
    
    // Initial load — build from default data, no API call
    useEffect(() => {
        if (story) {
            const initialScenes = story.scenes.map(scene => ({
                ...scene,
                selectedVerb: scene.defaultVerb,
                isSwapped: false
            }));
            setScenes(initialScenes);
            setCurrentPage(0);

            // Build default pages from static data in stories.js
            const defaultPages = story.scenes.map(scene => ({
                title: scene.title,
                text: scene.originalText || scene.defaultText || '',
                image: scene.defaultImage || '/image.png'
            }));
            setGeneratedStory({ pages: defaultPages });
        }
    }, [story]);

    const handleSceneUpdate = (updatedScene) => {
        // 로컬 scenes 상태만 업데이트 (API 호출 없음)
        const newScenes = scenes.map(scene => 
            scene.id === updatedScene.id ? updatedScene : scene
        );
        setScenes(newScenes);
    };

    const handleGeneratePage = (sceneToGenerate) => {
        // 생성 버튼 클릭 시에만 API 호출
        // 레퍼런스 이미지: 각 동화의 첫 번째 장면(배경 이미지)
        const referenceImagePath = story?.scenes?.[0]?.defaultImage || null;
        handleUpdatePage(sceneToGenerate, referenceImagePath);
    };

    return (
        <main style={{
            flex: 1,
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            overflow: 'hidden',
            boxSizing: 'border-box',
            backgroundColor: '#FFDAC1',
            gap: '12px',
        }}>
            <div style={{ flex: 6, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <ContentArea 
                    isGenerating={isGenerating} 
                    story={generatedStory} 
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                />
            </div>
            <div style={{ flex: 4, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <CardArea 
                    scene={scenes[currentPage]} 
                    onUpdateScene={handleSceneUpdate} 
                    onGeneratePage={handleGeneratePage}
                />
            </div>
        </main>
    );
}
