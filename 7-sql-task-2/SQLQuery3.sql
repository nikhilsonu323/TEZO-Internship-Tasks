--1. Find the distinct shippers who are to ship the orders placed by employees with IDs 1, 3, 5, 7
--Show the shipper's name as "Express Speedy" if the shipper's ID is 2 and "United Package" if the shipper's
--ID is 3 and "Shipping Federal" if the shipper's ID is 1.

Select Distinct CASE When sh.ShipperID=1 Then 'Shipping Federal' 
					 When sh.ShipperID=2 Then 'Express Speedy'
					 When sh.ShipperID=3 Then 'United Package' End
					 As "Shipper's Name" 
					 From Orders o 
join Shippers sh on sh.ShipperID=o.ShipperID 
where o.EmployeeID in (1,3,5,7)