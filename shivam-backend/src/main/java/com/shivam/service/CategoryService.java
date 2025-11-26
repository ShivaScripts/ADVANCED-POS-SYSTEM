package com.shivam.service;


import com.shivam.exception.UserException;
import com.shivam.payload.dto.CategoryDTO;

import java.util.List;

public interface CategoryService {
    CategoryDTO createCategory(CategoryDTO dto) throws UserException;
    List<CategoryDTO> getCategoriesByStore(Long storeId);
    CategoryDTO updateCategory(Long id, CategoryDTO dto) throws UserException;
    void deleteCategory(Long id) throws UserException;
}
