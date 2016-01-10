package com.micropoplar.mmr.rest.controller;

import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.micropoplar.mmr.entity.CrBuyersAttribute;
import com.micropoplar.mmr.rest.repo.BuyersAttributeRepository;

@RestController
@RequestMapping("/c_attribute")
public class BuyersAttributeController {

    @Autowired
    private BuyersAttributeRepository attributeRepo;

    @RequestMapping(value = "/all", method = RequestMethod.GET)
    public List<CrBuyersAttribute> brands() {
        Iterable<CrBuyersAttribute> allAttributes = attributeRepo.findAll();

        List<CrBuyersAttribute> results = new LinkedList<CrBuyersAttribute>();
        for (CrBuyersAttribute brand : allAttributes) {
            results.add(brand);
        }

        return results;
    }

}
