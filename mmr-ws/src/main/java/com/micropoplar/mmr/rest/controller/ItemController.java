package com.micropoplar.mmr.rest.controller;

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

}
