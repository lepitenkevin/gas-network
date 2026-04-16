<?php
// Rename the session to avoid conflicts with other apps on your server
session_name("GAS_PROJECT_SESSION");
session_start();

// Add these to be 100% sure the browser doesn't keep a "ghost" copy
header("Cache-Control: no-cache, no-store, must-revalidate"); 
header("Pragma: no-cache"); 
header("Expires: 0");

if (!isset($_SESSION['user_id'])) {
    header("Location: login.php");
    exit();
}
$role = $_SESSION['role'];
?>
<?php
include 'db.php';

if (!isset($_GET['id'])) {
    header("location: index.php");
    exit();
}

$station_id = $_GET['id'];

// 1. Fetch Station Details
$station_result = $conn->query("SELECT * FROM stations WHERE id = $station_id");
$station = $station_result->fetch_assoc();

// 2. Fetch Fuels for this specific station
$fuels_query = "
    SELECT 
        station_fuels.id AS fuel_id, 
        gas_types.name AS gas_name, 
        gas_types.category, 
        gas_types.color_code, 
        station_fuels.price, 
        station_fuels.updated_at
    FROM station_fuels
    JOIN gas_types ON station_fuels.gas_type_id = gas_types.id
    WHERE station_fuels.station_id = $station_id
    ORDER BY gas_types.name
";
$fuels = $conn->query($fuels_query);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($station['name']); ?> Profile</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</head>
<body class="bg-light">

<div class="container mt-5 mb-5">
    <div class="mb-3">
        <a href="index.php" class="btn btn-secondary">← Back to Network</a>
    </div>

    <div class="row g-4">
        <div class="col-md-5">
            <div class="card shadow-sm border-primary mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">🏢 Station Info & Location</h5>
                </div>
                <div class="card-body">
                    <form action="process.php" method="POST">
                        <input type="hidden" name="station_id" value="<?= $station['id']; ?>">
                        
                        <?php if ($role === 'admin'): ?>
                        <div class="mb-3 border-top pt-3">
                            <label class="form-label fw-bold text-primary">👤 Assign Station Manager</label>
                            <select name="assigned_user" class="form-select">
                                <option value="">-- No Manager Assigned --</option>
                                <?php
                                $user_list = $conn->query("SELECT id, username FROM users WHERE role = 'station' ORDER BY username ASC");
                                while($ul = $user_list->fetch_assoc()) {
                                    $selected = ($ul['id'] == $station['user_id']) ? 'selected' : '';
                                    echo "<option value='{$ul['id']}' $selected>{$ul['username']}</option>";
                                }
                                ?>
                            </select>
                            <div class="form-text">Only you (Admin) can see and change this.</div>
                        </div>
                        <?php else: ?>
                            <input type="hidden" name="assigned_user" value="<?= $station['user_id']; ?>">
                        <?php endif; ?>

                        <div class="mb-3">
                            <label class="form-label fw-bold">Brand</label>
                            <input type="text" name="name" class="form-control" value="<?= htmlspecialchars($station['name']); ?>" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label fw-bold">Location</label>
                            <input type="text" name="location" class="form-control" value="<?= htmlspecialchars($station['location']); ?>" required>
                        </div>

                        <h6 class="text-muted border-bottom pb-1 mt-4 mb-2">📍 Click Map to Set Pin</h6>
                        
                        <div id="map" style="height: 250px; width: 100%; border-radius: 5px; border: 1px solid #ccc; margin-bottom: 15px;"></div>

                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <label class="form-label small">Latitude</label>
                                <input type="number" step="any" id="latInput" name="latitude" class="form-control" value="<?= $station['latitude'] ?? ''; ?>" readonly>
                            </div>
                            <div class="col-6">
                                <label class="form-label small">Longitude</label>
                                <input type="number" step="any" id="lngInput" name="longitude" class="form-control" value="<?= $station['longitude'] ?? ''; ?>" readonly>
                            </div>
                        </div>

                        <button type="submit" name="update_station_profile" class="btn btn-primary w-100 mb-2 fw-bold">Save Changes</button>
                    </form>
                    
                    <hr>
                    <a href="process.php?delete_station=<?= $station['id']; ?>" class="btn btn-outline-danger w-100" onclick="return confirm('Delete this entire branch?');">Delete Station</a>
                </div>
            </div>
        </div>

        <div class="col-md-7">
            
            <div class="card shadow-sm mb-4">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">⛽ Manage Fuels & Prices</h5>
                </div>
                <div class="card-body">
                    
                    <form action="process.php" method="POST" class="mb-4 p-3 bg-light rounded border border-success border-opacity-25">
                        <input type="hidden" name="station_id" value="<?= $station['id']; ?>">
                        
                        <div class="row g-2 mb-3">
                            <div class="col-md-8">
                                <label class="form-label small text-muted fw-bold">Select or Type Gas Name</label>
                                <input type="text" name="custom_gas_name" list="gasOptions" class="form-control" placeholder="e.g. V-Power" required>
                                <datalist id="gasOptions">
                                    <?php
                                    $master_gases = $conn->query("SELECT name FROM gas_types ORDER BY name");
                                    while ($mg = $master_gases->fetch_assoc()) {
                                        echo "<option value='" . htmlspecialchars($mg['name']) . "'>";
                                    }
                                    ?>
                                </datalist>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label small text-muted fw-bold">Price (₱)</label>
                                <input type="number" step="0.01" name="price" class="form-control fw-bold text-success" placeholder="0.00" required>
                            </div>
                        </div>

                        <div class="row g-2 align-items-end border-top pt-2 mt-1">
                            <div class="col-12">
                                <small class="text-muted"><em style="font-size: 0.75rem;">If typing a brand <strong>new</strong> gas name, select its badge details below:</em></small>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label small text-muted mb-1">Category</label>
                                <select name="category" class="form-select form-select-sm">
                                    <option value="unleaded">Unleaded</option>
                                    <option value="premium">Premium</option>
                                    <option value="diesel">Diesel</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <label class="form-label small text-muted mb-1">Badge Color</label>
                                <select name="color_code" class="form-select form-select-sm">
                                    <option value="green">Green (Unleaded)</option>
                                    <option value="red">Red (Premium)</option>
                                    <option value="gray">Gray (Diesel)</option>
                                    <option value="blue">Blue</option>
                                    <option value="yellow">Yellow</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <button type="submit" name="add_fuel_to_profile" class="btn btn-success w-100 fw-bold btn-sm py-2">Add Fuel</button>
                            </div>
                        </div>
                    </form>
                    <table class="table table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th>Gas Type</th>
                                <th>Price</th>
                                <th>Last Updated</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if($fuels->num_rows == 0): ?>
                                <tr><td colspan="4" class="text-center text-muted py-4">No fuels added yet. Add one above!</td></tr>
                            <?php else: ?>
                                <?php while ($f = $fuels->fetch_assoc()): ?>
                                <tr>
                                    <td>
                                        <span class="fw-bold fs-6"><?= htmlspecialchars($f['gas_name']); ?></span><br>
                                        <?php 
                                            $color = $f['color_code'] ?? 'green';
                                            $badgeClass = ($color == 'red') ? 'bg-danger' : (($color == 'gray') ? 'bg-secondary' : 'bg-success');
                                        ?>
                                        <span class="badge <?= $badgeClass ?> text-uppercase" style="font-size: 0.65rem; letter-spacing: 0.5px;">
                                            <?= htmlspecialchars($f['category'] ?? 'unleaded'); ?>
                                        </span>
                                    </td>
                                    <td class="text-success fw-bold fs-5">₱<?= number_format($f['price'], 2); ?></td>
                                    <td class="small text-muted"><?= date('M d, g:i A', strtotime($f['updated_at'])); ?></td>
                                    <td class="text-end">
                                        <a href="edit_fuel.php?id=<?= $f['fuel_id']; ?>&station_id=<?= $station['id']; ?>" class="btn btn-sm btn-warning me-1">Edit</a>
                                        <a href="process.php?delete_profile_fuel=<?= $f['fuel_id']; ?>&station_id=<?= $station['id']; ?>" class="btn btn-sm btn-danger" onclick="return confirm('Remove this fuel from your station?');">X</a>
                                    </td>
                                </tr>
                                <?php endwhile; ?>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="card shadow-sm">
                <div class="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">💬 User Reviews & Moderation</h5>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th>User / Date</th>
                                    <th>Rating</th>
                                    <th>Comment</th>
                                    <th>Photo</th>
                                    <th class="text-end">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $reviews_query = "SELECT * FROM reviews WHERE station_id = $station_id ORDER BY is_approved ASC, created_at DESC";
                                $reviews_res = $conn->query($reviews_query);

                                if ($reviews_res->num_rows == 0): ?>
                                    <tr><td colspan="5" class="text-center py-4 text-muted">No reviews found for this station.</td></tr>
                                <?php else: 
                                    while ($rev = $reviews_res->fetch_assoc()): ?>
                                    <tr class="<?= $rev['is_approved'] == 0 ? 'table-warning' : '' ?>">
                                        <td>
                                            <strong><?= htmlspecialchars($rev['user_name']) ?></strong><br>
                                            <small class="text-muted"><?= date('M d, Y', strtotime($rev['created_at'])) ?></small>
                                        </td>
                                        <td>
                                            <span class="text-warning">
                                                <?= str_repeat('★', $rev['rating']) ?><?= str_repeat('☆', 5 - $rev['rating']) ?>
                                            </span>
                                        </td>
                                        <td style="max-width: 300px;">
                                            <p class="mb-0 small"><?= nl2br(htmlspecialchars($rev['comment'])) ?></p>
                                            <small class="text-muted font-monospace" style="font-size: 0.7rem;">IP: <?= $rev['ip_address'] ?></small>
                                        </td>
                                        <td>
                                            <?php if ($rev['photo_path']): ?>
                                                <a href="<?= $rev['photo_path'] ?>" target="_blank">
                                                    <img src="<?= $rev['photo_path'] ?>" class="rounded shadow-sm" style="height: 50px; width: 50px; object-fit: cover;">
                                                </a>
                                            <?php else: ?>
                                                <span class="text-muted small">None</span>
                                            <?php endif; ?>
                                        </td>
                                        <td class="text-end">
                                            <?php if ($rev['is_approved'] == 0): ?>
                                                <a href="process.php?approve_review=<?= $rev['id'] ?>&station_id=<?= $station_id ?>" class="btn btn-sm btn-success">Approve</a>
                                            <?php else: ?>
                                                <span class="badge bg-light text-success border me-2">Live</span>
                                            <?php endif; ?>
                                            <a href="process.php?delete_review=<?= $rev['id'] ?>&station_id=<?= $station_id ?>" 
                                               class="btn btn-sm btn-outline-danger" 
                                               onclick="return confirm('Delete this review forever?')">Delete</a>
                                        </td>
                                    </tr>
                                    <?php endwhile; 
                                endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
    // 1. Get existing coordinates from database, or default to Bogo City
    var currentLat = <?= $station['latitude'] ? $station['latitude'] : '11.0500' ?>;
    var currentLng = <?= $station['longitude'] ? $station['longitude'] : '124.0000' ?>;

    // 2. Initialize the map
    var map = L.map('map').setView([currentLat, currentLng], 14);

    // 3. Load the map visual tiles from OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // 4. Create an empty variable for the map marker
    var marker;

    // 5. If the station already has coordinates in the database, draw the marker immediately
    <?php if($station['latitude'] && $station['longitude']): ?>
        marker = L.marker([currentLat, currentLng]).addTo(map);
    <?php endif; ?>

    // 6. The Magic Click Event: When you click the map, it moves the pin and updates the input fields
    map.on('click', function(e) {
        var clickedLat = e.latlng.lat.toFixed(6);
        var clickedLng = e.latlng.lng.toFixed(6);

        document.getElementById('latInput').value = clickedLat;
        document.getElementById('lngInput').value = clickedLng;

        if (marker) {
            marker.setLatLng(e.latlng);
        } else {
            marker = L.marker(e.latlng).addTo(map);
        }
    });
</script>

</body>
</html>