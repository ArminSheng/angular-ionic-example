package com.micropoplar.mmr.rest.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.micropoplar.mmr.entity.CrShopShop;
import com.micropoplar.mmr.rest.repo.ShopRepository;
import com.micropoplar.mmr.util.RepositoryUtils;
import com.micropoplar.mmr.vo.ShopVo;

@RestController
@RequestMapping("/c_shop")
public class ShopController {

  @Autowired
  private ShopRepository shopRepo;

  @RequestMapping(value = "/single", method = RequestMethod.GET)
  @ResponseBody
  public ShopVo single(@RequestParam("id") Integer id) {
    return new ShopVo(shopRepo.findOne(id));
  }

  @RequestMapping(value = "/all", method = RequestMethod.GET)
  @ResponseBody
  public List<ShopVo> all() {
    List<CrShopShop> shops = RepositoryUtils.iterableToList(shopRepo.findAll());
    return shops.stream().map(ShopVo::new).collect(Collectors.toList());
  }

}
