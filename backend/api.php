<?php
// TEMPORARY: Turn on error reporting to fix the 500 error
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ... rest of your code ...
// Crucial for React: Allow cross-origin requests (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

$action = isset($_GET['action']) ? $_GET['action'] : (isset($_POST['action']) ? $_POST['action'] : '');

// 1. GET ALL STATIONS (For the Dashboard)
if ($action === 'get_stations') {
    $query = "
        SELECT 
            stations.id AS station_id, 
            stations.name AS station_name, 
            stations.location, 
            gas_types.name AS gas_name, 
            gas_types.category,
            gas_types.color_code,
            station_fuels.price 
        FROM stations
        LEFT JOIN station_fuels ON stations.id = station_fuels.station_id
        LEFT JOIN gas_types ON station_fuels.gas_type_id = gas_types.id
        ORDER BY stations.name, stations.location, gas_types.name
    ";
    
    $result = $conn->query($query);
    $network = [];
    
    while ($row = $result->fetch_assoc()) {
        $s_id = $row['station_id'];
        if (!isset($network[$s_id])) {
            $network[$s_id] = [
                'id' => $s_id,
                'name' => $row['station_name'],
                'location' => $row['location'],
                'fuels' => []
            ];
        }
        if ($row['gas_name'] !== null) {
            $network[$s_id]['fuels'][] = [
                'name' => $row['gas_name'],
                'price' => $row['price'],
                'category' => $row['category'],   // ADDED TO JSON
                'color' => $row['color_code']      // ADDED TO JSON
            ];
        }
    }
    
    echo json_encode(array_values($network));
    exit();
}

// 2. GET SINGLE STATION PROFILE (With Approved Reviews)
if ($action === 'get_station_profile' && isset($_GET['id'])) {
    $station_id = intval($_GET['id']);
    
    // Fetch Station Details
    $st_result = $conn->query("SELECT * FROM stations WHERE id = $station_id");
    $station = $st_result->fetch_assoc();
    
    if (!$station) {
        echo json_encode(["status" => "error", "message" => "Station not found"]);
        exit();
    }

    // Fetch Fuels with Category and Color
    $fuels_query = "
        SELECT 
            station_fuels.id AS fuel_id, 
            gas_types.name AS gas_name, 
            gas_types.category,   -- NEW COLUMN
            gas_types.color_code, -- NEW COLUMN
            station_fuels.price, 
            station_fuels.updated_at
        FROM station_fuels
        JOIN gas_types ON station_fuels.gas_type_id = gas_types.id
        WHERE station_fuels.station_id = $station_id
    ";
    $f_result = $conn->query($fuels_query);
    $fuels = [];
    while($f = $f_result->fetch_assoc()) {
        // Map color_code to 'color' for frontend consistency
        $f['color'] = $f['color_code']; 
        $fuels[] = $f;
    }

    // Fetch ONLY Approved Reviews
    $reviews_query = "SELECT * FROM reviews WHERE station_id = $station_id AND is_approved = 1 ORDER BY created_at DESC";
    $r_result = $conn->query($reviews_query);
    $reviews = [];
    while($r = $r_result->fetch_assoc()) {
        $reviews[] = $r;
    }
    
    echo json_encode([
        'station' => $station, 
        'fuels' => $fuels,
        'reviews' => $reviews
    ]);
    exit();
}

// 3. SUBMIT REVIEW (POST)
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'submit_review') {
    $station_id = intval($_POST['station_id']);
    $user_name = htmlspecialchars($_POST['user_name']);
    $rating = intval($_POST['rating']);
    $comment = htmlspecialchars($_POST['comment']);
    $ip_address = $_SERVER['REMOTE_ADDR'];

    // IP LIMIT CHECK: 24-hour cooldown per station
    $check_query = "SELECT id FROM reviews WHERE ip_address = '$ip_address' AND station_id = $station_id AND created_at > DATE_SUB(NOW(), INTERVAL 1 DAY)";
    $check_res = $conn->query($check_query);

    if ($check_res->num_rows > 0) {
        echo json_encode(["status" => "error", "message" => "You have already reviewed this station today."]);
        exit();
    }

    // FILE UPLOAD LOGIC
    $photo_path = null;
    if (!empty($_FILES['photo']['name'])) {
        $target_dir = "uploads/";
        if (!is_dir($target_dir)) mkdir($target_dir, 0777, true);
        
        $file_ext = strtolower(pathinfo($_FILES["photo"]["name"], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        
        if (in_array($file_ext, $allowed)) {
            $new_name = time() . "_" . bin2hex(random_bytes(5)) . "." . $file_ext;
            $photo_path = $target_dir . $new_name;
            move_uploaded_file($_FILES["photo"]["tmp_name"], $photo_path);
        }
    }

    // SAVE TO DB
    $stmt = $conn->prepare("INSERT INTO reviews (station_id, user_name, rating, comment, photo_path, ip_address) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isisss", $station_id, $user_name, $rating, $comment, $photo_path, $ip_address);
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Thank you! Your review is pending approval."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Server error. Please try again."]);
    }
    exit();
}
?>