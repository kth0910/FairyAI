"use client";

import React, { useState } from 'react';
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

export default function CardArea({ onReorder }) {
    const [items, setItems] = useState([
        { id: 'card-1', title: '〈폭우 속 개울〉' },
        { id: 'card-2', title: '〈위험에 빠진 친구〉' },
        { id: 'card-3', title: '〈떨리는 발걸음〉' },
        { id: 'card-4', title: '〈친구를 구하는 몽실〉' },
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event) {
        const { active, over } = event;

        if (active.id !== over.id) {
            if (onReorder) onReorder();
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    return (
        <div style={{
            height: '280px',
            backgroundColor: '#E2F0CB', // Pale green
            borderRadius: '20px',
            marginTop: '20px',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '20px',
            border: '4px solid white',
            boxShadow: 'inset 0 4px 8px rgba(0,0,0,0.05)'
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
                    {items.map((item) => (
                        <SortableItem key={item.id} id={item.id}>
                            <div style={{
                                width: '160px',
                                height: '220px',
                                backgroundColor: 'white',
                                borderRadius: '15px',
                                border: '2px solid #B5EAD7',
                                padding: '10px',
                                cursor: 'grab',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '10px'
                            }}>
                                <div style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '120px',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    border: '2px solid #E2F0CB'
                                }}>
                                    <Image
                                        src="/image.png"
                                        alt="Card Thumbnail"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        draggable={false}
                                    />
                                </div>
                                <p style={{
                                    textAlign: 'center',
                                    fontWeight: 'bold',
                                    color: '#5c4b51',
                                    fontSize: '0.9rem',
                                    wordBreak: 'keep-all',
                                    lineHeight: '1.2'
                                }}>{item.title}</p>
                            </div>
                        </SortableItem>
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
}
