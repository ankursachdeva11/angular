<?php
include('config.php');
ini_set('display_errors', 1);



$qry = "SELECT * FROM `subdept`";
if($_SESSION['user_info']['lev'] == 'hod') {
	$qry .= " where dept_id = ".$_SESSION['user_info']['dept_id'];
}

$res = $db->query($qry);
$subdept = array();
$i = 0;
while($row = $res->fetch_array()) {
	$subdept[$i]['id'] = $row['sub_deptid'];
	$subdept[$i]['name'] = $row['sub_dept_name'];
	$subdept[$i]['parent'] = $row['dept_id'];
	$i++;
}


$qry = "SELECT * FROM `department`";
$res = $db->query($qry);
$dept = array();
$i = 0;
while($row = $res->fetch_array()) {
	$dept[$i]['id'] = $row['dept_id'];
	$dept[$i]['name'] = $row['dept_name'];
	$i++;
}

echo json_encode(array('subdept' => $subdept, 'dept' => $dept));