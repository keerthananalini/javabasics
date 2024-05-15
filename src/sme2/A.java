package sme2;

public class A {
	String name;
	public A(){
		
		System.out.println("non parameter constructor");
	}
	public A(String name){
		this();
		this.name = name;
		System.out.println("name"+name);
	}
	public String  name(String name) {
		this.name = name;
		return name;
	}
	private String phn;
	private String email;
	
	public String getPhn() {
		return phn;
		
	}
	public void setPhn(String phn) {
		this.phn = phn;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	 
	
	
}
