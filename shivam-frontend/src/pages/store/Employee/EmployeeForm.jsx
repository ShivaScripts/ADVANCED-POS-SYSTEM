import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBranchesByStore } from "@/Redux Toolkit/features/branch/branchThunks";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

// --- START: FIX 1 ---
// Put the 'role' validation back, and add the 'when' condition for branchId
const validationSchema = Yup.object({
  fullName: Yup.string().required("Employee name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string().required("Phone number is required"),
  role: Yup.string().required("Role is required"),
  branchId: Yup.string().when("role", {
    is: (role) => role === "ROLE_BRANCH_MANAGER" || role === "ROLE_BRANCH_CASHIER",
    then: (schema) => schema.required("Branch is required"),
    otherwise: (schema) => schema.notRequired(),
  }),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});
// --- END: FIX 1 ---

const EmployeeForm = ({ initialData, onSubmit, roles }) => {
  const dispatch = useDispatch();
  const { branches } = useSelector((state) => state.branch);
  const { store } = useSelector((state) => state.store);

  useEffect(() => {
    dispatch(
      getAllBranchesByStore({
        storeId: store?.id,
        jwt: localStorage.getItem("jwt"),
      })
    );
  }, [dispatch, store?.id]);

  const formik = useFormik({
    // --- START: FIX 2 ---
    // Remove the hardcoded role
    initialValues: initialData || {
      fullName: "",
      email: "",
      password: "",
      phone: "",
      role: "", // Let the dropdown select the default
      branchId: initialData ? String(initialData.branchId) : "",
    },
    // --- END: FIX 2 ---
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  // When editing, ensure branchId is a string and role is set
  useEffect(() => {
    if (initialData) {
      formik.setValues({
        ...initialData,
        branchId: initialData.branchId ? String(initialData.branchId) : "",
        role: initialData.role, // Use the role from the existing data
      });
    } else {
      formik.resetForm();
      // If there's only one role, set it as default
      if (roles && roles.length === 1) {
        formik.setFieldValue("role", roles[0]);
      }
    }
  }, [initialData, roles]);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 py-2 pr-2">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          name="fullName"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter employee name"
        />
        {formik.touched.fullName && formik.errors.fullName ? (
          <div className="text-red-500 text-sm">{formik.errors.fullName}</div>
        ) : null}
      </div>

      {/* ... (email, password, phone fields are unchanged) ... */}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter email address"
        />
        {formik.touched.email && formik.errors.email ? (
          <div className="text-red-500 text-sm">{formik.errors.email}</div>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter password"
        />
        {formik.touched.password && formik.errors.password ? (
          <div className="text-red-500 text-sm">{formik.errors.password}</div>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Enter phone number"
        />
        {formik.touched.phone && formik.errors.phone ? (
          <div className="text-red-500 text-sm">{formik.errors.phone}</div>
        ) : null}
      </div>

      {/* --- START: FIX 3 --- */}
      {/* Put the Role dropdown and conditional Branch dropdown back */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            value={formik.values.role}
            onValueChange={(value) => {
              formik.setFieldValue("role", value);
              // If role doesn't need a branch, clear the branchId
              if (value !== "ROLE_BRANCH_MANAGER" && value !== "ROLE_BRANCH_CASHIER") {
                formik.setFieldValue("branchId", "");
              }
            }}
            onOpenChange={() => formik.setFieldTouched("role", true)}
            className="w-full"
            // Disable dropdown if there is only one role option
            disabled={roles && roles.length === 1}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {/* Use the 'roles' prop to create the list */}
              {(roles || []).map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {formik.touched.role && formik.errors.role ? (
            <div className="text-red-500 text-sm">{formik.errors.role}</div>
          ) : null}
        </div>
        
        {/* Show Branch dropdown only if role requires it */}
        {(formik.values.role === "ROLE_BRANCH_MANAGER" || formik.values.role === "ROLE_BRANCH_CASHIER") && (
          <div className="space-y-2">
            <Label htmlFor="branchId">Branch</Label>
            <Select
              value={formik.values.branchId}
              onValueChange={(value) => formik.setFieldValue("branchId", value)}
              onOpenChange={() => formik.setFieldTouched("branchId", true)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select branch" />
              </SelectTrigger>
              <SelectContent>
                {(branches || []).map((branch) => (
                  <SelectItem key={branch.id} value={String(branch.id)}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formik.touched.branchId && formik.errors.branchId ? (
              <div className="text-red-500 text-sm">{formik.errors.branchId}</div>
            ) : null}
          </div>
        )}
      </div>
      {/* --- END: FIX 3 --- */}

      <div className="flex justify-end pt-4">
        <Button type="submit" className="">
          {initialData ? "Save Changes" : "Add Employee"}
        </Button>
      </div>
    </form>
  );
};

export default EmployeeForm;