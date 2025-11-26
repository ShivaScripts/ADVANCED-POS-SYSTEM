// pos-frontend-vite/src/pages/cashier/product/ProductSection.jsx
import React, { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, PlusSquare, Loader2, X, ScanBarcode } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import ProductCard from "./ProductCard";
import { useDispatch, useSelector } from "react-redux";
import { getProductsByStore, searchProducts } from "@/Redux Toolkit/features/product/productThunks";
import { getBranchById } from "@/Redux Toolkit/features/branch/branchThunks";
import { clearSearchResults } from '@/Redux Toolkit/features/product/productSlice';

const ProductSection = ({ searchInputRef, onCustomItemClick }) => {
  const dispatch = useDispatch();
  const { branch } = useSelector((state) => state.branch);
  const { userProfile } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const { products, searchResults, loading, error: productsError } = useSelector((state) => state.product);
  const { toast } = useToast();

  const getDisplayProducts = () => {
    if (searchTerm.trim() && searchResults.length > 0) return searchResults;
    return products || [];
  };

  useEffect(() => {
    const fetchProducts = async () => {
      if (branch?.storeId && localStorage.getItem("jwt")) {
        try {
          await dispatch(getProductsByStore(branch.storeId)).unwrap();
        } catch (error) {
           // handle error
        }
      } else if (userProfile?.branchId && localStorage.getItem("jwt") && !branch) {
        try {
          await dispatch(getBranchById({ id: userProfile.branchId, jwt: localStorage.getItem("jwt") })).unwrap();
        } catch (error) {
           // handle error
        }
      }
    };
    fetchProducts();
  }, [dispatch, branch, userProfile]);

  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (query) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (query.trim() && branch?.storeId) {
            dispatch(searchProducts({ query: query.trim(), storeId: branch.storeId }))
              .unwrap()
              .catch((err) => console.error(err));
          }
        }, 500);
      };
    })(),
    [dispatch, branch]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.trim()) debouncedSearch(e.target.value);
    else dispatch(clearSearchResults());
  };

  return (
    <div className="w-full md:w-3/5 lg:w-[65%] flex flex-col h-full bg-background/50 backdrop-blur-sm">
      {/* Modern Floating Search Header */}
      <div className="p-4 pb-2 sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="relative flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Search products (F1)..."
              className="pl-9 pr-9 h-11 bg-muted/40 border-border/60 focus:bg-background transition-colors text-base shadow-sm"
              value={searchTerm}
              onChange={handleSearchChange}
              disabled={loading}
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X size={14} />
              </button>
            )}
          </div>
          
          <Button 
            variant="outline" 
            className="h-11 px-4 border-border/60 hover:bg-accent/50 shadow-sm"
            onClick={onCustomItemClick}
          >
            <PlusSquare className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Custom</span>
          </Button>
        </div>

        {/* Results Count Bar */}
        <div className="flex items-center justify-between mt-3 px-1">
          <p className="text-xs font-medium text-muted-foreground">
            {loading ? (
                 <span className="flex items-center gap-2"><Loader2 className="w-3 h-3 animate-spin"/> Loading...</span>
            ) : (
                <span>{getDisplayProducts().length} Items found</span>
            )}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4 pt-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[50vh] space-y-4 opacity-50">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : getDisplayProducts().length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[50vh] text-muted-foreground space-y-4">
            <div className="bg-muted/50 p-6 rounded-full">
                <Search className="w-12 h-12 opacity-20" />
            </div>
            <p>No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 pb-20">
            {getDisplayProducts().map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductSection;