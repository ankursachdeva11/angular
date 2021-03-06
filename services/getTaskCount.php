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

$sql = "select td.*, em.sub_deptid, sd.dept_id, sd.sub_dept_name from task_detail td left join emp_master em on td.assign_to=em.Emp_No left join subdept sd on sd.sub_deptid = em.sub_deptid";
$lev = $_SESSION['user_info']['lev'];
if(($lev == 'DIR' && !isset($_REQUEST['assign_to'])) || ($lev == 'DIR' && isset($_REQUEST['assign_to']) && $_REQUEST['assign_to'] == $_SESSION['user_info']['Emp_No'])) { 
	
	$getData = file_get_contents($base_url . '/getAllEmps.php?emp_no='.$id);
	$getData = json_decode($getData);
	
	$getids = '';
	foreach ($getData as $key => $value) {
		$getids .= $value->id .',';

		$getData1 = file_get_contents($base_url . '/getAllEmps.php?emp_no='.$value->id);
		$getData1 = json_decode($getData1);
		foreach ($getData1 as $key1 => $value1) {
			$getids .= $value1->id .',';
		}
	}
	$getids = substr($getids, 0, -1);
	$sql.=" where assign_to in(".$getids.") order by task_due_date desc";
} else if(!isset($_REQUEST['assign_to']) && $lev == 'shead') {
	$sql.=" where assign_to=".$id." order by task_due_date desc";
}
else if(isset($_REQUEST['assign_to']) && isset($_REQUEST['sub']) && $lev == 'shead') {
	$sql.=" where assign_to=".$id." order by task_due_date desc";
} else{
	$getData = file_get_contents($base_url . '/getAllEmps.php?emp_no='.$id);
	$getData = json_decode($getData);
	
	$getids = '';
	foreach ($getData as $key => $value) {
		$getids .= $value->id .',';
	}
	$getids = substr($getids, 0, -1);
	$sql.=" where assign_to in(".$getids.") order by task_due_date desc";
}





$data = array();
$result = $db->query($sql);


/*if($result->num_rows == 0){
	$sql="select * from task_detail where updateby=".$id." order by task_due_date desc";
	$result = $db->query($sql);
}*/
$i=0;
$pending_count = 0;
$inprogress_count = 0;
$waiting_count = 0;
$completed_count = 0;
$critical_count = 0;
$legal_count = 0;
$routine_count = 0;
$legaly_count = 0;
$legaln_count = 0;
$p1count = 0;
$p2count = 0;
$p3count = 0;
$tasks = array();

while($row = $result->fetch_array()) {
		
		/*if($pending_count == 10) {
			$pending_show_all = true;
			continue;
		}
		if($completed_count == 10) {
			$completed_show_all = true;
			continue;
		}*/


		$data = array();
        $data['no'] = $i+1;
		$data['task_id'] = $row['task_id'];
		$data['task_subject'] = $row['task_subject'];
		$data['task_description'] = $row['task_description'];
        $data['task_due_date'] = $row['task_due_date'];
        $data['task_status'] = strtolower($row['task_status']);
        $data['task_nature'] = $row['task_nature'];
        $data['sub_deptid'] = $row['sub_deptid'];
        $data['sub_dept_name'] = $row['sub_dept_name'];
        $data['dept_id'] = $row['dept_id'];
         $data['task_amount'] = $row['task_amount'];
         $data['legal'] = $row['legal'];

        $emp_query = "select * from emp_master where Emp_No = '".$row['assign_to']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();
        $queryempres = getEmpFullDetails($db, $emp_row['emailid']);
        $emp_details = $queryempres->fetch_array();
        $data['assign_to'] = ($emp_details['lev'] == 'DIR') ? $emp_row['Emp_Name'] : $emp_row['Emp_Name'] .' - '. $emp_details['sub_dept_name'];
        $data['assign_to_id'] = $row['assign_to'];
        $data['create_date'] = $row['create_date'];
        $data['task_issue'] = $row['task_issue'];
         $data['task_amount'] = $row['task_amount'];
        $data['task_last_modify'] = $row['task_last_modify'];
        
        $data['remark'] = $row['remark'];
        $emp_query = "select * from emp_master where Emp_No = '".$row['updateby']."'";
        $emp_res = $db->query($emp_query);
        $emp_row = $emp_res->fetch_array();
        $queryempres = getEmpFullDetails($db, $emp_row['emailid']);
        $emp_details = $queryempres->fetch_array();
        $data['updateby'] = ($emp_details['lev'] == 'DIR') ? $emp_row['Emp_Name'] : $emp_row['Emp_Name'] .' - '. $emp_details['sub_dept_name'];
        
		
		if(strtolower($row['task_status']) != 'completed'){
			$date1=date_create(date('Y-m-d', strtotime($row['task_due_date'])));
			$date2=date_create(date('Y-m-d', strtotime($row['create_date'])));
			$diff = date_diff($date1,$date2);
			$adiff = $diff->format("%R%a");
			if($adiff > 0)
				$data['diff'] = 'Pending by '.str_replace('+','',$adiff).' days';
			else $data['diff'] = 'Overdue by '.str_replace('+','',$adiff).' days';
			if(strtolower($row['task_status']) == 'pending')
				$pending_count++;

			if(strtolower($row['task_status']) == 'waiting')
				$waiting_count++;
			
			if(strtolower($row['task_status']) == 'inprogress')
				$inprogress_count++;
			

			
		}
		
		if(strtolower($row['task_status']) == 'completed'){
			$completed_count++;
			
		}

		if(strtolower($row['task_nature']) == 'critical'){
			$critical_count++;
		}
		else if(strtolower($row['task_nature']) == 'legal'){
			$legal_count++;
		}
		else if(strtolower($row['task_nature']) == 'routine'){
			$routine_count++;
		}
                
                if($row['legal'] == 'Y'){
			$legaly_count++;
		}
		else if($row['legal'] == 'N'){
			$legaln_count++;
		}

		if($row['task_amount'] >= 5 && $row['task_amount'] < 25)
			{
				$p1count++;
			}
			else if($row['task_amount'] >= 25 && $row['task_amount'] < 200)
			{
				$p2count++;	
			}
			else if($row['task_amount'] >= 200)
			{
				$p3count++;
			}



		if(isset($_REQUEST['status']) && strtolower($row['task_status']) == strtolower($_REQUEST['status']))
			$tasks[$i] = $data;
		else if(isset($_REQUEST['nature']) && strtolower($row['task_nature']) == strtolower($_REQUEST['nature']))
			$tasks[$i] = $data;
                else if(isset($_REQUEST['legal']) && strtolower($row['legal']) == strtolower($_REQUEST['legal']))
			$tasks[$i] = $data;
		else if(isset($_REQUEST['task_amount']) && $_REQUEST['task_amount'] == 'p1count' && $row['task_amount'] >= 5 && $row['task_amount'] < 25) 
			$tasks[$i] = $data;
		else if(isset($_REQUEST['task_amount']) && $_REQUEST['task_amount'] == 'p2count' && $row['task_amount'] >= 25 && $row['task_amount'] < 200)
			$tasks[$i] = $data;
		else if(isset($_REQUEST['task_amount']) && $_REQUEST['task_amount'] == 'p3count' && $row['task_amount'] >= 200)
			$tasks[$i] = $data;
		else if (!isset($_REQUEST['status']) && !isset($_REQUEST['nature']) && !isset ($_REQUEST['legal']) && !isset ($_REQUEST['task_amount']))
			$tasks[$i] = $data;
	$i++;
}
echo json_encode(array('pending_count' => $pending_count,
						'waiting_count' => $waiting_count,
						'inprogress_count' => $inprogress_count,
						'legal_count' => $legal_count,
						'critical_count' => $critical_count,
						'routine_count' => $routine_count,
						'p1count' => $p1count,
						'p2count' => $p2count,
						'p3count' => $p3count,
                                                   'legaly_count' => $legaly_count,
                                                   'legaln_count' => $legaln_count,
						'tasks' => $tasks,
						'completed_count' => $completed_count));