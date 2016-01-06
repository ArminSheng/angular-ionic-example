package com.micropoplar.mmr.rest.repo;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.micropoplar.mmr.entity.CrMobileSalesArea;

@RepositoryRestResource(collectionResourceRel = "data", path = "salesarea")
public interface SalesAreaRepository extends
        PagingAndSortingRepository<CrMobileSalesArea, Integer> {

    @Query(value = "select * from cr_mobile_sales_area where platform = ?1 order by sequence asc limit 2", nativeQuery = true)
    List<CrMobileSalesArea> findByPlatform(int platform);

}
