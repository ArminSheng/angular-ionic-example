package com.micropoplar.mmr.entity;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the cr_buyers_brand database table.
 * 
 */
@Entity
@Table(name="cr_buyers_brand")
@NamedQuery(name="CrBuyersBrand.findAll", query="SELECT c FROM CrBuyersBrand c")
public class CrBuyersBrand implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;

	@Lob
	@Column(name="class")
	private String class_;

	private String logo;

	private String name;

	private String url;

	public CrBuyersBrand() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getClass_() {
		return this.class_;
	}

	public void setClass_(String class_) {
		this.class_ = class_;
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

	public String getUrl() {
		return this.url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

}