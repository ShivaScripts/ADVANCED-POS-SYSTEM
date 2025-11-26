import React, { useEffect, useState } from 'react';
import { Flame, TrendingUp, Loader2 } from 'lucide-react';

// ✅ CORRECTED LINE: Use 3 sets of '../' to land inside 'src'
import api from '../../../utils/api'; 

const TrendingTicker = () => {
  const [trending, setTrending] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        // Try adding '/api' to the start
        // REMOVE '/api' from here because api.js already adds it!
// We are manually adding '/api' because the server reported it was missing
// We are manually adding '/api' because the server reported it was missing
// Now this will resolve to: http://localhost:5000/api/orders/analytics/trending
// Manually add '/api' here because we removed it from the global config
const response = await api.get('/api/orders/analytics/trending');
        setTrending(response.data || null);
      } catch (error) {
        console.error("Failed to fetch trending:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  // 1. Loading State
  if (loading) {
    return (
      <div className="hidden md:flex items-center bg-orange-50/50 border border-orange-100/50 rounded-full px-4 py-1.5 shadow-sm animate-pulse">
        <div className="h-4 w-4 bg-orange-200 rounded-full mr-2"></div>
        <div className="h-3 w-24 bg-orange-100 rounded"></div>
      </div>
    );
  }

  // 2. Strict Check: Ensure 'trending' exists AND 'found' is true
  const hasTrendingData = trending && trending.found;

  return (
    <div className="hidden md:flex items-center bg-orange-50 border border-orange-100 rounded-full px-4 py-1.5 shadow-sm mx-auto">
      <div className="bg-orange-100 p-1 rounded-full mr-2">
        <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
      </div>
      <div className="text-sm font-medium text-orange-900 flex items-center gap-2">
        <span className="uppercase text-[10px] font-bold tracking-wider text-orange-500">Today's Top Pick</span>
        
        {hasTrendingData ? (
          <span className="flex items-center gap-1 animate-in slide-in-from-bottom-2">
            {trending?.productName || "Unknown Product"} 
            <span className="text-orange-300 mx-1">|</span> 
            <span className="font-bold">{trending?.quantity || 0} sold</span>
            <TrendingUp className="w-3 h-3 text-green-600 ml-1" />
          </span>
        ) : (
          <span className="italic text-orange-400 text-xs">Waiting for first sale...</span>
        )}
      </div>
    </div>
  );
};

export default TrendingTicker;