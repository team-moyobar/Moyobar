-- MySQL dump 10.13  Distrib 8.0.27, for Win64 (x86_64)
--
-- Host: i6d210.p.ssafy.io    Database: moyobardb
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `drink`
--

DROP TABLE IF EXISTS `drink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drink` (
  `id` int NOT NULL AUTO_INCREMENT,
  `beer` int DEFAULT '0' COMMENT 'n잔 기준',
  `liquor` int DEFAULT '0' COMMENT 'n잔 기준',
  `soju` int DEFAULT '0' COMMENT 'n잔 기준',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start` datetime NOT NULL,
  `end` datetime NOT NULL,
  `category_id` int NOT NULL COMMENT '게임 카테고리 아이디',
  PRIMARY KEY (`id`),
  KEY `fk_game_game_category1_idx` (`category_id`),
  CONSTRAINT `fk_game_game_category1` FOREIGN KEY (`category_id`) REFERENCES `game_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=451 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_category`
--

DROP TABLE IF EXISTS `game_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL COMMENT '게임 종류가 2개밖에 없다면 굳이 필요없는 듯한 테이블...',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `game_winner`
--

DROP TABLE IF EXISTS `game_winner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_winner` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `game_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_game_winner_user1_idx` (`user_id`),
  KEY `fk_game_winner_game1_idx` (`game_id`),
  CONSTRAINT `fk_game_winner_game1` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`),
  CONSTRAINT `fk_game_winner_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=230 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `meeting_has_game`
--

DROP TABLE IF EXISTS `meeting_has_game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_has_game` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `meeting_id` int NOT NULL,
  `game_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_conference_has_game_game1_idx` (`game_id`),
  KEY `fk_conference_has_game_conference1_idx` (`meeting_id`),
  CONSTRAINT `fk_conference_has_game_conference1` FOREIGN KEY (`meeting_id`) REFERENCES `meeting_room` (`id`),
  CONSTRAINT `fk_conference_has_game_game1` FOREIGN KEY (`game_id`) REFERENCES `game` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=339 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `meeting_history`
--

DROP TABLE IF EXISTS `meeting_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action` varchar(45) NOT NULL DEFAULT 'JOIN',
  `inserted` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'inserted_time',
  `user_id` int NOT NULL,
  `meeting_id` int NOT NULL,
  `exited` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_conference_history_user1_idx` (`user_id`),
  KEY `fk_conference_history_conference1_idx` (`meeting_id`),
  CONSTRAINT `fk_conference_history_conference1` FOREIGN KEY (`meeting_id`) REFERENCES `meeting_room` (`id`),
  CONSTRAINT `fk_conference_history_user1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=476 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `meeting_room`
--

DROP TABLE IF EXISTS `meeting_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_room` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'call_start_time',
  `end` datetime DEFAULT NULL COMMENT 'call_end_time',
  `title` varchar(50) NOT NULL,
  `desc` varchar(200) DEFAULT NULL COMMENT 'description',
  `is_active` tinyint NOT NULL DEFAULT '1',
  `max` int NOT NULL DEFAULT '6' COMMENT '최대 인원',
  `pwd` varchar(200) DEFAULT NULL COMMENT '비공개방-비밀번호',
  `owner` int NOT NULL COMMENT '방장의 ID\\\\nowner_nick',
  `thumbnail` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `theme` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_conference_user1` (`owner`),
  CONSTRAINT `fk_conference_user1` FOREIGN KEY (`owner`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(100) NOT NULL COMMENT 'email address-최대 100글자(영문자)\\\\n소셜 로그인의 경우 아이디값 못 받아올 수 있음->추후에 null로 바꿀 수도 있음!',
  `nick` varchar(45) NOT NULL,
  `pwd` varchar(100) DEFAULT NULL COMMENT '소셜 로그인의 경우 비밀번호값 못 받아올 수 있음->추후에 null로 바꿀 수도 있음!',
  `birth` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '디폴트는 현재 날짜',
  `img` varchar(200) DEFAULT 'https://moyobar.s3.ap-northeast-2.amazonaws.com/Moyobar_file_default.jpg' COMMENT 'url로 저장-path와 이미지 이름',
  `score` int DEFAULT '0' COMMENT '유저 레벨(티어) 측정하기 위한 점수 정보-프론트에 넘겨줄 때에는 ''브론즈'' 등으로 String값 넘겨주기',
  `drink_id` int DEFAULT NULL COMMENT '최대 주량 정보',
  `phone` varchar(13) DEFAULT NULL,
  `type` varchar(45) DEFAULT 'LOCAL',
  `first` tinyint(1) DEFAULT '0',
  `desc` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `nickname_UNIQUE` (`nick`),
  KEY `fk_user_drink_limit1_idx` (`drink_id`),
  CONSTRAINT `fk_user_drink_limit1` FOREIGN KEY (`drink_id`) REFERENCES `drink` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=107 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-02-18  2:14:27
