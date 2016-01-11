package com.micropoplar.mmr.rest.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.micropoplar.mmr.entity.CrBuyersClassification;
import com.micropoplar.mmr.rest.repo.BuyersClassificationRepository;

@RestController
@RequestMapping("/c_classification")
public class BuyersClassificationController {

    @Autowired
    private BuyersClassificationRepository classificationRepo;

    @RequestMapping(value = "/gen", method = RequestMethod.GET)
    public List<CrBuyersClassification> gen(
            @RequestParam(name = "g", required = false) Integer gen) {
        if (gen == null) {
            gen = 0;
        }
        return classificationRepo.findByGenOrderBySort(gen);
    }

}
