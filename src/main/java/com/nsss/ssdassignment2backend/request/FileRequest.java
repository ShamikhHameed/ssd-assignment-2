package com.nsss.ssdassignment2backend.request;

import javax.persistence.Lob;

public class FileRequest {
    @Lob
    private byte[] file;

    public FileRequest() {
    }

    public FileRequest(byte[] file) {
        this.file = file;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }
}
