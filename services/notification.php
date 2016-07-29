<?php
include('config.php');
ini_set('display_errors', 1);



$id = isset($_SESSION['user_info']['userid']) ? $_SESSION['user_info']['userid'] : $_SESSION['user_info']['Emp_No'];

$created = array();
$created_count = 0;

$assigned = array();
$assigned_count = 0;

$qry = "SELECT *  FROM `task_detail` WHERE `notification` LIKE 'sent' AND `read_by_assignee` = 0 AND task_status='Waiting' and assign_to = '$id'";

$res = $db->query($qry);
$i =0;
while($row = $res->fetch_array()){
	if($row['notification'] == '') continue;
$assigned[$i]['task_id'] = $row['task_id'];
$assigned[$i]['task_subject'] = $row['task_subject'];
$emp_query = "select Emp_Name from emp_master where Emp_No = '".$row['updateby']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();
        $assigned[$i]['updateby'] = $emp_row['Emp_Name'];


$i++;
$assigned_count++;
}


$qry = "SELECT *  FROM `task_detail` WHERE read_by_creator = 0 and updateby = '$id'";

$res = $db->query($qry);
$i =0;
while($row = $res->fetch_array()){
	if($row['notification'] == '') continue;
$created[$i]['task_id'] = $row['task_id'];
$created[$i]['task_subject'] = $row['task_subject'];
$emp_query = "select Emp_Name from emp_master where Emp_No = '".$row['assign_to']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();
        $created[$i]['assign_to'] = $emp_row['Emp_Name'];
        $created[$i]['status'] = ($row['notification'] == 'sent') ? 'Not Accepted' : 'Accepted';
        if($row['notification'] == 'accepted' && $row['read_by_creator'] == 0) {
$db->query("update task_detail set read_by_creator = 1 where task_id = '".$row['task_id']."'");
}
$i++;
$created_count++;
}

echo json_encode(array('created' => $created, 
					   'assigned' => $assigned,
					   'created_count' => $created_count,
					   'assigned_count' => $assigned_count));

