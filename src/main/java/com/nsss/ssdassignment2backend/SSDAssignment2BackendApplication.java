package com.nsss.ssdassignment2backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class })
public class SSDAssignment2BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(SSDAssignment2BackendApplication.class, args);
	}

}
