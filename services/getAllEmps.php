<?php 
include('config.php');
ini_set('display_errors', 1);


$sql="SELECT * FROM emp_master em inner join subdept sb on (em.sub_deptid = sb.sub_deptid) inner join department dp on (dp.dept_id = sb.dept_id) ";

$show = false;

if(!isset($_REQUEST['emp_no'])) {
	$sub_deptid = $_SESSION['user_info']['sub_deptid'];
	$lev = $_SESSION['user_info']['lev'];
	$teamlist= "'".implode("','", explode(',', $_SESSION['user_info']['teamid']))."'";
	$Emp_No = $_SESSION['user_info']['Emp_No'];
	$Emp_Name = $_SESSION['user_info']['Emp_Name'];
	$sql1 = $sql." where Emp_No = '$Emp_No'";
	$result1 = $db->query($sql1);
	$lrow = $result1->fetch_array();

} else {
	$empDetail= getEmpDetails($db, $_REQUEST['emp_no']);
	$queryempres= getEmpFullDetails($db, $empDetail['emailid']);
    
    $queryemprow = $queryempres->fetch_array();

    $sub_deptid = $queryemprow['sub_deptid'];
	$lev = $queryemprow['lev'];
	$teamlist= "'".implode("','", explode(',', $queryemprow['teamid']))."'";
	$Emp_No = $queryemprow['Emp_No'];
	$Emp_Name = $queryemprow['Emp_Name'];
	$sql1 = $sql." where Emp_No = '$Emp_No'";
	$result1 = $db->query($sql1);
	$lrow = $result1->fetch_array();
}

switch($lev) {
	case 'DIR':
	$sql.= " where em.level='HOD' and em.status='A' order by em.Emp_Name asc";
	break;
	
	case 'hod':
	$sql.= " where em.level='0' and em.status='A' and em.sub_deptid  like concat('%',substr(".$sub_deptid.",1,2),'%') order by em.Emp_Name asc ";
	break;
	
	case 'shead':
	$sql.= " left join emp_allocation ea on ea.head_empid=em.Emp_No where em.level='1' and em.company <> 'PHRS'  and (em.allocation=0 or allocation in(".$teamlist.")) and em.status='A' and em.sub_deptid ='".$sub_deptid."' order by em.Emp_Name asc ";
	break;
	
	case 'tlead':
	$sql.= " where em.level='1' and em.company <> 'PHRS'  and em.status='A' and em.allocation in(".$teamlist.") and em.sub_deptid ='".$sub_deptid."' order by em.Emp_Name asc";
	break;
	
	case 'core_team':
	case 'core':
	$show =true;
	$sql.= " where em.level='-1' and em.company <> 'PHRS' ";
	break;
}
$data = array();

$result = $db->query($sql);
if(isset($_REQUEST['page']) && !isset($_REQUEST['emp_no'])){
	$data[0]['id'] = $Emp_No;
	$data[0]['name'] = $Emp_Name . '('.$lrow['dept_name'].')';
        
        $data[0]['subdeptid'] = $lrow['sub_deptid'];
        $data[0]['dept_name'] = $lrow['sub_dept_name'];
        $data[0]['Emp_Name'] = $Emp_Name;
	$i=1;
} else if(isset($_REQUEST['emp_no']) && !isset($_REQUEST['emp'])) {
		$data[0]['id'] = $Emp_No;
		if(isset($_REQUEST['page']) && $_REQUEST['page'] == 'edit')
			$data[0]['name'] = $Emp_Name;
		else 
			$data[0]['name'] = 'Assign to same above';
                
        $data[0]['subdeptid'] = $lrow['sub_deptid'];
        $data[0]['dept_name'] = $lrow['sub_dept_name'];
        
        if(isset($_REQUEST['page']) && $_REQUEST['page'] == 'edit')
			$data[0]['Emp_Name'] = $Emp_Name;
		else 
			$data[0]['Emp_Name'] = 'Assign to same above';
		$i=1;

}
else $i=0;
while($row = $result->fetch_array()) {
	$data[$i]['id'] = $row['Emp_No'];
	if($lev == 'DIR')
	$data[$i]['name'] = isset($row['name']) ? $row['Emp_Name'] . '('.$row['dept_name'].') - '.$row['name'] : $row['Emp_Name'] . '('.$row['dept_name'].')';
	else 
		$data[$i]['name'] = isset($row['name']) ? $row['Emp_Name'] . '('.$row['sub_dept_name'].') - '.$row['name'] : $row['Emp_Name'] . '('.$row['sub_dept_name'].')';
        
        $data[$i]['subdeptid'] = $row['sub_deptid'];
        $data[$i]['Emp_Name'] = $row['Emp_Name'];
        $data[$i]['dept_name'] = $row['sub_dept_name'];
	$i++;
}
//$data[$i]['sql'] =$sql;
if(isset($_REQUEST['page'])){
	echo json_encode(array('data' => $data,'show' => $show));

}
else echo json_encode($data);