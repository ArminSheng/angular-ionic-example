package com.micropoplar.mmr.rest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.micropoplar.mmr.mock.MockData;
import com.micropoplar.mmr.vo.OrderVo;

@RestController
@RequestMapping("/c_order")
public class OrderController {

  private static int sequence = 1;

  @Autowired
  private MockData mock;

  @RequestMapping(value = "/generate", method = RequestMethod.POST)
  @ResponseBody
  public OrderVo generate() throws InterruptedException {
    Thread.sleep(2000);
    return mock.generateOrder("MMR" + (sequence++));
  }

}
