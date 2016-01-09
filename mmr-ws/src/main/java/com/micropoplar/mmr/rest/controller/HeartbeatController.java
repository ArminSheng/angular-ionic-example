package com.micropoplar.mmr.rest.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/c_heartbeat")
public class HeartbeatController {

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public Boolean heartbeat() {
        return true;
    }

}
