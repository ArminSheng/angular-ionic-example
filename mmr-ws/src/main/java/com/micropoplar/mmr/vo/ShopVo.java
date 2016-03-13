package com.micropoplar.mmr.vo;

import com.micropoplar.mmr.entity.CrShopShop;

public class ShopVo {

  private Integer id;
  private String name;
  private String companyName;
  private String address;
  private Integer createTime;
  private String logo;
  private Integer status;

  public ShopVo(CrShopShop shop) {
    this.id = shop.getId();
    this.name = shop.getName();
    this.companyName = shop.getCompenyname();
    this.address = shop.getAddress();
    this.createTime = shop.getCreateTime();
    this.logo = shop.getLogo();
    this.status = shop.getStatus();
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getCompanyName() {
    return companyName;
  }

  public void setCompanyName(String companyName) {
    this.companyName = companyName;
  }

  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  public Integer getCreateTime() {
    return createTime;
  }

  public void setCreateTime(Integer createTime) {
    this.createTime = createTime;
  }

  public String getLogo() {
    return logo;
  }

  public void setLogo(String logo) {
    this.logo = logo;
  }

  public Integer getStatus() {
    return status;
  }

  public void setStatus(Integer status) {
    this.status = status;
  }

}
