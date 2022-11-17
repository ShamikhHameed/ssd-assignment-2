package com.nsss.ssdassignment2backend.repository;

import com.nsss.ssdassignment2backend.model.File;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface FileRepository extends MongoRepository<File, String> {
}
