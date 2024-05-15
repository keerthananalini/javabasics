package sme;

public class Inheritance extends Day1{
	Inheritance(){
		this("k");
		
	}
	Inheritance(String name){
		super();
		System.out.println(name);
	}
	public void names( ) {
		System.out.println(name);
	}
	public void name(String name) {
		System.out.println("child"+name);
	}
	
	public String Inheritance(String name) {
		//super();
		
		System.out.println("constructor of inheritance class");
		
		return name;
	}
}
