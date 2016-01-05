package com.micropoplar.mmr.rest.repo;

import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.micropoplar.mmr.entity.CrBanner;

@RepositoryRestResource(collectionResourceRel = "data", path = "banner")
public interface BannerRepository extends
        PagingAndSortingRepository<CrBanner, Integer> {

    @Query(value = "select * from cr_banner where platform = ?1 order by sequence asc", nativeQuery = true)
    List<CrBanner> findByPlatform(int platform);

}
