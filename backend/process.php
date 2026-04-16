<?php
session_name("GAS_PROJECT_SESSION");
session_start();
header("Cache-Control: no-cache, no-store, must-revalidate"); 
header("Pragma: no-cache"); 
header("Expires: 0");

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}

$user_id = $_SESSION['user_id'];
$role = $_SESSION['role'];

include 'db.php';

function hasAccess($conn, $station_id, $user_id, $role) {
    if ($role === 'admin') return true;
    $stmt = $conn->prepare("SELECT id FROM stations WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $station_id, $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->num_rows > 0;
}

// ... [Keep your SAVE RECORD, DELETE RECORD, UPDATE RECORD 1 through 6 exactly as they are] ...

// ==========================================
// GAS TYPES MASTER LIST LOGIC (UPDATED)
// ==========================================

// 7. SAVE NEW GAS TYPE
if (isset($_POST['save_gas_type'])) {
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $category = mysqli_real_escape_string($conn, $_POST['category']);
    $color_code = mysqli_real_escape_string($conn, $_POST['color_code']);
    
    $conn->query("INSERT IGNORE INTO gas_types (name, category, color_code) VALUES ('$name', '$category', '$color_code')");
    header("location: manage_gases.php");
}

// 8. UPDATE GAS TYPE NAME, CATEGORY, COLOR
if (isset($_POST['update_gas_type'])) {
    $gas_id = intval($_POST['gas_id']);
    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $category = mysqli_real_escape_string($conn, $_POST['category']);
    $color_code = mysqli_real_escape_string($conn, $_POST['color_code']);
    
    $conn->query("UPDATE gas_types SET name='$name', category='$category', color_code='$color_code' WHERE id=$gas_id");
    header("location: manage_gases.php");
}

// 9. DELETE GAS TYPE
if (isset($_GET['delete_gas_type'])) {
    $gas_id = intval($_GET['delete_gas_type']);
    $conn->query("DELETE FROM gas_types WHERE id=$gas_id");
    header("location: manage_gases.php");
}

// ==========================================
// STATION PROFILE LOGIC (UPDATED)
// ==========================================

// A. UPDATE STATION INFO FROM PROFILE
if (isset($_POST['update_station_profile'])) {
    $station_id = intval($_POST['station_id']);
    if (!hasAccess($conn, $station_id, $user_id, $role)) exit("Unauthorized Access");

    $name = mysqli_real_escape_string($conn, $_POST['name']);
    $location = mysqli_real_escape_string($conn, $_POST['location']);
    $latitude = !empty($_POST['latitude']) ? "'" . $_POST['latitude'] . "'" : "NULL";
    $longitude = !empty($_POST['longitude']) ? "'" . $_POST['longitude'] . "'" : "NULL";
    $assigned_user = !empty($_POST['assigned_user']) ? intval($_POST['assigned_user']) : "NULL";

    $query = "UPDATE stations SET name='$name', location='$location', latitude=$latitude, longitude=$longitude, user_id=$assigned_user WHERE id=$station_id";

    if ($conn->query($query)) {
        header("location: station_profile.php?id=$station_id&msg=success");
    } else {
        echo "Error: " . $conn->error;
    }
    exit();
}

// B. ADD FUEL (SMART DATALIST LOGIC) - Updated
if (isset($_POST['add_fuel_to_profile'])) {
    $station_id = intval($_POST['station_id']);
    $custom_gas_name = mysqli_real_escape_string($conn, $_POST['custom_gas_name']);
    $price = floatval($_POST['price']);
    
    // Grab the new category and color fields from the station_profile form
    $category = isset($_POST['category']) ? mysqli_real_escape_string($conn, $_POST['category']) : 'unleaded';
    $color_code = isset($_POST['color_code']) ? mysqli_real_escape_string($conn, $_POST['color_code']) : 'green';

    $check = $conn->query("SELECT id FROM gas_types WHERE name = '$custom_gas_name'");
    
    if ($check->num_rows > 0) {
        $gas_type_id = $check->fetch_assoc()['id'];
    } else {
        // Use the form selections instead of hardcoding 'unleaded', 'green'
        $conn->query("INSERT INTO gas_types (name, category, color_code) VALUES ('$custom_gas_name', '$category', '$color_code')");
        $gas_type_id = $conn->insert_id; 
    }

    $conn->query("INSERT INTO station_fuels (station_id, gas_type_id, price) VALUES ($station_id, $gas_type_id, $price)");
    header("location: station_profile.php?id=$station_id");
}

// C. DELETE FUEL FROM PROFILE
if (isset($_GET['delete_profile_fuel'])) {
    $fuel_id = intval($_GET['delete_profile_fuel']);
    $station_id = intval($_GET['station_id']); 
    $conn->query("DELETE FROM station_fuels WHERE id = $fuel_id");
    header("location: station_profile.php?id=$station_id");
}

// D. UPDATE FUEL NAME AND PRICE FROM EDIT PAGE - Updated
if (isset($_POST['update_fuel_complete'])) {
    $fuel_id = intval($_POST['fuel_id']);
    $station_id = intval($_POST['station_id']);
    $custom_gas_name = mysqli_real_escape_string($conn, $_POST['custom_gas_name']);
    $price = floatval($_POST['price']);

    // Grab the new category and color fields from the edit_fuel form
    $category = isset($_POST['category']) ? mysqli_real_escape_string($conn, $_POST['category']) : 'unleaded';
    $color_code = isset($_POST['color_code']) ? mysqli_real_escape_string($conn, $_POST['color_code']) : 'green';

    // 1. Check if the new gas name already exists in the master list
    $check = $conn->query("SELECT id FROM gas_types WHERE name = '$custom_gas_name'");
    
    if ($check->num_rows > 0) {
        $gas_type_id = $check->fetch_assoc()['id'];
        // Note: If it exists, we DO NOT overwrite the master category/color here. 
        // Only the Admin should change master settings in manage_gases.php
    } else {
        // 2. Create new gas type with the manager's selected category and color
        $conn->query("INSERT INTO gas_types (name, category, color_code) VALUES ('$custom_gas_name', '$category', '$color_code')");
        $gas_type_id = $conn->insert_id;
    }

    // 3. Update the existing fuel record to point to the correct gas_type_id and price
    $query = "UPDATE station_fuels SET gas_type_id = $gas_type_id, price = $price WHERE id = $fuel_id";
    $conn->query($query);

    // Redirect back to the station profile
    header("location: station_profile.php?id=$station_id");
}

// ... [Keep your REVIEW APPROVAL and USER MANAGEMENT logic exactly as it is] ...
?>