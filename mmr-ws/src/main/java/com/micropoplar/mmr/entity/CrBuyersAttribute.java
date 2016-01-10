package com.micropoplar.mmr.entity;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the cr_buyers_attributes database table.
 * 
 */
@Entity
@Table(name="cr_buyers_attributes")
@NamedQuery(name="CrBuyersAttribute.findAll", query="SELECT c FROM CrBuyersAttribute c")
public class CrBuyersAttribute implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private int id;

	private String name;

	public CrBuyersAttribute() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

}