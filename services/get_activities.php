<?php
include('config.php');
ini_set('display_errors', 1);



$task_id = $_REQUEST['task_id'];

$sql = "select * from task_detail_archive where main_task_id = '$task_id' order by task_id desc";

$res = $db->query($sql);

$act = array();
$i = 0;
while($row = $res->fetch_array()){

	$activities = unserialize($row['activities']);
	$date = $row['task_last_modify'];
	$emp = getEmpDetails($db, $row['updateby']);
	foreach ($activities as $value) {
		
		$act[$i]['thing'] = $value[0];
		$act[$i]['name'] = $emp['Emp_Name'];
		$act[$i]['date'] = $date;
		$act[$i]['old'] = $value[2];
		$act[$i]['new'] = $value[1];
		$i++;
	}
}

echo json_encode($act);