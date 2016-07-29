<?php
include('config.php');
ini_set('display_errors', 1);
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
$emaildomain='@planetc.net';
$userid=$request->Username.$emaildomain;


 $sql = "SELECT * FROM `user_master` WHERE username = '$request->Username'";

$result = $db->query($sql);
$row = $result->fetch_array();




 $result->num_rows;

if($result->num_rows != 0) { 

	if(md5($request->Password) != $row['password']) { 

		echo json_encode(array('message' => 'Invalid Password'));

	} else {
		if($row['role'] == 'admin'){
			$_SESSION['user_info']['userid']		=$row['user_id'];
			$_SESSION['user_info']['username']		=$row['username'];
			$_SESSION['user_info']['role']		=$row['role'];
			echo json_encode(array('message' => 'success'));
		} else {

		}

			


// for PHRS employee who can't login AND company <> 'PHRS









	}


} else{

	$queryemp="select Emp_No from emp_master where emailid='".$userid."'";
	$result = $db->query($queryemp);
	$row = $result->fetch_array();
	if($result->num_rows != 0) { 	

			/*try {
				$base_dn = "DC=planetc, DC=net";
				$filter = "(|(mail=" . $request->Username . "))";
				if (!($connect=@ldap_connect($ldap_server))) {
					echo json_encode ( array("status"=>"fail","msg"=>"Could not connect to Ldap Server")); exit;
				}
				ldap_set_option($connect, LDAP_OPT_PROTOCOL_VERSION, 3);
				ldap_set_option($connect, LDAP_OPT_REFERRALS, 0);
				// bind to server
				
				if (!($bind=@ldap_bind($connect, $request->Username, $request->Password))) {
					echo json_encode ( array("status"=>"fail","msg"=>"Unable to bind to Server")); exit; 
					
				}

				if (!($search=@ldap_search($connect, $base_dn, $filter))) {
					 echo json_encode ( array("status"=>"fail")); exit;//die("Unable to search ldap server");echo json_encode ( array("status"=>"fail")); exit;
					 
				}
				
				$number_returned = ldap_count_entries($connect,$search);
				$info = ldap_get_entries($connect, $search);

				$name       = $info[0]["name"][0];
			   $dname      = $info[0]["displayname"][0];
			   $email      = $info[0]["mail"][0];
			   $mob        = $info[0]["mobile"][0];
			   $telphn     = $info[0]["telephonenumber"][0];
			   $department = $info[0]["department"][0];
			   $givname    = $info[0]["givenname"][0];
		   }*/

		   if ($request->Password=='123456')
		   {
		        
		        $queryempres= getEmpFullDetails($db, $userid);
	            $numrow=$queryempres->num_rows;
	            $queryemprow = $queryempres->fetch_array();
	            if ($numrow==1){
	                $_SESSION['user_info']['Emp_Name']        =$queryemprow['Emp_Name'];
	                $_SESSION['user_info']['emailid']        =$queryemprow['emailid'];
	                $_SESSION['user_info']['Emp_No']        =$queryemprow['Emp_No'];
	                $_SESSION['user_info']['sub_deptid']        =$queryemprow['sub_deptid'];
	                $_SESSION['user_info']['dept_id']        =$queryemprow['dept_id'];
	                $_SESSION['user_info']['allocation']        =$queryemprow['allocation'];
	                $_SESSION['user_info']['lev']        =$queryemprow['lev'];
	                $_SESSION['user_info']['teamid']        =$queryemprow['teamid'];
                        $_SESSION['user_info']['Emp_Post']        =$queryemprow['Emp_Post'];
                        $_SESSION['user_info']['Emp_Photo']        =$queryemprow['Emp_Photo'];
	                $_SESSION['user_info']['tl_id']        =$queryemprow['tl_id'];
	           		
	           		if($queryemprow['lev'] == 'DIR' || $queryemprow['lev'] == 'hod' || $queryemprow['lev'] == 'shead')
	    				echo json_encode(array('message' => 'success'));
	    			else{
	    				echo json_encode(array("status"=>"fail","message"=>"User must be DIR/HOD/SHEAD to login."));
	    				exit;
	    			}
	            }
	            else {echo json_encode ( array("status"=>"fail","message"=>"User Name not Registered")); exit;}
		   }
		   
		   else {echo json_encode ( array("status"=>"fail","message"=>"User Name and/or Password not match")); exit;}




	} else {
		echo json_encode(array('message' => 'Invalid User'));	
	}

	
}

