<?php 
include('config.php');
ini_set('display_errors', 1);

//$teamlist= "'".implode("','", explode(',', $_SESSION['user_info']['teamid']))."'";

$sql="SELECT * FROM task_status ts  ";

/*switch($_SESSION['user_info']['lev']) {
	case 'core_team':
	$sql.= " where ts.task_status_name <> 'Completed' ";
	break;
    
        case 'core':
	$sql.= " where ts.task_status_name <> 'Completed' ";
	break;
	default:
	if($_REQUEST['show_complete'] == 'false'){
		$sql.= " where ts.task_status_name <> 'Completed' ";
	}

	break;
}*/
$data = array();
//echo $sql;
$result = $db->query($sql);
$i=0;
while($row = $result->fetch_array()) {
	$data[$i]['id'] = $row['task_status_id'];
	$data[$i]['name'] = $row['task_status_name'];
	$i++;
}
//$data[$i]['sql'] =$sql;

echo json_encode($data);