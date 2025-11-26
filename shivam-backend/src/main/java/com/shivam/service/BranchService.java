package com.shivam.service;


import com.shivam.exception.UserException;
import com.shivam.modal.User;
import com.shivam.payload.dto.BranchDTO;

import java.util.List;

public interface BranchService {
    BranchDTO createBranch(BranchDTO branchDto, User user);
    BranchDTO getBranchById(Long id);
    List<BranchDTO> getAllBranchesByStoreId(Long storeId) throws UserException;
    BranchDTO updateBranch(Long id, BranchDTO branchDto, User user) throws Exception;

    void deleteBranch(Long id);
}

