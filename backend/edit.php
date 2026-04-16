<?php
session_start();
// Prevent browser caching
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
?>
<?php
include 'db.php';

// Check if an ID is passed in the URL
if (isset($_GET['id'])) {
    $fuel_id = $_GET['id'];
    
    // Fetch the fuel data AND the station data so the user knows what they are editing
    $query = "
        SELECT 
            station_fuels.*, 
            stations.name AS station_name, 
            stations.location 
        FROM station_fuels
        JOIN stations ON station_fuels.station_id = stations.id
        WHERE station_fuels.id = $fuel_id
    ";
    
    $result = $conn->query($query);
    
    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
    } else {
        header("location: index.php"); // Go back if the ID is invalid
        exit();
    }
} else {
    header("location: index.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Gas Price</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-5">
            <div class="card shadow-sm border-warning">
                <div class="card-header bg-warning text-dark">
                    <h5 class="mb-0">✏️ Edit Fuel Details</h5>
                </div>
                <div class="card-body">
                    <div class="alert alert-secondary">
                        <strong>Branch:</strong> <?= $row['station_name']; ?> (<?= $row['location']; ?>)
                    </div>

                    <form action="process.php" method="POST">
                        <input type="hidden" name="fuel_id" value="<?= $row['id']; ?>">
                        
                        <div class="mb-3">
                            <label class="form-label text-muted small text-uppercase">Gas Type</label>
                            <select name="gas_type" class="form-select" required>
                                <option value="Regular" <?= ($row['gas_type'] == 'Regular') ? 'selected' : ''; ?>>Regular</option>
                                <option value="Premium" <?= ($row['gas_type'] == 'Premium') ? 'selected' : ''; ?>>Premium</option>
                                <option value="Diesel" <?= ($row['gas_type'] == 'Diesel') ? 'selected' : ''; ?>>Diesel</option>
                            </select>
                        </div>
                        
                        <div class="mb-4">
                            <label class="form-label text-muted small text-uppercase">Price (₱)</label>
                            <input type="number" step="0.01" name="price" class="form-control form-control-lg text-success fw-bold" value="<?= $row['price']; ?>" required>
                        </div>
                        
                        <div class="d-flex justify-content-between">
                            <a href="index.php" class="btn btn-outline-secondary">Cancel</a>
                            <button type="submit" name="update_fuel" class="btn btn-warning fw-bold">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>