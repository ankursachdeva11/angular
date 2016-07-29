<?php
include('config.php');
ini_set('display_errors', 1);

@$id = ($_SESSION['user_info']['userid']) ? $_SESSION['user_info']['userid'] : $_SESSION['user_info']['Emp_No'];
$sql="select * from task_detail where updateby=".$id." or assign_to=".$id." and task_status <> 'Completed' order by task_due_date desc";
$data = array();
$result = $db->query($sql);
$i=0;
while($row = $result->fetch_array()) {
        $data[$i]['no'] = $i+1;
	$data[$i]['task_id'] = $row['task_id'];
	$data[$i]['task_subject'] = $row['task_subject'];
	$data[$i]['task_description'] = $row['task_description'];
        $data[$i]['task_due_date'] = $row['task_due_date'];
        $data[$i]['task_status'] = strtolower($row['task_status']);
        $data[$i]['task_nature'] = $row['task_nature'];
        $data[$i]['task_amount'] = $row['task_amount'];

        $emp_query = "select Emp_Name from emp_master where Emp_No = '".$row['assign_to']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();
        $data[$i]['assign_to'] = $emp_row['Emp_Name'];
        $data[$i]['assign_to_id'] = $row['assign_to'];
        $data[$i]['create_date'] = $row['create_date'];
        $data[$i]['task_issue'] = $row['task_issue'];
        $data[$i]['task_amount'] = $row['task_amount'];
        $data[$i]['remark'] = $row['remark'];
        $emp_query = "select Emp_Name from emp_master where Emp_No = '".$row['updateby']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();
        $data[$i]['updateby'] = $emp_row['Emp_Name'];
	$i++;
}
echo json_encode($data);