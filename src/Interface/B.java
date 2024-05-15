package Interface;

public class B implements A{
//	public String s;
	public void display (String s) {
	//	this.s=s;
		System.out.println(s);
	}
	public void add(int a,int b,int c) {
		System.out.println( a+b+c);
	}
	public void mul(int a,int b,int c) {
		System.out.println( a*b*c);
	}
	public void avg(int a,int b,int c) {
		System.out.println( (a+b+c)/3);
	}
	public void largest(int a,int b,int c) {
		if((a>b)&&(a>c)){
			System.out.println("a is largest");
		}
		else if((b>a)&&(b>c)){
			System.out.println("b is largest");

		}
		else {
			System.out.println("c is largest");

		}
		
	}

}
