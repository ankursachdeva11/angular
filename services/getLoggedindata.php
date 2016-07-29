<?php
include('config.php');
ini_set('display_errors', 1);



echo json_encode(array('Emp_Name' => $_SESSION['user_info']['Emp_Name'],
						'Emp_Photo' => base64_encode($_SESSION['user_info']['Emp_Photo']),
						'Emp_Post' => $_SESSION['user_info']['Emp_Post'],
						'Emp_No' => $_SESSION['user_info']['Emp_No'],
						'lev' => $_SESSION['user_info']['lev'],
						'dept_id' => $_SESSION['user_info']['dept_id']));