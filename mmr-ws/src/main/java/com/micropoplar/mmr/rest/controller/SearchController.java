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
@RequestMapping("/c_search")
public class SearchController {

  @Autowired
  private MockData mockData;

  @RequestMapping(value = "/", method = RequestMethod.GET)
  public List<ItemVo> search(@RequestParam("s") Integer size, @RequestParam("p") Integer page,
      @RequestParam("o") Integer sort, @RequestParam("k") String keyword,
      @RequestParam(name = "c", required = false) Integer cid,
      @RequestParam(name = "g", required = false) Integer gid) {
    return mockData.findSearchResults(keyword, size, page, sort);
  }

}
