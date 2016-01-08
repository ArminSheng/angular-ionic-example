package com.micropoplar.mmr.vo;

import java.util.Date;

public class ItemVo {

    private Integer id;
    private Integer type;
    private String title;
    private String brand;
    private String imagePath;
    private Double oprice;
    private Double cprice;
    private String unitName;
    private Date deadline; // only exists for seckilling item
    private Integer salesAmount;

    public ItemVo() {

    }

    public ItemVo(Integer id, Integer type, String title, String brand,
            String imagePath, double oprice, double cprice, String unitName,
            Date deadline, Integer salesAmount) {
        super();
        this.id = id;
        this.type = type;
        this.title = title;
        this.brand = brand;
        this.imagePath = imagePath;
        this.oprice = oprice;
        this.cprice = cprice;
        this.unitName = unitName;
        this.deadline = deadline;
        this.salesAmount = salesAmount;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public double getOprice() {
        return oprice;
    }

    public void setOprice(double oprice) {
        this.oprice = oprice;
    }

    public double getCprice() {
        return cprice;
    }

    public void setCprice(double cprice) {
        this.cprice = cprice;
    }

    public String getUnitName() {
        return unitName;
    }

    public void setUnitName(String unitName) {
        this.unitName = unitName;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public Integer getId() {
        return id;
    }

    public String getImagePath() {
        return imagePath;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public Integer getSalesAmount() {
        return salesAmount;
    }

    public void setSalesAmount(Integer salesAmount) {
        this.salesAmount = salesAmount;
    }

}
