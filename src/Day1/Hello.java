package Day1;
import java.util.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Hello {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		int a=10;
		int b=20;
		a = a+b;
		b = a-b;
		a = a-b;
		if(a%2==0) {
			System.out.println("even");
		}else {System.out.println("odd");}
		System.out.println("a is"+a);
		System.out.println(b);
		//iterator in hashmap
		HashMap<Integer, String> map = new HashMap<Integer, String>();
		map.put(1,"keer");
		map.put(2, "kavya");
		map.put(3, "null");
		for(Map.Entry i:map.entrySet()) {
			System.out.println(i.getKey()+" "+i.getValue());
		}
		System.out.println();
		//iterator in arraylist
		List<String> list = new ArrayList<String>();
		list.add("z");
		list.add("kavya");
		list.add("a");
		list.add("o");
		java.util.Iterator<String> iterator = list.iterator();
		while(iterator.hasNext()) {
			System.out.println(iterator.next());
		}
		System.out.println("------------");
		//collections
		Collections.sort(list);
		System.out.println(list);
		Collections.sort(list,Collections.reverseOrder());
		System.out.println(list);
		
		


	}

}
