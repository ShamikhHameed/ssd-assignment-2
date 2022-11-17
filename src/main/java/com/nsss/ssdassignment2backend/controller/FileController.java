package com.nsss.ssdassignment2backend.controller;

import com.github.javafaker.Faker;
import com.nsss.ssdassignment2backend.model.EncryptedTransaction;
import com.nsss.ssdassignment2backend.model.File;
import com.nsss.ssdassignment2backend.model.User;
import com.nsss.ssdassignment2backend.reponse.MessageResponse;
import com.nsss.ssdassignment2backend.repository.FileRepository;
import com.nsss.ssdassignment2backend.repository.UserRepository;
import com.nsss.ssdassignment2backend.service.CryptoUtil;
import org.apache.tika.Tika;
import org.apache.tomcat.util.buf.HexUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLConnection;
import java.util.Base64;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/access")
public class FileController {
    @Autowired
    FileRepository fileRepository;

    @Autowired
    UserRepository userRepository;

//    @PostMapping("/files")
////    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
//    public ResponseEntity<?> addFile(@RequestParam("file") MultipartFile multipartFile) throws IOException {
//        String fileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());
//        File file = new File(fileName, multipartFile.getContentType(), multipartFile.getBytes());
//
//        fileRepository.save(file);
//
//        return ResponseEntity.ok(new MessageResponse("File added successfully"));
//    }

    @PostMapping("/files")
//    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> addFile(@RequestBody EncryptedTransaction encryptedTransaction) throws Exception {
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

        Tika tika = new Tika();
        Faker faker = new Faker();

        String randomFileName = faker.name().firstName();

        File file = new File(randomFileName, tika.detect(decrypted), decrypted);

        fileRepository.save(file);

        return ResponseEntity.ok(new MessageResponse("File added successfully"));
    }
}
