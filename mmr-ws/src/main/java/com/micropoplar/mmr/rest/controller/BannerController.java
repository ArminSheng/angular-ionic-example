package com.micropoplar.mmr.rest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.micropoplar.mmr.entity.CrBanner;
import com.micropoplar.mmr.rest.repo.BannerRepository;

@RestController
@RequestMapping("/c_banner")
public class BannerController {

    @Autowired
    private BannerRepository bannerRepo;

    @RequestMapping(value = "/platform", method = RequestMethod.GET)
    public List<CrBanner> banners(@RequestParam("p") Integer platform) {
        return bannerRepo.findByPlatform(platform);
    }

}
