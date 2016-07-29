<?php

include('config.php');

ini_set('display_errors', 1);



@$id = $_REQUEST['task_id'];

$sql="select * from task_detail where task_id = ".$id."";





$data = array();

$result = $db->query($sql);



while($row = $result->fetch_array()) {

	$data['task_id'] = $row['task_id'];

	$data['task_subject'] = $row['task_subject'];

	$data['task_description'] = $row['task_description'];

        $data['task_due_date'] = date('m/d/Y', strtotime($row['task_due_date']));

        $data['task_status'] = $row['task_status'];

        $data['assign_to'] = ($row['assignee_parent'] != '') ? $row['assignee_parent'] : $row['assign_to'];
         $emp_query = "select * from emp_master where Emp_No = '".$row['assign_to']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();

        $data['assign_to_name'] = $emp_row['Emp_Name'];
 	$data['assignee_child'] = $row['assign_to'];
        $data['assignee_parent'] = $row['assignee_parent'];

        $data['create_date'] = $row['create_date'];
        $data['task_last_modify'] = $row['task_last_modify'];
        
        $data['task_last_modify_by'] = $row['task_last_modify_by'];
        $emp_query = "select * from emp_master where Emp_No = '".$row['task_last_modify_by']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();

        $data['task_last_modify_by_name'] = $emp_row['Emp_Name'];

        $data['remark'] = $row['remark'];

        $data['updateby'] = $row['updateby'];
        $emp_query = "select * from emp_master where Emp_No = '".$row['updateby']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();

        $data['updateby_name'] = $emp_row['Emp_Name'];

        $data['task_nature'] = $row['task_nature'];

        $data['task_amount'] = (isset($_REQUEST['popup']) && $row['task_amount'] == 0) ? 'NA' : $row['task_amount'];

        $data['task_issue'] = $row['task_issue'];

        $data['legal'] = ($row['legal'] == 'Y') ? 1 : 0;

        $data['show_complete'] = ($_SESSION['user_info']['Emp_No'] == $row['assign_to']) ? false : true;
        $data['creator'] = ($_SESSION['user_info']['Emp_No'] == $row['updateby']) ? false : true;



}



if(isset($_REQUEST['include'])) { 

$sql="select * from task_detail_archive where main_task_id = ".$id."";



$resp = array();

$resp[0] = $data;

$subdata = array('subject' => $data['task_subject'], 'description' => $data['task_description']);


$data = array();

$result = $db->query($sql);


$i = 1;
while($row = $result->fetch_array()) {

        $data['task_id'] = $row['task_id'];

        $data['task_subject'] = $row['task_subject'];

        $data['task_description'] = $row['task_description'];

       $data['task_due_date'] = date('m/d/Y', strtotime($row['task_due_date']));

        $data['task_status'] = $row['task_status'];

         $data['assign_to'] = ($row['assignee_parent'] != '') ? $row['assignee_parent'] : $row['assign_to'];
         $emp_query = "select * from emp_master where Emp_No = '".$row['assign_to']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();

        $data['assign_to_name'] = $emp_row['Emp_Name'];
 	$data['assignee_child'] = $row['assign_to'];
        $data['assignee_parent'] = $row['assignee_parent'];
        
        $data['create_date'] = $row['create_date'];
        $data['task_last_modify'] = $row['task_last_modify'];
        $data['task_last_modify_by'] = $row['task_last_modify_by'];
        $emp_query = "select * from emp_master where Emp_No = '".$row['task_last_modify_by']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();

        $data['task_last_modify_by_name'] = $emp_row['Emp_Name'];

        $data['remark'] = $row['remark'];

        $data['updateby'] = $row['updateby'];
        $emp_query = "select * from emp_master where Emp_No = '".$row['updateby']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();

        $data['updateby_name'] = $emp_row['Emp_Name'];

        $data['task_nature'] = $row['task_nature'];

        $data['task_amount'] = (isset($_REQUEST['popup']) && $row['task_amount'] == 0) ? 'NA' : $row['task_amount'];

        $data['task_issue'] = $row['task_issue'];

        $data['legal'] = ($row['legal'] == 'Y') ? 1 : 0;

        $data['show_complete'] = ($_SESSION['user_info']['Emp_No'] == $row['assign_to']) ? false : true;
        $data['creator'] = ($_SESSION['user_info']['Emp_No'] == $row['updateby']) ? false : true;


        $resp[$i] = $data;
$i++;
}

echo json_encode(array('resp'=> $resp, 'subdata' => $subdata), JSON_PRETTY_PRINT);

} else {

echo json_encode($data, JSON_PRETTY_PRINT);

}



