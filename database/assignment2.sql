
-- Insert Tony's account
INSERT into account (account_firstname, account_lastname, account_email, account_password) values('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');
-- Update account type
UPDATE account SET account_type = 'Admin' WHERE account_id = '1';
-- Delete Tony's account
DELETE FROM account WHERE account_id = 1;
-- Update GM Hummer Description
UPDATE inventory SET inv_description = 'Do you have 6 kids and like to go offroading? The Hummer gives you a large interior with an engine to get you out of any muddy or rocky situation.'WHERE inv_make = 'GM';
-- Inner Join classification to inventory
SELECT inv_make, inv_model FROM inventory JOIN classification ON inv_make = inv_model
-- Replace images to images/vehicles
SELECT REPLACE(inv_thumbnail AND inv_image, '/images', 'images/vehicles') FROM inventory;