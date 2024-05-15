package sme2;

public class B extends A{
	public B () {
		super();
	 String a= super.name;
	 System.out.println(a);
	}
	@Override
	public String name(String name) {
		this.name = name;
		System.out.println("this is from child class");
		return name;
	}
	protected String clg;
	public String getClg() {
		return clg;
	}
	public void setClg(String clg) {
		this.clg = clg;
	}
}
