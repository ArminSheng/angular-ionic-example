package com.micropoplar.mmr.rest.repo;

import java.util.List;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.micropoplar.mmr.entity.CrBuyersClassification;

@RepositoryRestResource(collectionResourceRel = "data", path = "classification")
public interface BuyersClassificationRepository
    extends PagingAndSortingRepository<CrBuyersClassification, Integer> {

  List<CrBuyersClassification> findByGenAndGidOrderBySort(Integer gen, Integer gid);

  List<CrBuyersClassification> findByGenAndGidAndIdOrderBySort(Integer gen, Integer gid,
      Integer id);

}
