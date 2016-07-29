<?php
include('config.php');

$postdata = file_get_contents("php://input");
$request = json_decode($postdata);




$created_date = date('Y-m-d H:i:s');
$sql = "SELECT * FROM `user_master` WHERE username = '$request->Username' or email = '$request->Email'";
$result = $db->query($sql);

if(!$result->num_rows) { 
	$insert = "INSERT INTO `user_master`(`email`, `username`, `password`, `created_date`) VALUES ('$request->Email','$request->Username','".md5($request->Password)."','$created_date')";
	if($db->query($insert)){

		echo json_encode(array('message' => 'success'));
	}
} else{
	echo json_encode(array('message' => 'exists'));
}


?>