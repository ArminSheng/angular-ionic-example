package com.micropoplar.mmr.entity;

import java.io.Serializable;
import javax.persistence.*;


/**
 * The persistent class for the cr_shop_shop database table.
 * 
 */
@Entity
@Table(name="cr_shop_shop")
@NamedQuery(name="CrShopShop.findAll", query="SELECT c FROM CrShopShop c")
public class CrShopShop implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private int id;

	private String account;

	private String address;

	private String attachments;

	private String bank;

	@Lob
	private String brand;

	@Column(name="check_time")
	private String checkTime;

	@Lob
	@Column(name="comment_a")
	private String commentA;

	@Lob
	@Column(name="comment_s")
	private String commentS;

	private String compenyname;

	@Lob
	private String contract;

	@Lob
	@Column(name="contract_field")
	private String contractField;

	@Column(name="create_time")
	private int createTime;

	private String credentials;

	private String dian;

	@Column(name="ec_salt")
	private String ecSalt;

	private String email;

	private String images;

	@Column(name="images_address")
	private String imagesAddress;

	@Column(name="images_sort")
	private String imagesSort;

	@Column(name="info_time")
	private String infoTime;

	private String license;

	private String logo;

	private String louplet;

	private String name;

	private String opwd;

	private String password;

	private String phone;

	private String qualifications;

	private String rules;

	private int status;

	@Column(name="supplier_type")
	private int supplierType;

	public CrShopShop() {
	}

	public int getId() {
		return this.id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getAccount() {
		return this.account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getAttachments() {
		return this.attachments;
	}

	public void setAttachments(String attachments) {
		this.attachments = attachments;
	}

	public String getBank() {
		return this.bank;
	}

	public void setBank(String bank) {
		this.bank = bank;
	}

	public String getBrand() {
		return this.brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getCheckTime() {
		return this.checkTime;
	}

	public void setCheckTime(String checkTime) {
		this.checkTime = checkTime;
	}

	public String getCommentA() {
		return this.commentA;
	}

	public void setCommentA(String commentA) {
		this.commentA = commentA;
	}

	public String getCommentS() {
		return this.commentS;
	}

	public void setCommentS(String commentS) {
		this.commentS = commentS;
	}

	public String getCompenyname() {
		return this.compenyname;
	}

	public void setCompenyname(String compenyname) {
		this.compenyname = compenyname;
	}

	public String getContract() {
		return this.contract;
	}

	public void setContract(String contract) {
		this.contract = contract;
	}

	public String getContractField() {
		return this.contractField;
	}

	public void setContractField(String contractField) {
		this.contractField = contractField;
	}

	public int getCreateTime() {
		return this.createTime;
	}

	public void setCreateTime(int createTime) {
		this.createTime = createTime;
	}

	public String getCredentials() {
		return this.credentials;
	}

	public void setCredentials(String credentials) {
		this.credentials = credentials;
	}

	public String getDian() {
		return this.dian;
	}

	public void setDian(String dian) {
		this.dian = dian;
	}

	public String getEcSalt() {
		return this.ecSalt;
	}

	public void setEcSalt(String ecSalt) {
		this.ecSalt = ecSalt;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getImages() {
		return this.images;
	}

	public void setImages(String images) {
		this.images = images;
	}

	public String getImagesAddress() {
		return this.imagesAddress;
	}

	public void setImagesAddress(String imagesAddress) {
		this.imagesAddress = imagesAddress;
	}

	public String getImagesSort() {
		return this.imagesSort;
	}

	public void setImagesSort(String imagesSort) {
		this.imagesSort = imagesSort;
	}

	public String getInfoTime() {
		return this.infoTime;
	}

	public void setInfoTime(String infoTime) {
		this.infoTime = infoTime;
	}

	public String getLicense() {
		return this.license;
	}

	public void setLicense(String license) {
		this.license = license;
	}

	public String getLogo() {
		return this.logo;
	}

	public void setLogo(String logo) {
		this.logo = logo;
	}

	public String getLouplet() {
		return this.louplet;
	}

	public void setLouplet(String louplet) {
		this.louplet = louplet;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getOpwd() {
		return this.opwd;
	}

	public void setOpwd(String opwd) {
		this.opwd = opwd;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhone() {
		return this.phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getQualifications() {
		return this.qualifications;
	}

	public void setQualifications(String qualifications) {
		this.qualifications = qualifications;
	}

	public String getRules() {
		return this.rules;
	}

	public void setRules(String rules) {
		this.rules = rules;
	}

	public int getStatus() {
		return this.status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public int getSupplierType() {
		return this.supplierType;
	}

	public void setSupplierType(int supplierType) {
		this.supplierType = supplierType;
	}

}