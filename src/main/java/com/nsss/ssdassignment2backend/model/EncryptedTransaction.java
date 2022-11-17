package com.nsss.ssdassignment2backend.model;

public class EncryptedTransaction {
    private String userId;
    private String payload;
    private String encAesKey;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public String getEncAesKey() {
        return encAesKey;
    }

    public void setEncAesKey(String encAesKey) {
        this.encAesKey = encAesKey;
    }
}
