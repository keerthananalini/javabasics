package Day1;

import java.util.ArrayList;
import java.util.Collections;

public class Iterator {
	public static void main (String[] args) {
		ArrayList<String> s = new ArrayList<String>();
		s.add("keer");
		s.add("kavya");
		s.add("bobby");
		Collections.sort(s);
		Iterator iterator = (Iterator) s.iterator();
		while(((java.util.Iterator<String>) iterator).hasNext()) {
			System.out.println(((java.util.Iterator<String>) iterator).next());
		}
		
		
	}
}
