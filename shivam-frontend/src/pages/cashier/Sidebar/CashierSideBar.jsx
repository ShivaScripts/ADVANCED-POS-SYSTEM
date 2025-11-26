import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getBranchById } from "../../../Redux Toolkit/features/branch/branchThunks";
import { Button } from "../../../components/ui/button";
import { LogOutIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { logout } from "../../../Redux Toolkit/features/user/userThunks";
import { ThemeToggle } from "../../../components/theme-toggle";
import BranchInfo from "./BranchInfo";
// --- START: ADD THESE IMPORTS ---
import { endShift } from "../../../Redux Toolkit/features/shiftReport/shiftReportThunks";
import { useToast } from "@/components/ui/use-toast";
// --- END: ADD THESE IMPORTS ---

const CashierSideBar = ({ navItems, onClose }) => {
  const dispatch = useDispatch();
  const { userProfile } = useSelector((state) => state.user);
  const { branch, loading, error } = useSelector((state) => state.branch);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast(); // <-- Add toast

  useEffect(() => {
    if (userProfile && userProfile.branchId) {
      dispatch(
        getBranchById({
          id: userProfile.branchId,
          jwt: localStorage.getItem("jwt"),
        })
      );
      
    }
  }, [dispatch, userProfile]);

  // --- START: UPDATE THIS FUNCTION ---
  const handleLogout = async () => {
    try {
      // 1. End the shift first and wait for it to complete
      await dispatch(endShift()).unwrap();
      
      toast({
        title: "Shift Ended",
        description: "Your shift has been successfully ended.",
      });

      // 2. Then, log the user out
      await dispatch(logout()).unwrap();
      
      // 3. Finally, navigate to the login page
      navigate("/");

    } catch (err) {
      console.error("Failed to end shift or logout:", err);
      toast({
        title: "Error",
        description: err || "Could not end shift or log out. Please contact support.",
        variant: "destructive",
      });
      
      // Even if shift fails to end, log user out locally and redirect
      await dispatch(logout()).unwrap();
      navigate("/");
    }
  };
  // --- END: UPDATE THIS FUNCTION ---

  return (
    <div className="w-64 border-r border-border bg-sidebar p-4 flex flex-col h-full relative">
      <Button
        className="absolute top-2 right-2 rounded"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>
      <div className="flex items-center justify-center p-2 mb-6">
        <h1 className="text-xl font-bold text-sidebar-foreground">POS System</h1>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-between p-3 rounded-md hover:bg-sidebar-accent transition-colors ${
              location.pathname === item.path
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground"
            }`}
            onClick={() => {
              if (onClose) onClose();
            }}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
        
          </Link>
        ))}
      </nav>

      {branch && <BranchInfo />}
      <Separator className="my-4" />

      <div className="space-y-2">
        <div className="flex items-center justify-center mb-2">
          <ThemeToggle />
        </div>
   
        <Button
          variant="outline"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          End Shift & Logout
        </Button>
      </div>
    </div>
  );
};

export default CashierSideBar;