-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Apr 16, 2026 at 05:09 AM
-- Server version: 8.4.5-5
-- PHP Version: 8.1.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gas_db2`
--
CREATE DATABASE IF NOT EXISTS `gas_db2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `gas_db2`;

-- --------------------------------------------------------

--
-- Table structure for table `gas_types`
--

CREATE TABLE `gas_types` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'unleaded',
  `color_code` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'green'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gas_types`
--

INSERT INTO `gas_types` (`id`, `name`, `category`, `color_code`) VALUES
(9, 'Power Diesel', 'diesel', 'gray'),
(10, 'Diesel', 'diesel', 'gray'),
(11, 'Kerosene', 'unleaded', 'green'),
(12, 'Unleaded', 'unleaded', 'green'),
(14, 'Special', 'premium', 'red'),
(16, 'Diesel Power V', 'diesel', 'gray'),
(22, 'Premium', 'premium', 'red'),
(23, 'XTRA Advance', 'unleaded', 'green'),
(24, 'XCS', 'premium', 'red'),
(25, 'Regular', 'unleaded', 'green'),
(26, 'Diesel Max', 'diesel', 'gray'),
(27, 'Turbo Diesel', 'diesel', 'gray'),
(28, 'Fuel Save Gasoline', 'unleaded', 'green'),
(29, 'V-Power Gasoline ', 'premium', 'red'),
(30, 'Diesel Fuel Save', 'diesel', 'gray'),
(31, 'V-Power Diesel', 'diesel', 'gray'),
(32, 'Fuel Save Diesel', 'diesel', 'gray'),
(33, 'Premium Gasoline', 'premium', 'red'),
(34, 'Green Gasoline', 'unleaded', 'green'),
(35, 'Extra', 'unleaded', 'green'),
(36, 'Super 93(Green)', 'unleaded', 'green'),
(37, 'Regular Gasoline', 'unleaded', 'green'),
(38, 'Thunder (Red)', 'premium', 'red'),
(39, 'Volt (Green)', 'unleaded', 'green'),
(40, 'Gasoline', 'unleaded', 'green'),
(41, 'Power Premium', 'premium', 'red'),
(42, 'Gasoline Green', 'unleaded', 'green'),
(43, 'Gasoline Green2', 'unleaded', 'green'),
(44, 'tt', 'premium', 'red'),
(45, 'tt2', 'diesel', 'gray'),
(46, 'tt23', 'premium', 'red');

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int NOT NULL,
  `station_id` int NOT NULL,
  `user_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `rating` int DEFAULT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `photo_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ip_address` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `is_approved` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `station_id`, `user_name`, `rating`, `comment`, `photo_path`, `ip_address`, `is_approved`, `created_at`) VALUES
(8, 3, 'Gwapo', 5, 'Latest price shell dakit', 'uploads/1775539153_e6532f8c05.jpeg', '172.70.143.169', 1, '2026-04-07 05:19:13');

-- --------------------------------------------------------

--
-- Table structure for table `stations`
--

CREATE TABLE `stations` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `location` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stations`
--

INSERT INTO `stations` (`id`, `name`, `location`, `latitude`, `longitude`, `user_id`) VALUES
(1, 'Shell (Cantecson)', ' Cantecson, Bogo City, Cebu', 11.05310400, 124.01173300, 3),
(3, 'Shell Dakit', 'Dakit Bogo City', 11.03204900, 124.00104100, 3),
(6, 'Petron (Cantecson)', 'Cantecson Gairan, Bogo, Cebu', 11.05362500, 124.01272800, 6),
(7, 'Shell (San Rem)', 'Shell Argawanon, San Remigio', 11.06861500, 123.96030100, NULL),
(11, 'Seaoil', 'Cebu North Hagnaya Wharf Rd, Bogo City, Cebu', 11.04580800, 123.99745500, 6),
(12, 'Star Oil', '3X6F+R35, Don Pedro, National Road, Bogo City, Lalawigan ng Cebu', 11.06189100, 123.97261000, 6),
(13, 'MADIL GASOLINE SERVICE STATION', 'Cebu North Hagnaya Wharf Rd, Bogo City, Cebu', 11.04943400, 123.99085400, 6),
(14, 'JYA Gasoline Staton', '119 P. Rodriguez St, Bogo City, Cebu', 11.04842900, 124.00450700, 6),
(15, 'FERC Fuels', 'Bogo City, Cebu', 11.02322000, 123.99809900, 6),
(16, 'COOL GAS STATION', '2XFX+WG6, Bogo City, Cebu', 11.02480900, 123.99881500, 6),
(17, 'Flying V', 'Central Nautical Hwy, Bogo City, Cebu', 11.03162200, 124.00058000, 6),
(18, 'Tec Fuel (Bogo City)', 'Bogo City, Cebu', 11.04532700, 124.00001700, 7),
(19, 'Tec Fuel (San Remigio)', 'San Remigio', 11.07297400, 123.95343500, 6),
(20, 'GESU FUELS', 'Libertad, Bogo City', 11.03186400, 124.02092700, 8),
(21, 'Petron (City Hall Highway)', 'Cayang, Bogo City', 11.05452500, 123.98362000, 6),
(22, 'Horte', 'Guadalupe, Bogo City, Cebu', NULL, NULL, 6),
(23, 'Light Fuels Express', 'Binabag, Bogo City, Cebu', 10.96792000, 123.96337500, 6);

-- --------------------------------------------------------

--
-- Table structure for table `station_fuels`
--

CREATE TABLE `station_fuels` (
  `id` int NOT NULL,
  `station_id` int NOT NULL,
  `gas_type_id` int NOT NULL,
  `price` decimal(5,2) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `station_fuels`
--

INSERT INTO `station_fuels` (`id`, `station_id`, `gas_type_id`, `price`, `updated_at`) VALUES
(26, 20, 22, 88.25, '2026-04-14 07:44:35'),
(27, 20, 12, 87.75, '2026-04-14 07:44:42'),
(28, 20, 10, 126.00, '2026-04-14 07:44:52'),
(29, 21, 10, 122.11, '2026-04-14 07:53:12'),
(30, 21, 23, 89.50, '2026-04-14 07:53:26'),
(31, 21, 24, 91.50, '2026-04-14 07:53:19'),
(32, 11, 12, 94.50, '2026-04-13 10:42:30'),
(33, 11, 14, 89.57, '2026-04-14 07:52:37'),
(34, 18, 10, 129.00, '2026-04-14 16:09:49'),
(35, 18, 22, 90.50, '2026-04-14 07:42:41'),
(36, 18, 25, 88.90, '2026-04-14 07:43:06'),
(37, 6, 26, 122.10, '2026-04-14 07:43:30'),
(38, 6, 27, 125.10, '2026-04-14 07:43:41'),
(39, 6, 23, 89.50, '2026-04-14 07:44:07'),
(40, 6, 24, 91.50, '2026-04-14 07:43:54'),
(41, 1, 10, 123.70, '2026-04-14 07:51:22'),
(42, 1, 28, 92.30, '2026-04-14 07:51:45'),
(43, 1, 29, 94.30, '2026-04-14 07:51:34'),
(44, 3, 32, 123.70, '2026-04-14 07:46:22'),
(45, 3, 31, 129.60, '2026-04-14 07:46:14'),
(46, 3, 28, 92.30, '2026-04-14 07:46:51'),
(47, 3, 29, 94.30, '2026-04-14 07:46:38'),
(48, 16, 22, 99.80, '2026-04-14 07:45:34'),
(49, 16, 25, 97.80, '2026-04-14 07:45:44'),
(50, 16, 10, 145.70, '2026-04-14 07:45:24'),
(51, 13, 10, 122.11, '2026-04-14 07:49:13'),
(52, 13, 33, 90.07, '2026-04-14 07:50:02'),
(54, 11, 10, 122.11, '2026-04-14 07:52:12'),
(55, 14, 22, 94.00, '2026-04-14 07:48:27'),
(56, 14, 35, 92.00, '2026-04-14 07:48:35'),
(57, 14, 10, 123.00, '2026-04-14 07:48:16'),
(58, 12, 10, 130.00, '2026-04-14 07:50:51'),
(59, 12, 22, 90.50, '2026-04-14 07:51:03'),
(60, 12, 36, 89.50, '2026-04-14 07:51:08'),
(61, 22, 10, 121.68, '2026-04-14 07:41:00'),
(62, 22, 33, 89.60, '2026-04-14 07:41:10'),
(63, 22, 37, 88.40, '2026-04-14 07:41:20'),
(64, 17, 38, 90.00, '2026-04-14 07:47:17'),
(65, 17, 39, 89.50, '2026-04-14 07:47:35'),
(66, 13, 34, 89.57, '2026-04-14 07:52:55'),
(67, 23, 40, 88.20, '2026-04-14 07:54:51'),
(68, 23, 41, 91.20, '2026-04-14 07:55:02'),
(69, 23, 10, 121.80, '2026-04-14 07:55:12');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('admin','station') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'station',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `role`, `created_at`) VALUES
(2, 'kev-admin', '$2y$10$FWq.5Do03bg3ukiZ.WNPUORkQTZV2usAkcZW9MWjBEqiQsKyd6J..', 'admin', '2026-04-06 10:14:17'),
(3, 'shell', '$2y$10$YR2iTOJNBW0Ft0Ki/SQQoeZukohuIQo0UhInqRqZtc739MzE/g2a2', 'station', '2026-04-06 10:21:46'),
(4, 'caltex', '$2y$10$hawvOXZoo71eIl64Y2pfyu9fPYHHab5aRyGkGe1g47nveiT19v1om', 'station', '2026-04-06 14:37:37'),
(6, 'test', '$2y$12$oU057CxQ48qOUnu1mxSUCuIwGoSZcKcTABOUz8bufP3E91gI1.PoO', 'station', '2026-04-06 16:11:53'),
(7, 'tecfuelbogo', '$2y$12$Gy4sKiv4PQmIWqzcM4i64elUT6qApfpCLmGmxuFSLUklslyve40sS', 'station', '2026-04-06 22:34:46'),
(8, 'gesufuelbogo', '$2y$12$i0W2xDwEC8ASjnTNw0AVw.40J2un1NrB5Q362rX5h1zaHv7soVvA.', 'station', '2026-04-06 22:39:40');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `gas_types`
--
ALTER TABLE `gas_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `station_id` (`station_id`);

--
-- Indexes for table `stations`
--
ALTER TABLE `stations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `station_fuels`
--
ALTER TABLE `station_fuels`
  ADD PRIMARY KEY (`id`),
  ADD KEY `station_id` (`station_id`),
  ADD KEY `gas_type_id` (`gas_type_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `gas_types`
--
ALTER TABLE `gas_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `stations`
--
ALTER TABLE `stations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `station_fuels`
--
ALTER TABLE `station_fuels`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stations`
--
ALTER TABLE `stations`
  ADD CONSTRAINT `stations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `station_fuels`
--
ALTER TABLE `station_fuels`
  ADD CONSTRAINT `station_fuels_ibfk_1` FOREIGN KEY (`station_id`) REFERENCES `stations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `station_fuels_ibfk_2` FOREIGN KEY (`gas_type_id`) REFERENCES `gas_types` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
