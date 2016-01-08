package com.micropoplar.mmr.rest.controller;

import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.micropoplar.mmr.mock.MockData;
import com.micropoplar.mmr.vo.ItemVo;

@RestController
@RequestMapping("/c_item")
public class ItemController {

    @Autowired
    private MockData mockData;

    @RequestMapping(value = "/seckilling", method = RequestMethod.GET)
    public List<ItemVo> seckilling(@RequestParam("s") Integer size) {
        return mockData.findSeckilling(size);
    }

    @RequestMapping(value = "/homeCommodity", method = RequestMethod.GET)
    public List<List<ItemVo>> homeCommodity(@RequestParam("s") Integer size) {
        List<List<ItemVo>> results = new LinkedList<List<ItemVo>>();

        for (int i = 1; i <= 5; i++) {
            results.add(mockData.findItems(1, size));
            results.add(mockData.findItems(2, size));
            results.add(mockData.findItems(3, size));
            results.add(mockData.findItems(4, size));
            results.add(mockData.findItems(5, size));
        }

        return results;
    }

    @RequestMapping(value = "/recommend", method = RequestMethod.GET)
    public List<ItemVo> recommend(@RequestParam("s") Integer size) {
        return mockData.findRecommend(size);
    }

}
