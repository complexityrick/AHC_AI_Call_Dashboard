'use client';

import React, { useState, useEffect } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    horizontalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    Phone,
    Calendar,
    User,
    FileText,
    AlertCircle,
    CheckCircle,
    MoreHorizontal,
    Star,
    Search,
    ExternalLink,
    MessageSquare,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

type Call = {
    id: string;
    createdAt: string;
    callerName: string;
    phoneNumber: string;
    callerType: string;
    callIntent: string;
    clinic: string;
    location: string;
    provider: string;
    urgency: string;
    transferDestination: string;
    followUpNeeded: boolean;
    actionsStatus: string;
    rating: number;
    notes: string;
    transcriptUrl: string;
    transcriptText?: string;
    addressed: boolean;
};


// Column Definitions
const initialColumns = [
    { id: 'createdAt', label: 'Time/Date', icon: Calendar },
    { id: 'callerName', label: 'Caller Name', icon: User },
    { id: 'phoneNumber', label: 'Phone Number', icon: Phone },
    { id: 'callerType', label: 'Type', icon: User },
    { id: 'callIntent', label: 'Call Summary', icon: FileText },
    { id: 'clinic', label: 'Clinic', icon: AlertCircle }, // Placeholder icon
    { id: 'location', label: 'Location', icon: AlertCircle },
    { id: 'provider', label: 'Provider', icon: User },
    { id: 'urgency', label: 'Urgency', icon: AlertCircle },
    { id: 'transferDestination', label: 'Transfer', icon: ExternalLink },
    { id: 'followUpNeeded', label: 'Follow Up Needed', icon: AlertCircle },
    { id: 'actionsStatus', label: 'Status', icon: CheckCircle },
    { id: 'transcript', label: 'Transcript', icon: FileText },
    { id: 'rating', label: 'Rating', icon: Star },
    { id: 'notes', label: 'Notes', icon: MessageSquare },
    { id: 'addressed', label: 'Addressed', icon: CheckCircle },
];

function SortableHeader({ id, label, icon: Icon }: { id: string, label: string, icon: any }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <th
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="px-2 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider cursor-move hover:bg-slate-700/50 transition-colors whitespace-nowrap"
        >
            <div className="flex items-center gap-2">
                <Icon size={14} />
                {label}
            </div>
        </th>
    );
}

function TranscriptModal({ isOpen, onClose, text }: { isOpen: boolean; onClose: () => void; text: string }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden"
                        >
                            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                    <FileText size={20} className="text-blue-400" />
                                    Full Transcript
                                </h3>
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto custom-scrollbar text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {text || "No transcript text available."}
                            </div>
                            <div className="p-4 border-t border-slate-700 bg-slate-800/30 flex justify-end">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default function DashboardTable() {
    const [calls, setCalls] = useState<Call[]>([]);
    const [columns, setColumns] = useState(initialColumns);
    const [search, setSearch] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [viewTranscriptCall, setViewTranscriptCall] = useState<Call | null>(null);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchCalls();
    }, [search]);

    const fetchCalls = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/calls?search=${search}`, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch');

            const data = await res.json();
            if (Array.isArray(data)) {
                setCalls(data);
            } else {
                setCalls([]);
            }
        } catch (error) {
            console.error('Failed to fetch calls', error);
            setCalls([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDragEnd = (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setColumns((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const updateCall = async (id: string, data: Partial<Call>) => {
        // Optimistic update
        setCalls(calls.map(c => c.id === id ? { ...c, ...data } : c));

        try {
            await fetch('/api/calls', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...data })
            });
        } catch (e) {
            console.error("Failed to update call", e);
            fetchCalls(); // Revert on error
        }
    }

    const handleCloseTranscript = () => {
        if (viewTranscriptCall && viewTranscriptCall.actionsStatus === 'Pending') {
            updateCall(viewTranscriptCall.id, { actionsStatus: 'Read' });
        }
        setViewTranscriptCall(null);
    };

    if (!mounted) {
        return <div className="p-10 text-center text-slate-500">Loading dashboard...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Transcript Modal */}
            <TranscriptModal
                isOpen={!!viewTranscriptCall}
                onClose={handleCloseTranscript}
                text={viewTranscriptCall?.transcriptText || ''}
            />

            {/* Controls */}
            <div className="flex justify-between items-center glass-panel p-4 rounded-xl">
                <h2 className="text-xl font-semibold text-white">Incoming Calls</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 rounded-lg glass-input w-64 text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="glass-panel rounded-xl overflow-hidden overflow-x-auto min-h-[500px]">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-800/50">
                            <tr className="divide-x divide-slate-700">
                                <SortableContext
                                    items={columns.map(c => c.id)}
                                    strategy={horizontalListSortingStrategy}
                                >
                                    {columns.map((col) => (
                                        <SortableHeader key={col.id} id={col.id} label={col.label} icon={col.icon} />
                                    ))}
                                </SortableContext>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700 bg-transparent text-slate-300">
                            {isLoading ? (
                                <tr><td colSpan={columns.length} className="text-center py-10">Loading...</td></tr>
                            ) : calls.length === 0 ? (
                                <tr><td colSpan={columns.length} className="text-center py-10">No calls found</td></tr>
                            ) : (
                                calls.map((call) => (
                                    <tr key={call.id} className="hover:bg-slate-800/30 transition-colors divided-x divide-slate-800">
                                        {columns.map((col) => {
                                            const val = call[col.id as keyof Call];
                                            return (
                                                <td key={col.id} className={`px-2 py-4 text-sm ${col.id === 'callIntent' ? 'min-w-[200px] max-w-[400px]' : 'whitespace-nowrap'}`}>
                                                    {renderCell(col.id, val, call, updateCall, setViewTranscriptCall)}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </DndContext>
            </div>
        </div>
    );
}

function renderCell(colId: string, val: any, call: Call, updateCall: any, openTranscript: (call: Call) => void) {
    switch (colId) {
        case 'createdAt':
            return <span className="text-slate-400">{format(new Date(val), 'MMM d, h:mm a')}</span>;
        case 'phoneNumber':
            return <a href={`tel:${val}`} className="text-blue-400 hover:text-blue-300 hover:underline">{val}</a>;
        case 'transcript':
            return (
                <div className="max-h-24 overflow-y-auto text-xs text-slate-400 min-w-[200px] max-w-[300px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    {call.transcriptText ? (
                        <div
                            onClick={() => openTranscript(call)}
                            className="cursor-pointer hover:bg-slate-700/50 p-2 rounded transition-colors group"
                        >
                            <span className="line-clamp-3 group-hover:text-slate-200">{call.transcriptText}</span>
                            <span className="text-[10px] text-blue-400 mt-1 inline-block opacity-0 group-hover:opacity-100 transition-opacity">Click to expand</span>
                        </div>
                    ) : (call.transcriptUrl ? (
                        <a href={call.transcriptUrl} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white flex items-center gap-1">
                            <FileText size={14} /> View PDF
                        </a>
                    ) : <span className="text-slate-600">-</span>)}
                </div>
            );
        case 'rating':
            return (
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} onClick={() => updateCall(call.id, { rating: star })}>
                            <Star
                                size={14}
                                className={star <= (call.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}
                            />
                        </button>
                    ))}
                </div>
            );
        case 'followUpNeeded':
            return (
                <span className={`font-medium ${val ? 'text-amber-400' : 'text-slate-500'}`}>
                    {val ? 'Yes' : 'No'}
                </span>
            );
        case 'addressed':
            return (
                <button
                    onClick={() => updateCall(call.id, { addressed: !call.addressed })}
                    className={`p-1 rounded ${call.addressed ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-500'}`}
                >
                    <CheckCircle size={16} />
                </button>
            );
        case 'notes':
            return (
                <input
                    type="text"
                    defaultValue={call.notes || ''}
                    onBlur={(e) => updateCall(call.id, { notes: e.target.value })}
                    className="bg-transparent border-b border-slate-700 focus:border-blue-500 outline-none w-32 text-xs"
                    placeholder="Add note..."
                />
            );
        case 'actionsStatus':
            return (
                <span className={`px-2 py-1 rounded-full text-xs ${val === 'Resolved' || val === 'Read' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                    {val}
                </span>
            );
        default:
            return <span>{val?.toString() || '-'}</span>;
    }
}
