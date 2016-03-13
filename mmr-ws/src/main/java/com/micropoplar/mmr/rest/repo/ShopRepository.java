package com.micropoplar.mmr.rest.repo;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.micropoplar.mmr.entity.CrShopShop;

@RepositoryRestResource(collectionResourceRel = "data", path = "shop")
public interface ShopRepository extends PagingAndSortingRepository<CrShopShop, Integer> {

}
