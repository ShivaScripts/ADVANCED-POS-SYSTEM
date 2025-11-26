// pos-frontend-vite/src/pages/store/Alerts/Alerts.jsx

import React, { useEffect } from 'react'; // <-- 1. Ensure useEffect is imported
import { Card } from '../../../components/ui/card';
import InactiveCashierTable from './InactiveCashierTable';
import LowStockProductTable from './LowStockProductTable';
import NoSaleTodayBranchTable from './NoSaleTodayBranchTable';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getStoreAlerts } from '../../../Redux Toolkit/features/storeAnalytics/storeAnalyticsThunks';
// --- START: 2. Import the "mark as read" action ---
import { markAlertsAsViewed } from '../../../Redux Toolkit/features/storeAnalytics/storeAnalyticsSlice';
// --- END: 2. ---
import RefundSpikeTable from './RefundSpikeTable';

const Alerts = () => {
     const dispatch = useDispatch();
      const storeAnalytics = useSelector((state) => state.storeAnalytics);
      const user = useSelector((state) => state.user.userProfile);
    
      console.log("Store Alerts:", storeAnalytics.storeAlerts, user);
    
      useEffect(() => {
        // --- START: 3. Add logic ---
        if (user?.id) {
          dispatch(getStoreAlerts(user.id));
          // Also mark alerts as viewed just by visiting this page
          dispatch(markAlertsAsViewed()); 
        }
      }, [dispatch, user]); // <-- 4. Add user as dependency
      // --- END: 3. ---

  return (
    <div className='grid grid-cols-4 gap-4 p-4'>
        <div className='col-span-2 '>
            <Card className="min-h-96  px-5 py-1 pt-5">
                <h1 className='font-bold text-2xl'>Inactive Cashiers</h1>
                {/* 5. Pass data to child components */}
                <InactiveCashierTable data={storeAnalytics.storeAlerts?.inactiveCashiers} />
            </Card>
        </div>
        <div className='col-span-2'>
              <Card className="min-h-96  px-5 py-1 pt-5">
                <h1 className='font-bold text-2xl'>Low Stock Alerts</h1>
                <LowStockProductTable data={storeAnalytics.storeAlerts?.lowStockAlerts} />
              </Card>
          
        </div>
        <div className='col-span-2'>
            <Card className="min-h-96 px-5 py-1 pt-5">
                <h1 className='font-bold text-2xl'>No Sale Today</h1>
                <NoSaleTodayBranchTable data={storeAnalytics.storeAlerts?.noSalesToday} />
            </Card>
        </div>
        <div className='col-span-2'>
            <Card className="min-h-96 py-1 pt-5 px-5">
                <h1 className='font-bold text-2xl'>Refund Spike</h1>
                <RefundSpikeTable data={storeAnalytics.storeAlerts?.refundSpikeAlerts} />
            </Card>
        </div>
    </div>
  )
}

export default Alerts