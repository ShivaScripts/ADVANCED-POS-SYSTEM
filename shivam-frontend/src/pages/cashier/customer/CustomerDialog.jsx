import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useDispatch, useSelector } from 'react-redux';
// --- START: 1. Import getCustomersByBranch ---
import { getCustomersByBranch } from '@/Redux Toolkit/features/customer/customerThunks';
// --- END: 1. ---
import CustomerForm from './CustomerForm';
import { setSelectedCustomer } from '../../../Redux Toolkit/features/cart/cartSlice';
import { toast } from "sonner";

const CustomerDialog = ({
  showCustomerDialog,
  setShowCustomerDialog
}) => {
  const dispatch = useDispatch();
  const { customers, loading } = useSelector(state => state.customer);
  // --- START: 2. Get the branch from state ---
  const { branch } = useSelector(state => state.branch);
  // --- END: 2. ---
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  useEffect(() => {
    // --- START: 3. Fetch customers by branch ID ---
    if (showCustomerDialog && branch?.id) {
      dispatch(getCustomersByBranch(branch.id));
    }
    // --- END: 3. ---
  }, [showCustomerDialog, branch, dispatch]); // Add branch to dependency array

  const filteredCustomers = customers.filter(customer =>
    customer.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const handleCustomerSelect = (customer) => {
    dispatch(setSelectedCustomer(customer));
    setShowCustomerDialog(false);
    toast.success("Customer Selected", {
      description: `${customer.fullName} selected for this order`,
    });
  };

  return (
    <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select Customer</DialogTitle>
        </DialogHeader>
        
        <div className="mb-4">
          <Input 
            placeholder="Search customers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <p>Loading customers...</p>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'No customers found matching your search.' : 'No customers available.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map(customer => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.fullName}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleCustomerSelect(customer)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <CustomerForm 
          showCustomerForm={showCustomerForm}
          setShowCustomerForm={setShowCustomerForm}
        />
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowCustomerDialog(false)}>Cancel</Button>
          <Button onClick={() => setShowCustomerForm(true)}>Add New Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDialog;