"use client";

import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import Image from 'next/image';

export default function CardArea({ scene, onUpdateScene, onGeneratePage }) {
    const [items, setItems] = useState([]);

    useEffect(() => {
        if (!scene) {
            setItems([]);
            return;
        }

        if (scene.type === 'background') {
            setItems([]);
            return;
        }

        // Construct items based on isSwapped state
        const subjectCard = {
            id: 'subject',
            title: scene.defaultSubject,
            type: '주어 (Subject)',
            isDraggable: true
        };

        const objectCard = {
            id: 'object',
            title: scene.defaultObject,
            type: '목적어 (Object)',
            isDraggable: true
        };

        const verbCard = {
            id: 'verb',
            title: scene.selectedVerb,
            type: '서술어 (Verb)',
            isVerb: true,
            verbOptions: scene.verbOptions,
            isDraggable: true
        };

        // Order based on isSwapped
        // Korean default: Subject Object Verb
        // Swapped: Object Subject Verb
        let newItems = [];
        if (scene.isSwapped) {
            newItems = [objectCard, subjectCard, verbCard];
        } else {
            newItems = [subjectCard, objectCard, verbCard];
        }

        setItems(newItems);

    }, [scene]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            // Calculate new order
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);
            const newItems = arrayMove(items, oldIndex, newIndex);

            // Determine isSwapped based on relative positions of subject and object
            const subjectIndex = newItems.findIndex(item => item.id === 'subject');
            const objectIndex = newItems.findIndex(item => item.id === 'object');
            
            // If object is before subject, it's swapped.
            // Note: If one of them is missing (shouldn't happen), default to false
            const newIsSwapped = objectIndex < subjectIndex;

            if (scene.isSwapped !== newIsSwapped) {
                onUpdateScene({ ...scene, isSwapped: newIsSwapped });
            } else {
                 // Even if swap state didn't change (e.g. moved Verb), 
                 // we might want to update local items to reflect the drag 
                 // but strictly the app logic depends on S/O order.
                 // For now, we only update scene if S/O order changes. 
                 // If the user moved Verb, it will snap back on re-render.
                 // Refined: Let's trigger update only on meaningful change.
                 // But wait, if I drag Verb to start, items reorder. 
                 // If I don't update scene, it snaps back. 
                 // User might want to construct "Verb Subject Object" just for fun?
                 // But our logic only supports S/O swap.
                 // So snapping back is acceptable or I should allow cosmetic reordering.
                 // Given the prompt "Regenerate modified text", 
                 // I'll stick to S/O swap logic specifically.
                 // So yes, only update if S/O relative order changes.
            }
        }
    }

    const handleVerbChange = (verb) => {
        onUpdateScene({ ...scene, selectedVerb: verb });
    };

    if (!scene) {
        return <div style={{ height: '200px', flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading...</div>;
    }

    if (scene.type === 'background') {
        return (
             <div style={{
                flex: 1,
                minHeight: 0,
                backgroundColor: '#E2F0CB',
                borderRadius: '20px',
                padding: '12px 20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '4px solid white',
                color: '#5c4b51',
                fontSize: '1.1rem',
                flexDirection: 'column',
                gap: '6px'
            }}>
                <p>배경 장면입니다.</p>
                <p style={{fontSize: '0.85rem', color: '#888'}}>문장 요소를 수정할 수 없습니다.</p>
            </div>
        );
    }

    return (
        <div style={{
            flex: 1,
            minHeight: 0,
            backgroundColor: '#E2F0CB',
            borderRadius: '20px',
            padding: '10px 16px',
            border: '4px solid white',
            boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.05)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflow: 'hidden',
            boxSizing: 'border-box',
        }}>
            {/* 카드 영역 */}
            <div style={{
                flex: 1,
                minHeight: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflowX: 'auto',
                overflowY: 'hidden',
                padding: '8px 0',
            }}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={items.map(item => item.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
                        {items.map((item, index) => {
                            const positionLabels = ['주어 (Subject)', '목적어 (Object)', '서술어 (Verb)'];
                            const displayLabel = positionLabels[index] ?? item.type;
                            return (
                            <SortableItem key={item.id} id={item.id} height="160px">
                                <div style={{
                                    width: '170px',
                                    height: '160px',
                                    backgroundColor: 'white',
                                    borderRadius: '14px',
                                    border: `3px solid ${item.isVerb ? '#FFB7B2' : '#B5EAD7'}`,
                                    padding: '10px',
                                    cursor: 'grab',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '8px',
                                    position: 'relative',
                                    boxSizing: 'border-box',
                                }}>
                                    <div style={{
                                        width: '100%',
                                        padding: '3px',
                                        backgroundColor: '#f0f0f0',
                                        borderRadius: '6px',
                                        textAlign: 'center',
                                        fontSize: '0.75rem',
                                        color: '#888',
                                        fontWeight: 'bold'
                                    }}>
                                        {displayLabel}
                                    </div>

                                    {item.isVerb ? (
                                        <>
                                            <div style={{
                                                fontSize: '1.2rem', 
                                                fontWeight: 'bold', 
                                                color: '#5c4b51',
                                                flex: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {item.title}
                                            </div>
                                            <select 
                                                value={item.title}
                                                onChange={(e) => handleVerbChange(e.target.value)}
                                                onPointerDown={(e) => e.stopPropagation()} 
                                                style={{
                                                    width: '100%',
                                                    padding: '4px 6px',
                                                    borderRadius: '8px',
                                                    border: '2px solid #ddd',
                                                    fontSize: '0.85rem',
                                                    marginTop: 'auto'
                                                }}
                                            >
                                                {item.verbOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    ) : (
                                        <div style={{
                                            fontSize: '1.2rem', 
                                            fontWeight: 'bold', 
                                            color: '#5c4b51',
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            textAlign: 'center'
                                        }}>
                                            {item.title}
                                        </div>
                                    )}
                                </div>
                            </SortableItem>
                        ); })}
                        </div>
                    </SortableContext>
                </DndContext>
            </div>

            {/* 생성 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                    onClick={() => onGeneratePage(scene)}
                    style={{
                        padding: '8px 28px',
                        border: 'none',
                        borderRadius: '50px',
                        backgroundColor: '#FF9AA2',
                        color: 'white',
                        fontSize: '0.95rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 4px 10px rgba(255,154,162,0.5)',
                        transition: 'transform 0.15s, box-shadow 0.15s',
                        letterSpacing: '0.03em',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 14px rgba(255,154,162,0.6)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 10px rgba(255,154,162,0.5)';
                    }}
                >
                    ✨ 이 장면 생성하기
                </button>
            </div>
        </div>
    );
}
