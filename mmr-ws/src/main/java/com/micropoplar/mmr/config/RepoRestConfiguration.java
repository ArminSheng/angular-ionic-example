package com.micropoplar.mmr.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestMvcConfiguration;

import com.micropoplar.mmr.entity.CrBanner;
import com.micropoplar.mmr.entity.CrBuyersBrand;
import com.micropoplar.mmr.entity.CrMobileSalesArea;

@Configuration
@Import(RepositoryRestMvcConfiguration.class)
public class RepoRestConfiguration extends RepositoryRestMvcConfiguration {

    @Override
    protected void configureRepositoryRestConfiguration(
            RepositoryRestConfiguration config) {
        config.exposeIdsFor(CrBanner.class);
        config.exposeIdsFor(CrMobileSalesArea.class);
        config.exposeIdsFor(CrBuyersBrand.class);
    }

}
