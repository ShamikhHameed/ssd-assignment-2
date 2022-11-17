package com.nsss.ssdassignment2backend.controller;

import com.google.gson.Gson;
import com.nsss.ssdassignment2backend.model.EncryptedTransaction;
import com.nsss.ssdassignment2backend.model.Message;
import com.nsss.ssdassignment2backend.model.User;
import com.nsss.ssdassignment2backend.reponse.MessageResponse;
import com.nsss.ssdassignment2backend.repository.MessageRepository;
import com.nsss.ssdassignment2backend.repository.UserRepository;
import com.nsss.ssdassignment2backend.request.MessageRequest;
import com.nsss.ssdassignment2backend.service.CryptoUtil;
import org.apache.tomcat.util.buf.HexUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Base64;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/access")
public class MessageController {
    @Autowired
    MessageRepository messageRepository;

    @Autowired
    UserRepository userRepository;

//    @PostMapping("/messages")
////    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('WORKER')")
//    public ResponseEntity<?> addMessage(@Valid @RequestBody MessageRequest messageRequest) {
//        Message message = new Message(
//                messageRequest.getMessage()
//        );
//
//        messageRepository.save(message);
//
//        return ResponseEntity.ok(new MessageResponse("Message saved successfully"));
//    }

    @PostMapping("/messages")
//    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('WORKER')")
    public ResponseEntity<?> addMessage(@RequestBody EncryptedTransaction encryptedTransaction) throws Exception {
        Optional<User> userOptional = userRepository.findById(encryptedTransaction.getUserId());

        User user = userOptional.get();

        String encAesKeyBase64 = encryptedTransaction.getEncAesKey();
        //decode from Base64 format
        byte[] encAesKeyBytes = Base64.getDecoder().decode(encAesKeyBase64);

        //decrypt AES key with private RSA key
        byte[] decryptedAesKeyHex =
                CryptoUtil.decryptWithPrivateRsaKey(encAesKeyBytes, user.getRsaPrivateKey());

        byte[] decryptedAesKey = HexUtils.fromHexString(new String(decryptedAesKeyHex));
        //initialization vector - 1st 16 chars of userId
        byte []iv = user.getId().substring(0,16).getBytes();

        byte[] encTransBytes = Base64.getDecoder().decode(encryptedTransaction.getPayload());

        //decrypt transaction payload with AES key
        byte[] decrypted = CryptoUtil.decryptWithAes(encTransBytes, decryptedAesKey, iv);

        //cast JSON string to Transaction object
        String stringMsg = new String(decrypted);

        Message message = new Message(stringMsg);

        messageRepository.save(message);

        return ResponseEntity.ok(new MessageResponse("Message saved successfully"));
    }
}
