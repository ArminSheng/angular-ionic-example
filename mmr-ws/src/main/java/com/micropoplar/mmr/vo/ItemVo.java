package com.micropoplar.mmr.vo;

import java.util.Date;

public class ItemVo {

    private int id;
    private int type;
    private String title;
    private String brand;
    private String imagePath;
    private double oprice;
    private double cprice;
    private String unitName;
    private Date deadline; // only exists for seckilling item

    public ItemVo() {

    }

    public ItemVo(int id, int type, String title, String brand,
            String imagePath, double oprice, double cprice, String unitName,
            Date deadline) {
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
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
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

    public int getId() {
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

}
