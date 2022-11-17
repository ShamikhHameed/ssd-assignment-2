package com.nsss.ssdassignment2backend.repository;

import com.nsss.ssdassignment2backend.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageRepository extends MongoRepository<Message, String> {
}
