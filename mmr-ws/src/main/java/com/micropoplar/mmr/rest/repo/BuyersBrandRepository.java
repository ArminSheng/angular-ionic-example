package com.micropoplar.mmr.rest.repo;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.micropoplar.mmr.entity.CrBuyersBrand;

@RepositoryRestResource(collectionResourceRel = "data", path = "brand")
public interface BuyersBrandRepository extends
        PagingAndSortingRepository<CrBuyersBrand, Integer> {

}
