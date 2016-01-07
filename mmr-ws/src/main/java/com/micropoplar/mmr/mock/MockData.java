package com.micropoplar.mmr.mock;

import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.micropoplar.mmr.vo.ItemVo;

/**
 * For testing.
 * 
 * @author Destiny
 *
 */

@Service
public class MockData {

    public List<ItemVo> findItems(Integer type, Integer size) {
        List<ItemVo> results = new LinkedList<ItemVo>();

        String typeStr = "";
        switch (type) {
        case 1:
            typeStr = "鸡翅";
            break;
        case 2:
            typeStr = "牛肉";
            break;
        case 3:
            typeStr = "螃蟹";
            break;
        case 4:
            typeStr = "熟食";
            break;
        case 5:
            typeStr = "腌制食品";
            break;
        }

        for (int i = 0; i < size; i++) {
            results.add(new ItemVo(i + 1, type, typeStr + i,
                    "img/item/sample.png", 122.0, 88.8, "箱", null));
        }

        return results;
    }

    public List<ItemVo> findSeckilling(Integer size) {
        List<ItemVo> results = new LinkedList<ItemVo>();

        Date now = new Date();
        Date next = new Date(now.getTime() + 360000000);

        for (int i = 0; i < size; i++) {
            results.add(new ItemVo(i + 1, 1, "鸡翅" + i, "img/item/sample.png",
                    12.0, 8.8, "箱", next));
        }

        return results;
    }
}
