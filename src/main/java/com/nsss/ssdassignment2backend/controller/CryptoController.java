package com.nsss.ssdassignment2backend.controller;

import com.nsss.ssdassignment2backend.model.User;
import com.nsss.ssdassignment2backend.repository.UserRepository;
import com.nsss.ssdassignment2backend.service.CryptoUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.security.KeyPair;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/access")
public class CryptoController {
    @Autowired
    UserRepository userRepository;

    @CrossOrigin
    @GetMapping(path = "/publickey")
    public @ResponseBody
    User getPublicKey(@RequestParam(value = "userId") String id) throws Exception {
//        User user = userService.getUser(userId);
        Optional<User> userOptional = userRepository.findById(id);

        User user = userOptional.get();

        //server generates RSA key pair - public and private keys
        generateRsaKeyPair(user);

        userRepository.save(user);

        user.setRsaPrivateKey("");

        //to simplify our example, User object is returned with generated RSA public key
        //RSA private key is not included in response because it should be kept as secret
        return user;
    }

    private void generateRsaKeyPair(User user) throws NoSuchAlgorithmException {
        KeyPair keyPair = CryptoUtil.generateRsaKeyPair();

        byte[] publicKey = keyPair.getPublic().getEncoded();
        byte[] privateKey = keyPair.getPrivate().getEncoded();

        //encoding keys to Base64 text format so that we can send public key via REST API
        String rsaPublicKeyBase64 = new String(Base64.getEncoder().encode(publicKey));
        String rsaPrivateKeyBase64 = new String(Base64.getEncoder().encode(privateKey));

        //saving keys to user object for later use
        user.setRsaPublicKey(rsaPublicKeyBase64);
        user.setRsaPrivateKey(rsaPrivateKeyBase64);
    }
}
