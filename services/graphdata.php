<?php
include('config.php');
ini_set('display_errors', 1);

@$id = ($_SESSION['user_info']['userid']) ? $_SESSION['user_info']['userid'] : $_SESSION['user_info']['Emp_No'];
@$id = ($_REQUEST['assign_to']) ? $_REQUEST['assign_to'] : $id;

$data = array();



for($i=0; $i<7; $i++){
    $last_week_date = date('Y-m-d', strtotime($i.' day'));
    $pt = 0;
    $it = 0;
    $ct = 0;
    $wt = 0;
    $sql="select * from task_detail where assign_to=".$id." and task_due_date='".$last_week_date."' order by task_due_date desc";
    $result = $db->query($sql);
    while($row = $result->fetch_array()) {
    	switch (strtolower($row['task_status'])) {
    		case 'pending':
    			$pt++;
    			break;
    		
    		case 'completed':
    			$ct++;
    			break;
    		
    		case 'inprogress':
    			$it++;
    			break;
    		
    		case 'waiting':
    			$wt++;
    			break;
    		
    		default:
    			# code...
    			break;
    	}

    }
    $data[$i]['y'] = $last_week_date;
	$data[$i]['pending'] = $pt;
	$data[$i]['completed'] = $ct;
	$data[$i]['inprogress'] = $it;
	$data[$i]['waiting'] = $wt;
}


$month = date('m');
$year = date('Y');
$datam = array();
for($d=1; $d<=cal_days_in_month(CAL_GREGORIAN, $month, $year); $d++)
{
    $time=mktime(12, 0, 0, $month, $d, $year);          
    if (date('m', $time)==$month)       {
        $last_month_date = date('Y-m-d', $time);
	    $pt = 0;
	    $it = 0;
	    $ct = 0;
	    $wt = 0;
	    $sql="select * from task_detail where assign_to=".$id." and task_due_date='".$last_month_date."' order by task_due_date desc";
	    $result = $db->query($sql);
	    while($row = $result->fetch_array()) {
	    	switch (strtolower($row['task_status'])) {
	    		case 'pending':
	    			$pt++;
	    			break;
	    		
	    		case 'completed':
	    			$ct++;
	    			break;
	    		
	    		case 'inprogress':
	    			$it++;
	    			break;
	    		
	    		case 'waiting':
	    			$wt++;
	    			break;
	    		
	    		default:
	    			# code...
	    			break;
	    	}

	    }
	    $i = $d - 1;
	    $datam[$i]['y'] = date('d',strtotime($last_month_date));
		$datam[$i]['pending'] = $pt;
		$datam[$i]['completed'] = $ct;
		$datam[$i]['inprogress'] = $it;
		$datam[$i]['waiting'] = $wt;
    }
}



$datay = array();
for($i=00; $i<12; $i++){
    $month = $i+1;
    $dateObj   = DateTime::createFromFormat('!m', $month);
	$monthName = $dateObj->format('F'); // March
	$mnth = $dateObj->format('m'); // March
    $year = date('Y');
    $pt = 0;
    $it = 0;
    $ct = 0;
    $wt = 0;
    $sql="select * from task_detail where assign_to=".$id." and DATE_FORMAT(task_due_date, '%m-%Y') = '$mnth-$year' order by task_due_date desc";
    $result = $db->query($sql);
    while($row = $result->fetch_array()) {
    	switch (strtolower($row['task_status'])) {
    		case 'pending':
    			$pt++;
    			break;
    		
    		case 'completed':
    			$ct++;
    			break;
    		
    		case 'inprogress':
    			$it++;
    			break;
    		
    		case 'waiting':
    			$wt++;
    			break;
    		
    		default:
    			# code...
    			break;
    	}

    }
    
    $datay[$i]['y'] = $monthName;
	$datay[$i]['pending'] = $pt;
	$datay[$i]['completed'] = $ct;
	$datay[$i]['inprogress'] = $it;
	$datay[$i]['waiting'] = $wt;
}


echo json_encode(array('data' => $data, 'datam' => $datam, 'datay' => $datay));

