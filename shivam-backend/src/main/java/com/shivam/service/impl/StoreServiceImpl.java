package com.shivam.service.impl;

import com.shivam.modal.ActivityLog; // <-- START: ADD
import com.shivam.repository.ActivityLogRepository; // <-- START: ADD

import com.shivam.domain.StoreStatus;
import com.shivam.domain.UserRole;
import com.shivam.exception.ResourceNotFoundException;
import com.shivam.exception.UserException;
import com.shivam.mapper.StoreMapper;
import com.shivam.mapper.UserMapper;
import com.shivam.modal.Branch;
import com.shivam.modal.Store;
import com.shivam.modal.StoreContact;
import com.shivam.modal.User;
import com.shivam.payload.dto.StoreDTO;
import com.shivam.payload.dto.UserDTO;
import com.shivam.repository.BranchRepository;
import com.shivam.repository.StoreRepository;
import com.shivam.repository.UserRepository;
import com.shivam.service.StoreService;

import com.shivam.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // <-- 1. ADD THIS IMPORT

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final UserService userService;
    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ActivityLogRepository activityLogRepository;

    @Override
    public StoreDTO createStore(StoreDTO storeDto, User user) {

        System.out.println(storeDto);

        Store store = StoreMapper.toEntity(storeDto, user);

        // Save the store first
        Store savedStore = storeRepository.save(store);

        // --- START: ADD ACTIVITY LOG FOR STORE CREATION ---
        try {
            ActivityLog log = ActivityLog.builder()
                    .user(user)
                    .store(savedStore)
                    .activityType("STORE_REGISTERED")
                    .description("New store '" + savedStore.getBrand() + "' registered and is pending approval.")
                    .build();
            activityLogRepository.save(log);
        } catch (Exception e) {
            // Don't block store creation on logging failure; optionally log this exception
            System.err.println("Failed to save activity log for store creation: " + e.getMessage());
        }
        // --- END: ADD ACTIVITY LOG FOR STORE CREATION ---

        return StoreMapper.toDto(savedStore);
    }

    @Override
    public StoreDTO getStoreById(Long id) throws ResourceNotFoundException {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found"));
        return StoreMapper.toDto(store);
    }

    @Override
    public List<StoreDTO> getAllStores(StoreStatus status) {
        List<Store> stores;
        if (status != null) {
            stores = storeRepository.findByStatus(status);
        } else {
            stores = storeRepository.findAll();
        }

        return stores.stream()
                .map(StoreMapper::toDto)
                .collect(Collectors.toList());


    }

    @Override
    public Store getStoreByAdminId() throws UserException {
        User currentUser=userService.getCurrentUser();
        return storeRepository.findByStoreAdminId(
                currentUser.getId()
        );
    }

    @Override
    public StoreDTO getStoreByEmployee() throws UserException {
        User currentUser=userService.getCurrentUser();


        if(currentUser.getStore()==null){
            throw new UserException("user does not have enough permissions to access this store");
        }
        return StoreMapper.toDto(currentUser.getStore());
    }

    @Override
    @Transactional // <-- 2. ADD THIS ANNOTATION
    public StoreDTO updateStore(Long id, StoreDTO storeDto) throws ResourceNotFoundException, UserException {
        User currentUser = userService.getCurrentUser();
        Store existing = storeRepository.findByStoreAdminId(currentUser.getId());

        if (existing == null) {
            throw new ResourceNotFoundException("store not found");
        }

        // This check is good if ID is passed, but getStoreByAdminId doesn't need it
        // if(!existing.getId().equals(id)) {
        //    throw new UserException("You are not authorized to update this store");
        // }

        existing.setBrand(storeDto.getBrand());
        existing.setDescription(storeDto.getDescription());

        if (storeDto.getStoreType() != null) {
            existing.setStoreType(storeDto.getStoreType());
        }

        if (storeDto.getContact() != null) {
            StoreContact contact = existing.getContact();
            if (contact == null) contact = new StoreContact();
            contact.setAddress(storeDto.getContact().getAddress());
            contact.setPhone(storeDto.getContact().getPhone());
            contact.setEmail(storeDto.getContact().getEmail());
            existing.setContact(contact);
        }

        // --- START: Add Tax/Currency from previous fix ---
        // (Assuming these are already here)
        existing.setTaxRate(storeDto.getTaxRate());
        existing.setCurrency(storeDto.getCurrency());
        existing.setDateFormat(storeDto.getDateFormat());
        existing.setReceiptFooter(storeDto.getReceiptFooter());
        // --- END: Add Tax/Currency ---

        // --- START: New Payment Toggle Logic ---
        existing.setAcceptsCash(storeDto.getAcceptsCash());
        existing.setAcceptsCard(storeDto.getAcceptsCard());
        existing.setAcceptsUpi(storeDto.getAcceptsUpi());
        // --- END: New Payment Toggle Logic ---

        // Now, when this method returns, @Transactional will commit the changes
        // to the 'existing' entity to the database.
        return StoreMapper.toDto(storeRepository.save(existing));
    }
    @Override
    public void deleteStore() throws ResourceNotFoundException, UserException {
        Store store= getStoreByAdminId();

        if (store==null) {
            throw new ResourceNotFoundException("Store not found");
        }
        storeRepository.deleteById(store.getId());
    }

    @Override
    public UserDTO addEmployee(Long id, UserDTO userDto) throws UserException {
        Store store = getStoreByAdminId();

        // --- START: ADD THIS SECURITY CHECK ---
        // Enforce that Store Admins can ONLY create Branch Managers
        if (userDto.getRole() != UserRole.ROLE_BRANCH_MANAGER) {
            throw new UserException("Store Admins are only authorized to create Branch Managers.");
        }
        // --- END: ADD THIS SECURITY CHECK ---

        User employee = UserMapper.toEntity(userDto);

        // --- START: SIMPLIFIED LOGIC ---
        // We know the role is ROLE_BRANCH_MANAGER, so we just run this logic
        if (userDto.getBranchId() == null) {
            throw new UserException("Branch ID is required for a Branch Manager.");
        }
        Branch branch = branchRepository.findById(userDto.getBranchId()).orElseThrow(
                () -> new EntityNotFoundException("Branch not found with id: " + userDto.getBranchId())
        );
        employee.setBranch(branch);
        employee.setStore(store);
        // --- END: SIMPLIFIED LOGIC ---

        employee.setPassword(passwordEncoder.encode(userDto.getPassword()));
        User addedEmployee = userRepository.save(employee);

        return UserMapper.toDTO(addedEmployee);
    }

    @Override
    public List<UserDTO> getEmployeesByStore(Long storeId) throws UserException {
        User currentUser=userService.getCurrentUser();

        Store store=storeRepository.findById(storeId).orElseThrow(
                ()->new EntityNotFoundException("store not found")
        );
        if(store.getStoreAdmin().getId().equals(currentUser.getId())
                || currentUser.getStore().getId().equals(store.getId())){
            List<User> employees=userRepository.findByStoreId(storeId);
            return UserMapper.toDTOList(employees);
        }

        throw new UserException("user does not have enough permissions to access this store");
    }


    @Override
    @Transactional // <-- Also good practice to have this on other write methods
    public StoreDTO moderateStore(Long storeId, StoreStatus action) throws ResourceNotFoundException {
        Store store = storeRepository.findById(storeId)
                .orElseThrow(() -> new ResourceNotFoundException("Store not found with id: " + storeId));

        store.setStatus(action);
        Store updatedStore = storeRepository.save(store);

        // --- START: ADD ACTIVITY LOG FOR MODERATION ACTION ---
        String activityType = "";
        String description = "";

        if (action == StoreStatus.ACTIVE) {
            activityType = "STORE_APPROVED";
            description = "Store '" + updatedStore.getBrand() + "' has been approved.";
        } else if (action == StoreStatus.BLOCKED) {
            activityType = "STORE_BLOCKED";
            description = "Store '" + updatedStore.getBrand() + "' has been blocked.";
        } else if (action == StoreStatus.PENDING) {
            activityType = "STORE_PENDING";
            description = "Store '" + updatedStore.getBrand() + "' set to pending.";
        }

        try {
            User adminUser = userService.getCurrentUser();
            ActivityLog log = ActivityLog.builder()
                    .user(adminUser)
                    .store(updatedStore)
                    .activityType(activityType)
                    .description(description)
                    .build();
            activityLogRepository.save(log);
        } catch (UserException e) {
            // If current user is not available in context, don't fail the moderation;
            // optionally log the issue.
            System.err.println("No admin user in context while saving activity log: " + e.getMessage());
        }
        // --- END: ADD ACTIVITY LOG FOR MODERATION ACTION ---

        return StoreMapper.toDto(updatedStore);
    }


}
