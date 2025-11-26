package com.shivam.payload.StoreAnalysis;

import com.shivam.payload.dto.BranchDTO;
import com.shivam.payload.dto.ProductDTO;
import com.shivam.payload.dto.RefundDTO;
import com.shivam.payload.dto.UserDTO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class StoreAlertDTO {
    private List<ProductDTO> lowStockAlerts;
    private List<BranchDTO> noSalesToday;
    private List<RefundDTO> refundSpikeAlerts;
    private List<UserDTO> inactiveCashiers;
}

