import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';

const NewTab = () => {
    const [notes, setNotes] = useState('');
    const [sessions, setSessions] = useState({});
    const [quote, setQuote] = useState({ text: 'Loading...', author: '' });

    useEffect(() => {
        // Load local storage
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(['notes', 'sessions'], (result) => {
                if (result.notes) setNotes(result.notes);
                if (result.sessions) setSessions(result.sessions);
            });
        }

        // Fetch Quote of the Day Integration
        const fetchQuote = async () => {
            try {
                // Using a reliable open free API for quotes
                const response = await fetch('https://api.quotable.io/random?tags=technology,productivity');
                if (response.ok) {
                    const data = await response.json();
                    setQuote({ text: data.content, author: data.author });
                } else {
                    setQuote({ text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' });
                }
            } catch (error) {
                // Fallback quote if offline or API is down
                setQuote({ text: 'Focus on being productive instead of busy.', author: 'Tim Ferriss' });
            }
        };

        fetchQuote();
    }, []);

    const handleRestoreSession = (urls) => {
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

    return (
        <div className="flex flex-col h-full bg-gray-900 text-white p-10 max-w-7xl mx-auto">
            <header className="mb-10 text-center">
                <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    Welcome Back
                </h1>
                <p className="text-gray-400 mt-3 text-lg">Here's a quick overview of your workspace.</p>

                {/* Daily Quote Integration */}
                <div className="mt-8 max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl border border-gray-700/50">
                    <p className="text-xl italic text-gray-300">"{quote.text}"</p>
                    {quote.author && <p className="text-sm font-medium text-indigo-400 mt-3">— {quote.author}</p>}
                </div>
            </header>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Notes Widget */}
                <section className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl flex flex-col overflow-hidden">
                    <div className="bg-gray-850 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-indigo-400" viewBox="0 0 16 16">
                                <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5h-3z" />
                            </svg>
                            Your Notes
                        </h2>
                    </div>
                    <div data-testid="widget-notes" className="p-6 flex-1 overflow-y-auto whitespace-pre-wrap text-gray-300 font-mono text-sm leading-relaxed">
                        {notes || "No notes yet. Add some from the popup extension!"}
                    </div>
                </section>

                {/* Sessions Widget */}
                <section className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl flex flex-col overflow-hidden">
                    <div className="bg-gray-850 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-blue-400" viewBox="0 0 16 16">
                                <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V3H1z" />
                            </svg>
                            Recent Sessions
                        </h2>
                    </div>
                    <div data-testid="widget-sessions" className="p-6 flex-1 overflow-y-auto flex flex-col gap-3">
                        {Object.keys(sessions).length === 0 ? (
                            <p className="text-gray-500 italic text-center mt-10">No saved sessions yet. Save your current tabs from the extension popup!</p>
                        ) : (
                            Object.entries(sessions).map(([name, urls]) => (
                                <div key={name} className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-900 p-4 rounded-xl border border-gray-750 hover:border-gray-600 transition-colors">
                                    <div className="mb-3 sm:mb-0">
                                        <h3 className="font-semibold text-gray-200">{name}</h3>
                                        <p className="text-xs text-gray-500">{urls.length} tabs saved</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleRemoveSession(name)}
                                            className="text-red-400 hover:bg-red-900/30 hover:text-red-300 px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap"
                                        >
                                            Remove
                                        </button>
                                        <button
                                            onClick={() => handleRestoreSession(urls)}
                                            className="bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium text-sm transition-all whitespace-nowrap"
                                        >
                                            Restore Session
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<NewTab />);
