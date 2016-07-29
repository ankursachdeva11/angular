<?php
include('config.php');
ini_set('display_errors', 1);

$task_id = $_REQUEST['task_id'];

$update = $db->query("update task_detail set read_by_assignee = 1, notification = 'accepted', task_status = 'Pending' where task_id = '".$task_id."'");


if($update){
	echo json_encode(array('msg' => 'success'));
}