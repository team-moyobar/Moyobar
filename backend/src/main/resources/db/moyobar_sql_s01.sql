-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema moyobardb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema moyobardb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `moyobardb` DEFAULT CHARACTER SET utf8 ;
USE `moyobardb` ;

-- -----------------------------------------------------
-- Table `moyobardb`.`drink_limit`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `moyobardb`.`drink_limit` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `beer` INT NULL,
  `liquor` INT NULL,
  `soju` INT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `moyobardb`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `moyobardb`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `user_id` VARCHAR(100) NOT NULL,
  `nickname` VARCHAR(45) NULL,
  `password` VARCHAR(100) NOT NULL,
  `birthday` DATETIME NULL,
  `user_img` VARCHAR(45) NULL,
  `user_level` VARCHAR(45) NULL,
  `phoneNum` VARCHAR(13) NULL,
  `drink_limit_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_user_drink_limit_idx` (`drink_limit_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_drink_limit`
    FOREIGN KEY (`drink_limit_id`)
    REFERENCES `moyobardb`.`drink_limit` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
