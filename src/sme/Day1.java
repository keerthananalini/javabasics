package sme;

public abstract class Day1 {
	String name;;
	public abstract void names();
		
		public  String Day1(String name) {
			this.name = name;
			System.out.println("name is :"+name);
			return name;
		}
		public void name(String name) {
			System.out.println("name is :"+name);
		}
		public static void main (String[] args) {
			
			//Day1("k");
			//name("h");
		}
		//encapsulation
		private String clg;
		public String getClg() {
			return clg;
		}
		public void setClg(String clg) {
			this.clg = clg;
			
		}
		

}
