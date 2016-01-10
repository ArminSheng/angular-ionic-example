package com.micropoplar.mmr.rest.repo;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.micropoplar.mmr.entity.CrBuyersAttribute;

@RepositoryRestResource(collectionResourceRel = "data", path = "attribute")
public interface BuyersAttributeRepository extends
        PagingAndSortingRepository<CrBuyersAttribute, Integer> {

}
