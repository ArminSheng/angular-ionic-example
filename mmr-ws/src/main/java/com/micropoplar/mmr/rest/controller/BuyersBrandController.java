package com.micropoplar.mmr.rest.controller;

import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.micropoplar.mmr.entity.CrBuyersBrand;
import com.micropoplar.mmr.rest.repo.BuyersBrandRepository;

@RestController
@RequestMapping("/c_brand")
public class BuyersBrandController {

    @Autowired
    private BuyersBrandRepository brandRepo;

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public List<CrBuyersBrand> brands() {
        Iterable<CrBuyersBrand> allBrands = brandRepo.findAll();

        List<CrBuyersBrand> results = new LinkedList<CrBuyersBrand>();
        for (CrBuyersBrand brand : allBrands) {
            results.add(brand);
        }

        return results;
    }

}
