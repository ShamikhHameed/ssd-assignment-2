package com.nsss.ssdassignment2backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.persistence.Lob;

@Document(collection = "files")
public class File {
    @Id
    private String id;
    private String name;
    private String type;
    @Lob
    private byte[] file;

    public File(String name, String type, byte[] file) {
        this.name = name;
        this.type = type;
        this.file = file;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getFile() {
        return file;
    }

    public void setFile(byte[] file) {
        this.file = file;
    }
}
