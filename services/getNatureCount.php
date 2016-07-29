<?php
include('config.php');
ini_set('display_errors', 1);

@$id = ($_SESSION['user_info']['userid']) ? $_SESSION['user_info']['userid'] : $_SESSION['user_info']['Emp_No'];
@$id = ($_REQUEST['assign_to']) ? $_REQUEST['assign_to'] : $id;

if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off') {
	    $protocol = 'http://';
	} else {
	    $protocol = 'https://';
	}
	$base_url = $protocol . $_SERVER['SERVER_NAME'] . dirname($_SERVER['PHP_SELF']);


$lev = $_SESSION['user_info']['lev'];
if($lev == 'DIR' && !isset($_REQUEST['assign_to'])) { 
	
	$getData = file_get_contents($base_url . '/getAllEmps.php?emp_no='.$id);
	$getData = json_decode($getData);
	
	$getids = '';
	foreach ($getData as $key => $value) {
		$getids .= $value->id .',';
	}
	$getids = substr($getids, 0, -1);
	$sql="select * from task_detail where assign_to in(".$getids.") order by task_due_date desc";
} else if(!isset($_REQUEST['assign_to'])) {
	$sql="select * from task_detail where assign_to=".$id." order by task_due_date desc";
} else{
	$getData = file_get_contents($base_url . '/getAllEmps.php?emp_no='.$id);
	$getData = json_decode($getData);
	
	$getids = '';
	foreach ($getData as $key => $value) {
		$getids .= $value->id .',';
	}
	$getids = substr($getids, 0, -1);
	$sql="select * from task_detail where assign_to in(".$getids.") order by task_due_date desc";
}



$data = array();
$result = $db->query($sql);


/*if($result->num_rows == 0){
	$sql="select * from task_detail where updateby=".$id." order by task_due_date desc";
	$result = $db->query($sql);
}*/
$i=0;
$critical_count = 0;
$legal_count = 0;
$routine_count = 0;
$critical_nature = array();
$legal_nature = array();
$routine_nature = array();
$critical_show_all = false;
$legal_show_all = false;
$routine_show_all = false;
while($row = $result->fetch_array()) {
		
		if($critical_count == 10) {
			$critical_show_all = true;
			continue;
		}
		if($legal_count == 10) {
			$legal_show_all = true;
			continue;
		}
                if($routine_count == 10) {
			$routine_show_all = true;
			continue;
		}


		$data = array();
        $data['no'] = $i+1;
		$data['task_id'] = $row['task_id'];
		$data['task_subject'] = $row['task_subject'];
		$data['task_description'] = $row['task_description'];
        $data['task_due_date'] = $row['task_due_date'];
        $data['task_status'] = strtolower($row['task_status']);
        $data['task_nature'] = $row['task_nature'];
         $data['task_amount'] = $row['task_amount'];

        $emp_query = "select Emp_Name from emp_master where Emp_No = '".$row['assign_to']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();
        $data['assign_to'] = $emp_row['Emp_Name'];
        $data['assign_to_id'] = $row['assign_to'];
        $data['create_date'] = $row['create_date'];
        $data['task_issue'] = $row['task_issue'];
         $data['task_amount'] = $row['task_amount'];
        $data['task_last_modify'] = $row['task_last_modify'];
        
        $data['remark'] = $row['remark'];
        $emp_query = "select Emp_Name from emp_master where Emp_No = '".$row['updateby']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();
        $data['updateby'] = $emp_row['Emp_Name'];
		
		if(strtolower($row['task_status']) != 'completed'){
			$date1=date_create(date('Y-m-d', strtotime($row['task_due_date'])));
			$date2=date_create(date('Y-m-d', strtotime($row['create_date'])));
			$diff = date_diff($date1,$date2);
			$adiff = $diff->format("%R%a");
			if($adiff > 0)
				$data['diff'] = 'Pending by '.str_replace('+','',$adiff).' days';
			else $data['diff'] = 'Overdue by '.str_replace('+','',$adiff).' days';
			if(strtolower($row['task_nature']) == 'critical')
				$critical_count++;
                        $critical_nature[$critical_count] = $data;

			if(strtolower($row['task_nature']) == 'legal')
				$legal_count++;
                        $legal_nature[$legal_count] = $data;
			
			if(strtolower($row['task_nature']) == 'routine')
				$routine_count++;
			$routine_nature[$routine_count] = $data;
		}
		
		
	$i++;
}
echo json_encode(array('critical_count' => $critical_count,
						'legal_count' => $legal_count,
						'routine_count' => $routine_count,
						'critical_nature' => $critical_nature,
						'legal_nature' => $legal_nature,
                                                'routine_nature' => $routine_nature,
						'critical_show_all' => $critical_show_all,
                                                'routine_show_all' => $routine_show_all,
						'legal_show_all' => $legal_show_all));