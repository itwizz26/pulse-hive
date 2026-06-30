'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@/lib/hooks/useUser';
import { updateProfile } from '@/lib/api-client';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';

export default function ProfilePage() {
    const { isAuthenticated } = useAuthGuard();
    const user = useUser();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState('');

    // Sync local state when user data loads
    useEffect(() => {
        if (user) setName(user.displayName);
    }, [user]);

    const handleSave = async () => {
        try {
            await updateProfile({ displayName: name });
            setIsEditing(false);
            // In a real app, you'd trigger a re-fetch of user data here
            window.location.reload(); 
        } catch (err) {
            console.error("Update failed", err);
        }
    };

    if (!isAuthenticated || !user) return <div className="text-white p-10">Loading...</div>;
    
    return (
        <div className="max-w-3xl mx-auto p-6 pt-12 space-y-8">
            <div>
                <h1 className="text-2xl font-black text-white tracking-tight">Account Profile</h1>
                <p className="text-slate-400 text-sm mt-1">Manage your identity and authentication settings.</p>
            </div>

            <div className="bg-slate-900/50 border border-white/5 p-8 rounded-3xl backdrop-blur-xl">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-2xl font-bold text-white shadow-2xl">
                        {user.initials}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{name}</h2>
                        <p className="text-sm text-indigo-400 font-mono uppercase">{user.role}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                        <input 
                            type="text" 
                            disabled={!isEditing} 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-white focus:ring-2 focus:ring-indigo-500 transition-all disabled:opacity-50" 
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                        <input 
                            type="email" 
                            disabled 
                            defaultValue={user.email} 
                            className="w-full px-4 py-2.5 bg-slate-950/60 border border-white/10 text-sm rounded-xl text-slate-500 cursor-not-allowed" 
                        />
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 flex gap-4">
                    <button 
                        onClick={() => {
                            if (isEditing) setName(user.displayName); // Reset on cancel
                            setIsEditing(!isEditing);
                        }}
                        className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-xl transition-all"
                    >
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </button>
                    {isEditing && (
                        <button 
                            onClick={handleSave}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all"
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}