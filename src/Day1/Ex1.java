package Day1;
import java.util.*;
public class Ex1 {
    // Access element
    public static void main(String[] args)
    {
    	ArrayList<String> al=new ArrayList<>();
    	al.add("arun");
    	al.add("arvindh");
    	System.out.println("ArrayList with two strings:" +al);
    	System.out.println("First element of the ArrayList:"+al.get(0));
    	al.remove(0);
    	System.out.println("First element removed:" +al);
    	al.set(0,"code");
    	System.out.println("First element changed to :" +al.get(0));
    	System.out.println("Size "+al.size());
    	
    	Map<String,Integer> map = new HashMap<>();
    	Scanner sc = new Scanner(System.in);
    	System.out.println("map");
    	int n= sc.nextInt();
    	for (int i=1;i<n;i++) {
    		String s= sc.next();
    		int g = sc.nextInt();
    		map.put(s,g);
    		System.out.println(map.get(i));
    	}
    	
}

}
