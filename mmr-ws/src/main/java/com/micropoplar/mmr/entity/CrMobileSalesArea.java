package com.micropoplar.mmr.entity;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the cr_mobile_sales_area database table.
 * 
 */
@Entity
@Table(name="cr_mobile_sales_area")
@NamedQuery(name="CrMobileSalesArea.findAll", query="SELECT c FROM CrMobileSalesArea c")
public class CrMobileSalesArea implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;

	private String href;

	private String path;

	private int platform;

	private int sequence;

	private String title;

	public CrMobileSalesArea() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getHref() {
		return this.href;
	}

	public void setHref(String href) {
		this.href = href;
	}

	public String getPath() {
		return this.path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public int getPlatform() {
		return this.platform;
	}

	public void setPlatform(int platform) {
		this.platform = platform;
	}

	public int getSequence() {
		return this.sequence;
	}

	public void setSequence(int sequence) {
		this.sequence = sequence;
	}

	public String getTitle() {
		return this.title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

}