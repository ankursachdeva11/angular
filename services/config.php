<?php
@session_start();
date_default_timezone_set("Asia/Kolkata");

$db = new mysqli('localhost', 'sachdqyz_main', 'napster311', 'sachdqyz_angs');

if($db->connect_errno > 0){
    die('Unable to connect to database [' . $db->connect_error . ']');
}


function getEmpDetails($db, $emp_no) {
	$queryemp = "SELECT * from emp_master where Emp_No = '$emp_no'";
		        $queryempres= $db->query($queryemp);
	            $queryemprow = $queryempres->fetch_array();
	            return $queryemprow;
}

function getEmpFullDetails($db, $emailid) {
	$queryemp = "SELECT em.emailid,em.Emp_No,em.Emp_Name,em.emp_des, em.Emp_Photo, em.sub_deptid,sdp.sub_dept_name,sdp.dept_id,em.doj,em.Emp_Post,em.allocation 
				 , GROUP_CONCAT(id) AS teamid,     GROUP_CONCAT(DISTINCT dept_superier)as dept_mgr ,    GROUP_CONCAT(distinct dept_name),  GROUP_CONCAT(distinct head_empid) as tl_id 

				, IF (em.allocation=0 AND LEVEL='dir','DIR', 
				    IF (em.allocation=0 AND GROUP_CONCAT(DISTINCT dept_name)<>'','hod', 
				        IF (em.allocation=0 AND GROUP_CONCAT(DISTINCT dept_superier)<>'','shead', 
				            IF (em.allocation=0 AND GROUP_CONCAT(DISTINCT head_empid)<>'','tlead', 
				                IF (em.allocation<>0 AND level=1,'core_team','core'))))) AS lev 
				FROM emp_master em 
				LEFT JOIN emp_allocation ON head_empid=em.emp_no 
				LEFT JOIN subdept sdp ON dept_superier=em.emp_no 
				LEFT JOIN department ON dept_headempid=em.emp_no 
				WHERE emailid='$emailid' AND STATUS='A' GROUP BY head_empid";
		        $queryempres= $db->query($queryemp);
	            
	            return $queryempres;
}
?>