package HandsOn;
import java.util.*;

public class Main {
	public static Hosteller getHostellerDetails() {
		Scanner sc = new Scanner(System.in);
		System.out.println("Enter the Details:");
		System.out.println("Student Id:");
		int studentId = sc.nextInt();
	
		System.out.println("Student Name:");
		String name = sc.next();
		System.out.println("Department Id");
		int depmtId = sc.nextInt();
		System.out.println("Gender:");
		String gender = sc.next();
		System.out.println("phone number");
		String phn = sc.next();
		System.out.println("Hostel name:");
		String hostelName = sc.next();
		System.out.println("Room number");
		int roomNum = sc.nextInt();
		
		Hosteller h = new Hosteller();
		h.setStudentId(studentId);
		h.setName(name);
		h.setDepartmentId(depmtId);
		h.setGender(gender);
		h.setPhone(phn);
		h.setHostelName(hostelName);
		h.setRoomNo(roomNum);
		System.out.println(h.getDepartmentId());
		return h;
		
		
	}

	public static void main(String[] args) {
		
		 Hosteller h = getHostellerDetails();
		 System.out.println(h.getStudentId()+" "+h.getName()+" "+h.getDepartmentId()+" "+h.getGender()+" "+h.getPhone()+" "+h.getHostelName()+" "+h.getRoomNo());
			/*
			 * StringJoiner sj = new StringJoiner(",", "[", "]");
			 * 
			 * 
			 * sj.add(h.getGender()); System.out.println(h.getGender());
			 * System.out.println("The Student Details:"); System.out.println(sj);
			 */

	}

}
