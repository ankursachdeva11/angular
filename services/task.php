<?php
include('config.php');
ini_set('display_errors', 1);
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);

$task_id = isset($request->task_id) ? $request->task_id : 0;
$task_subject = $request->task_subject;
$task_description = $request->task_description;
$remark = isset($request->remark) ? $request->remark:'';
$task_status = isset($request->task_id) ? $request->task_status : 'Waiting';

$task_nature = $request->task_nature;
$task_issue = isset($request->task_issue) ? $request->task_issue : '';
$assign_to = isset($request->assignee_child) ? $request->assignee_child : $request->assign_to;
$assignee_parent = isset($request->assignee_child) ? $request->assign_to : '';
$legal = (isset($request->legal) && $request->legal == true) ? 'Y' : 'N';
$task_amount = isset($request->task_amount) ? $request->task_amount: '';
//$task_amount = isset($request->task_amount) ? $request->task_amount . '00000' : '';

if($task_subject == '' || $task_nature == '' || $task_status == '' || $assign_to == ''){
	echo json_encode(array('message' => 'error'));
	exit(0);
}
$task_due_date = date('Y-m-d H:i:s',strtotime($request->task_due_date));
$id = isset($_SESSION['user_info']['userid']) ? $_SESSION['user_info']['userid'] : $_SESSION['user_info']['Emp_No'];
if($task_id == 0){

$sql = "insert into task_detail(task_subject,task_description,task_status,remark,task_nature,task_issue,assign_to,task_due_date,updateby,task_last_modify,create_date,legal,task_amount,assignee_parent,notification,read_by_creator,read_by_assignee) "
        . "values"
        . "('$task_subject','$task_description','$task_status','$remark','$task_nature','$task_issue','$assign_to','$task_due_date','".$id."','".date('Y-m-d H:i:s')."','".date('Y-m-d H:i:s')."','$legal','$task_amount','$assignee_parent','sent',0,0)";
$result = $db->query($sql);
//echo $sql;
if($result) 
    {
	echo json_encode(array('message' => 'success'));
    } 
else 
{
    echo json_encode(array('message' => 'error'));
}

} else {
	$dataqry = "select * from task_detail where task_id = '$task_id'";
	$datares = $db->query($dataqry);
	$datarow = $datares->fetch_array();
	$activities = array();

	if($datarow['task_subject'] != $task_subject) {
		$activities[] = array('Subject', $task_subject, $datarow['task_subject']);
	}
	if($datarow['task_description'] != $task_description) {
		$activities[] = array('Description', $task_description, $datarow['task_description']);
	}
	if(strtotime($datarow['task_due_date']) != strtotime($task_due_date)) {
		$activities[] = array('Due Date', $task_due_date, $datarow['task_due_date']);
	}
	if($datarow['task_status'] != $task_status) {
		$activities[] = array('Status', $task_status, $datarow['task_status']);
	}
        if($datarow['remark'] != $remark) {
		$activities[] = array('Remark', $remark, $datarow['remark']);
	}
	if($datarow['assign_to'] != $assign_to) {
		$activities[] = array('Assignee', $assign_to, $datarow['assign_to']);
	}
	if($datarow['task_nature'] != $task_nature) {
		$activities[] = array('Nature', $task_nature, $datarow['task_nature']);
	}
	if($datarow['task_issue'] != $task_issue) {
		$activities[] = array('Issue', $task_issue, $datarow['task_issue']);
	}
	if($datarow['legal'] != $legal) {
		$activities[] = array('Legal Violation', $legal, $datarow['legal']);
	}
	if($datarow['task_amount'] != $task_amount) {
		$activities[] = array('Amount', $task_amount, $datarow['task_amount']);
	}


		$sql = "INSERT INTO `task_detail_archive`(`task_subject`, `task_description`, `task_due_date`,`task_status`, `remark`, `assign_to`, `create_date`, `updateby`, `task_nature`, `task_issue`, `legal`, `task_amount`,`assignee_parent`,`main_task_id`) SELECT `task_subject`, `task_description`, `task_due_date`, `task_status`, `remark`, `assign_to`, `create_date`,  `updateby`, `task_nature`, `task_issue`, `legal`, `task_amount`,`assignee_parent`,`task_id` FROM `task_detail` WHERE task_id = $task_id";
	$result = $db->query($sql);
	$last_id = $db->insert_id;
	$sql1 = "UPDATE `task_detail_archive` SET `activities`='".serialize($activities)."',`task_last_modify` = '".date('Y-m-d H:i:s')."' where task_id = $last_id";
		$result1 = $db->query($sql1);

	if($result) {
		$sql = "UPDATE `task_detail` SET `task_subject`='$task_subject',`task_description`='$task_description',`task_due_date`='$task_due_date',`task_last_modify`='".date('Y-m-d H:i:s')."',`task_status`='$task_status', `remark`='$remark', `assign_to`='$assign_to',`task_nature`='$task_nature', `task_issue`='$task_issue',`legal`='$legal', `task_amount`='$task_amount', `assignee_parent`='$assignee_parent' WHERE task_id = $task_id";
		$result = $db->query($sql);
		if($result) 
		    {
			echo json_encode(array('message' => 'success'));
		    } 
		else 
		{
		    echo json_encode(array('message' => 'error'));
		}
	}
}