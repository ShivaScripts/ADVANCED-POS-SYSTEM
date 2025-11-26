package com.shivam.payload.request;


import lombok.Data;



@Data
public class ResetPasswordRequest {
    private String token;
    private String password;
}
