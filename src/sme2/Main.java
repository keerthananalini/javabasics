package sme2;

public class Main {
	public static void main(String[] args) {
		A a = new B();
		A aa = new A("k");
		a.name("h");
		a.setPhn("9876543210");
		a.setEmail("abs@gmail.com");
		System.out.println(a.getPhn());
		System.out.println(a.getEmail());
	}

}
