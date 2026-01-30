package org.studyeasy._9springreact.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600, allowedHeaders = "*")
public class HomeController {

    @GetMapping("/api/v1")
    public String done(){
        return "Hello World!";
    }

}
