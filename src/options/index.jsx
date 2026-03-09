import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';

const Options = () => {
    const [blockedSites, setBlockedSites] = useState([]);
    const [newHostname, setNewHostname] = useState('');

    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.get('blockedSites', (result) => {
                if (result.blockedSites) {
                    setBlockedSites(result.blockedSites);
                }
            });
        }
    }, []);

    const handleAddBlock = () => {
        const trimmed = newHostname.trim().toLowerCase();
        if (!trimmed) return;

        // Simple URL validation/extraction could go here. Assuming user enters domain.
        const updatedSites = [...new Set([...blockedSites, trimmed])];

        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.set({ blockedSites: updatedSites }, () => {
                setBlockedSites(updatedSites);
                setNewHostname('');
            });
        } else {
            setBlockedSites(updatedSites);
            setNewHostname('');
        }
    };

    const handleRemoveBlock = (site) => {
        const updatedSites = blockedSites.filter(s => s !== site);
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.set({ blockedSites: updatedSites }, () => {
                setBlockedSites(updatedSites);
            });
        }
    };

    const handleExportData = () => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(null, (localData) => {
                chrome.storage.sync.get(null, (syncData) => {
                    const exportObj = {
                        sessions: localData.sessions || {},
                        notes: localData.notes || '',
                        blockedSites: syncData.blockedSites || []
                    };

                    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);

                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'productivity_suite_export.json';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                });
            });
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-10">
            <header className="border-b border-gray-700 pb-4">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                    Extension Options
                </h1>
                <p className="text-gray-400 mt-2">Manage your blocklist and export your data.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-white">Website Blocker</h2>
                    <p className="text-sm text-gray-400 mb-4">Add hostnames to block distracting websites (e.g., facebook.com).</p>

                    <div className="flex gap-3 mb-6">
                        <input
                            type="text"
                            data-testid="block-hostname-input"
                            value={newHostname}
                            onChange={(e) => setNewHostname(e.target.value)}
                            placeholder="example.com"
                            className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            onClick={handleAddBlock}
                            data-testid="add-block-btn"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Add
                        </button>
                    </div>

                    <div data-testid="blocked-sites-list" className="space-y-2">
                        {blockedSites.length === 0 ? (
                            <p className="text-gray-500 italic text-sm">No sites currently blocked.</p>
                        ) : (
                            blockedSites.map((site) => (
                                <div key={site} className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-700">
                                    <span className="text-gray-200">{site}</span>
                                    <button
                                        onClick={() => handleRemoveBlock(site)}
                                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg h-fit">
                    <h2 className="text-xl font-semibold mb-4 text-white">Data Management</h2>
                    <p className="text-sm text-gray-400 mb-6">Download a copy of all your saved notes, sessions, and settings as a JSON file.</p>

                    <button
                        onClick={handleExportData}
                        data-testid="export-data-btn"
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors flex justify-center items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                        </svg>
                        Export All Data
                    </button>
                </section>
            </div>
        </div>
    );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Options />);
