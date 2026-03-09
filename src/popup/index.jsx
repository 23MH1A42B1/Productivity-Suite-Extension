import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';

const Popup = () => {
    const [notes, setNotes] = useState('');
    const [sessions, setSessions] = useState({});
    const [sessionName, setSessionName] = useState('');

    // Load initial data
    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['notes', 'sessions'], (result) => {
                if (result.notes) setNotes(result.notes);
                if (result.sessions) setSessions(result.sessions);
            });
        }
    }, []);

    const handleSaveNotes = () => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ notes }, () => {
                console.log('Notes saved');
            });
        }
    };

    const handleSaveSession = () => {
        if (!sessionName.trim()) return;
        if (typeof chrome !== 'undefined' && chrome.tabs && chrome.storage) {
            chrome.tabs.query({ currentWindow: true }, (tabs) => {
                const urls = tabs.map((tab) => tab.url);
                const newSessions = { ...sessions, [sessionName]: urls };
                chrome.storage.local.set({ sessions: newSessions }, () => {
                    setSessions(newSessions);
                    setSessionName('');
                });
            });
        }
    };

    const handleRestoreSession = (name) => {
        const urls = sessions[name];
        if (urls && urls.length > 0 && typeof chrome !== 'undefined' && chrome.windows) {
            chrome.windows.create({ url: urls });
        }
    };

    const handleRemoveSession = (name) => {
        const newSessions = { ...sessions };
        delete newSessions[name];
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ sessions: newSessions }, () => {
                setSessions(newSessions);
            });
        } else {
            setSessions(newSessions);
        }
    };

    const openOptions = () => {
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.openOptionsPage();
        }
    };

    return (
        <div className="p-5 flex flex-col gap-6 w-full h-full">
            <header className="flex justify-between items-center border-b border-gray-700 pb-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Productivity Suite
                </h1>
                <button
                    onClick={openOptions}
                    data-testid="open-options-btn"
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Open Options"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z" />
                        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z" />
                    </svg>
                </button>
            </header>

            <section className="flex flex-col gap-2">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Tab Sessions</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Session name..."
                        value={sessionName}
                        onChange={(e) => setSessionName(e.target.value)}
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSaveSession}
                        data-testid="save-session-btn"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Save
                    </button>
                </div>
                <div data-testid="sessions-list" className="max-h-32 overflow-y-auto mt-2 space-y-1 pr-1">
                    {Object.keys(sessions).length === 0 ? (
                        <p className="text-xs text-gray-500 italic">No saved sessions.</p>
                    ) : (
                        Object.keys(sessions).map((key) => (
                            <div key={key} className="flex justify-between items-center bg-gray-800 p-2 rounded-md border border-gray-750">
                                <span className="text-sm truncate mr-2 flex-1" title={key}>{key}</span>
                                <div className="flex gap-1 shrink-0">
                                    <button
                                        onClick={() => handleRemoveSession(key)}
                                        data-testid={`remove-session-${key}`}
                                        className="text-xs bg-red-900/40 text-red-200 hover:bg-red-800 hover:text-white px-2 py-1 rounded transition-colors"
                                    >
                                        Remove
                                    </button>
                                    <button
                                        onClick={() => handleRestoreSession(key)}
                                        data-testid={`restore-session-${key}`}
                                        className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded transition-colors"
                                    >
                                        Restore
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section className="flex flex-col gap-2 flex-1 mt-2">
                <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider flex justify-between items-end">
                    <span>Notes</span>
                </h2>
                <textarea
                    data-testid="notes-textarea"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Jot down some markdown notes..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none min-h-[120px]"
                />
                <button
                    onClick={handleSaveNotes}
                    data-testid="save-notes-btn"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 justify-center rounded-md text-sm font-medium transition-colors mt-1"
                >
                    Save Notes
                </button>
            </section>
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Popup />);
