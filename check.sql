CREATE TABLE `users` (
  `user_id` INT(11) NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'client') NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `books` (
  `book_id` INT(11) NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `author` VARCHAR(255) NOT NULL,
  `status` ENUM('available', 'checked out', 'requested') NOT NULL,
  `borrower_id` INT(11),
  `checkout_date` DATETIME,
  `return_date` DATETIME,
  `next_checkout_date` DATETIME,
  PRIMARY KEY (`book_id`),
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE requests (
  request_id INT(11) NOT NULL AUTO_INCREMENT,
  user_id INT(11) NOT NULL,
  book_id INT(11) NOT NULL,
  book_status ENUM('pending', 'approved', 'rejected') NOT NULL,
  PRIMARY KEY (request_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (book_id) REFERENCES books(book_id)
);