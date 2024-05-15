package sme3;
import java.util.*;
public class Main {

public static V getDetails() 
{
	Scanner sc =new Scanner (System.in);
	V v=new V();
	String name = sc.next();
	int price = sc.nextInt();
	v.setName(name);
	v.setPrice(price);
	return v;
	
}
	public static void main (String[] args) {
		V m = new Motor();
		V v = new V();
		m.displayFuelCapacity();
		V vn = getDetails();
		System.out.println(vn.getName()+vn.getPrice());
		//palindrome
		String s = "march";
		System.out.println(s.length());
		for(int i=s.length()-1;i>=0;i--) {
			System.out.println(s.charAt(i));

		}
	}
	

}
