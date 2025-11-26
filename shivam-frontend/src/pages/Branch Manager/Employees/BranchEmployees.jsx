// pos-frontend-vite/src/pages/employee/BranchEmployees.jsx

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";

import EmployeeStats from "./EmployeeStats";
import EmployeeTable from "./EmployeeTable";
import {
  AddEmployeeDialog,
  EditEmployeeDialog,
  PerformanceDialog,
  // ResetPasswordDialog, // Removed import
} from "./EmployeeDialogs";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  createBranchEmployee,
  findBranchEmployees,
  updateEmployee,
  toggleEmployeeAccess // <-- START: ADD THIS
} from "../../../Redux Toolkit/features/employee/employeeThunks";

const getStatusColor = (status) => {
  if (status === "Active") {
    return "text-green-500";
  } else if (status === "Inactive") {
    return "text-red-500";
  } else {
    return "text-gray-500";
  }
};

const BranchEmployees = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  // isResetPasswordDialogOpen state removed
  const [isPerformanceDialogOpen, setIsPerformanceDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const dispatch = useDispatch();
  const { branch } = useSelector((state) => state.branch);
  const { employees } = useSelector((state) => state.employee);
  const { userProfile } = useSelector((state) => state.user);

  console.log("branch employees", employees);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddEmployee = (newEmployeeData) => {
    if (branch?.id && userProfile.branchId) {
      const data = {
        employee: {
          ...newEmployeeData,
          username: newEmployeeData.email.split("@")[0],
        },
        branchId: branch.id,
        token: localStorage.getItem("jwt"),
      };
      console.log("branch employee data ", data);
      dispatch(createBranchEmployee(data));
      setIsAddDialogOpen(false);
    }
  };

  const handleEditEmployee = (updatedEmployeeData) => {
    if (selectedEmployee?.id && localStorage.getItem("jwt")) {
      const data = {
        employeeId: selectedEmployee.id,
        employeeDetails: updatedEmployeeData,
        token: localStorage.getItem("jwt"),
      };
      dispatch(updateEmployee(data));
      setIsEditDialogOpen(false);
    }
  };

  useEffect(() => {
    if (branch?.id) {
      dispatch(
        findBranchEmployees({
          branchId: branch?.id,
        })
      );
    }
  }, [dispatch, branch?.id]);

  const handleToggleAccess = (employee) => {
    dispatch(toggleEmployeeAccess(employee.id));
  };

  // handleResetPassword function removed

  const openEditDialog = (employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  // openResetPasswordDialog function removed

  const openPerformanceDialog = (employee) => {
    setSelectedEmployee(employee);
    setIsPerformanceDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">
          Employee Management
        </h1>
        <AddEmployeeDialog
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          handleAddEmployee={handleAddEmployee}
          roles={["ROLE_BRANCH_CASHIER"]}
        />
      </div>
      <EmployeeStats employees={employees} />
      <EmployeeTable
        employees={employees}
        getStatusColor={getStatusColor}
        handleToggleAccess={handleToggleAccess}
        openEditDialog={openEditDialog}
        // openResetPasswordDialog prop removed
        openPerformanceDialog={openPerformanceDialog}
      />

      <EditEmployeeDialog
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        selectedEmployee={selectedEmployee}
        handleEditEmployee={handleEditEmployee}
        roles={["ROLE_BRANCH_CASHIER"]}
      />

      {/* ResetPasswordDialog component removed */}

      <PerformanceDialog
        isPerformanceDialogOpen={isPerformanceDialogOpen}
        setIsPerformanceDialogOpen={setIsPerformanceDialogOpen}
        selectedEmployee={selectedEmployee}
      />
    </div>
  );
};

export default BranchEmployees;
