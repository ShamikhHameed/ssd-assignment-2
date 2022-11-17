package com.nsss.ssdassignment2backend.model;

import org.springframework.web.multipart.MultipartFile;

import javax.persistence.Lob;

public class EncryptedFileTransaction {
    private String userId;
    private String filename;
    private String filetype;
    @Lob
    private byte[] data;
    private String encAesKey;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getFiletype() {
        return filetype;
    }

    public void setFiletype(String filetype) {
        this.filetype = filetype;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public String getEncAesKey() {
        return encAesKey;
    }

    public void setEncAesKey(String encAesKey) {
        this.encAesKey = encAesKey;
    }
}
