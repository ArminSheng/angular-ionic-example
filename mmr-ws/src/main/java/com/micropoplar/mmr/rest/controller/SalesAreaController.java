package com.micropoplar.mmr.rest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.micropoplar.mmr.entity.CrMobileSalesArea;
import com.micropoplar.mmr.rest.repo.SalesAreaRepository;

@RestController
@RequestMapping("/c_salesarea")
public class SalesAreaController {

    @Autowired
    private SalesAreaRepository salesAreaRepo;

    @RequestMapping(value = "/platform", method = RequestMethod.GET)
    public List<CrMobileSalesArea> salesArea(@RequestParam("p") Integer platform) {
        return salesAreaRepo.findByPlatform(platform);
    }

}
