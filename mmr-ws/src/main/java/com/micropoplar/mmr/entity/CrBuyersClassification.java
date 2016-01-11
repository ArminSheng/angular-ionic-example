package com.micropoplar.mmr.entity;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the cr_buyers_classification database table.
 * 
 */
@Entity
@Table(name="cr_buyers_classification")
@NamedQuery(name="CrBuyersClassification.findAll", query="SELECT c FROM CrBuyersClassification c")
public class CrBuyersClassification implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;

	private int gen;

	private int gid;

	private String logo;

	private String name;

	private int sort;

	private int time;

	public CrBuyersClassification() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getGen() {
		return this.gen;
	}

	public void setGen(int gen) {
		this.gen = gen;
	}

	public int getGid() {
		return this.gid;
	}

	public void setGid(int gid) {
		this.gid = gid;
	}

	public String getLogo() {
		return this.logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getSort() {
		return this.sort;
	}

	public void setSort(int sort) {
		this.sort = sort;
	}

	public int getTime() {
		return this.time;
	}

	public void setTime(int time) {
		this.time = time;
	}

}