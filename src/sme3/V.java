package sme3;

public class V {
	public void displayFuelCapacity(){
		System.out.println("parent");
	}
	//Encapsulation
	private String name;
	private int price;
	
	public void  setName(String name) {
		this.name = name;
		
	}
	public String getName() {
		return name;
	}
	public void setPrice(int price) {
		this.price = price;
	}
	public int getPrice() {
		return price;
	}
}

