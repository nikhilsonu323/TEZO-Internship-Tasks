--1. Get the firstname and lastname of the employees who placed orders between 15th August,1996 and 15th August,1997
Select Distinct firstname, lastname from Employee join Orders on Orders.EmployeeID=Employee.EmployeeID 
where Orders.OrderDate between '15 August 1996' and '15 August 1997'


--2. Get the distinct EmployeeIDs who placed orders before 16th October,1996
Select Distinct Employee.EmployeeID from Employee join Orders on Orders.EmployeeID=Employee.EmployeeID 
where Orders.OrderDate < '16 October 1996'


--3. How many products were ordered in total by all employees between 13th of January,1997 and 16th of April,1997.
Select COUNT(od.ProductID) As "Count of Orders" from Orders 
join OrderDetails od on od.OrderID=Orders.OrderID
where Orders.OrderDate between '13 January 1997' and '16 April 1997'

--4. What is the total quantity of products for which Anne Dodsworth placed orders between 13th of January,1997 and 16th of April,1997.
Select SUM(OrderDetails.Quantity) As "Total Quantity" from Employee
join Orders on Orders.EmployeeID=Employee.EmployeeID 
join OrderDetails on OrderDetails.OrderID=Orders.OrderID 
where Orders.OrderDate between '13 January 1997' and '16 April 1997' 
and Employee.FirstName='Anne' and Employee.LastName='Dodsworth'


Select SUM(OrderDetails.Quantity) As "Total Quantity" from Orders
join OrderDetails on OrderDetails.OrderID=Orders.OrderID 
where Orders.OrderDate between '13 January 1997' and '16 April 1997' 
and Orders.EmployeeID = (Select EmployeeId from Employee where Employee.FirstName='Anne' and Employee.LastName='Dodsworth')


--5. How many orders have been placed in total by Robert King
Select COUNT(*) As "Total Orders Placed" from Employee
join Orders on Orders.EmployeeID=Employee.EmployeeID 
where Employee.FirstName='Robert' and Employee.LastName='King'


--6. How many products have been ordered by Robert King between 15th August,1996 and 15th August,1997 Total Products
Select SUM(OrderDetails.Quantity) As "Total Quantity Ordered" from Employee
join Orders on Orders.EmployeeID=Employee.EmployeeID
join OrderDetails on Orders.OrderID=OrderDetails.OrderID
where Orders.OrderDate between '15 August 1996' and '15 August 1997'
and Employee.FirstName='Robert' and Employee.LastName='King'

--Total Orders
Select Count(*) As "Total Orders" from Employee
join Orders on Orders.EmployeeID=Employee.EmployeeID
where Orders.OrderDate between '15 August 1996' and '15 August 1997'
and Employee.FirstName='Robert' and Employee.LastName='King'

--Total Products
Select Count(Distinct p.ProductID) As "Total Products" from Employee
join Orders o on o.EmployeeID=Employee.EmployeeID
join OrderDetails od on od.OrderID = o.OrderID
join Products p on p.ProductID = od.ProductID
where o.OrderDate between '15 August 1996' and '15 August 1997'
and Employee.FirstName='Robert' and Employee.LastName='King'


--7. I want to make a phone call to the employees to wish them on the occasion of Christmas who placed
--orders between 13th of January,1997 and 16th of April,1997. I want the EmployeeID, Employee Full Name,
--HomePhone Number.
Select Distinct emp.EmployeeID, emp.FirstName+' '+emp.LastName As "Full Name", emp.HomePhone From Employee emp 
join Orders on Orders.EmployeeID=emp.EmployeeID where Orders.OrderDate between '13 January 1997' and '16 April 1997'


--8. Which product received the most orders. Get the product's ID and Name and number of orders it received.
Select Top 1 Products.ProductID, Products.ProductName, Count(*) AS "Number Orders Received" From OrderDetails 
Join Products on Products.ProductID=OrderDetails.ProductID
Group by Products.ProductID, Products.ProductName
Order By "Number Orders Received" Desc


--9. Which are the least shipped products. List only the top 5 from your list.
Select Top 5 ProductID,Count(*) As "Number of Orders", Sum(Quantity) As "Number of Products" From OrderDetails Group By ProductID Order By COUNT(*)

--On No of Products shipped
Select Top 5 ProductID,Count(*) As "Number of Orders", Sum(Quantity) As "Number of Products" From OrderDetails Group By ProductID Order By "Number of Products"

--With Product Name
Select Top 5 p.ProductName,p.ProductID,Count(*) As "Number of Orders", Sum(Quantity) As "Number of Products" From OrderDetails 
Join Products p on p.ProductID=OrderDetails.ProductID
Group By p.ProductID,p.ProductName Order By COUNT(*)


--10. What is the total price that is to be paid by Laura Callahan for the order placed on 13th of January,1997
Select (od.UnitPrice*od.Quantity)-(od.UnitPrice*od.Quantity*od.Discount) As "Total Price", * From Employee e
join Orders o on o.EmployeeID=e.EmployeeID
join OrderDetails od on o.OrderID=od.OrderID
where e.FirstName = 'Laura' and e.LastName='Callahan' and o.OrderDate = '13 January 1997'


--11. How many number of unique employees placed orders for Gorgonzola Telino or Gnocchi di nonna Alice or
--Raclette Courdavault or Camembert Pierrot in the month January,1997
Select Count(Distinct e.EmployeeID) From Employee e
join Orders o on o.EmployeeID=e.EmployeeID
join OrderDetails od on o.OrderID=od.OrderID
Join Products p on p.ProductID=od.ProductID
where p.ProductName in ('Gorgonzola Telino','Gnocchi di nonna Alice','Raclette Courdavault','Camembert Pierrot') 
and Month(o.OrderDate)=1 and YEAR(o.OrderDate)=1997


--12. What is the full name of the employees who ordered Tofu between 13th of January,1997 and 30th of January,1997
Select  e.FirstName+' '+e.LastName As "Full Name" From Employee e
join Orders o on o.EmployeeID=e.EmployeeID
join OrderDetails od on o.OrderID=od.OrderID
Join Products p on p.ProductID=od.ProductID
where p.ProductName = 'Tofu' 
and o.OrderDate  between '13 January 1997' and '30 January 1997'


--13. What is the age of the employees in days, months and years who placed orders during the month of August. Get employeeID and full name as well

---Modify the days and months---
Select Distinct e.EmployeeID, e.FirstName+' '+e.LastName As "Full Name", DATEDIFF(day,e.BirthDate,GETDATE()) As "Age in Days", 
DATEDIFF(Month,e.BirthDate,GETDATE()) As "Age in Months" , DATEDIFF(Year,e.BirthDate,GETDATE()) As "Age in Years" From Employee e
join Orders o on o.EmployeeID=e.EmployeeID
where MONTH(o.OrderDate) = 8


--14. Get all the shipper's name and the number of orders they shipped
Select o.ShipperID ,sh.CompanyName, COUNT(*) As "Number of Orders Shipped" From Orders o
Join Shippers sh on o.ShipperID=sh.ShipperID
Group By o.ShipperID,sh.CompanyName 
order by ShipperID


--15. Get the all shipper's name and the number of products they shipped.
Select o.ShipperID ,sh.CompanyName, COUNT(p.ProductID) As "Number of Orders Shipped" From Orders o
Join Shippers sh on o.ShipperID=sh.ShipperID
Join OrderDetails od on od.OrderID=o.OrderID
Join Products p on p.ProductID = od.ProductID
Group By o.ShipperID,sh.CompanyName 
order by ShipperID


--16. Which shipper has bagged most orders. Get the shipper's id, name and the number of orders.
Select Top 1 o.ShipperID ,sh.CompanyName, COUNT(*) As "Number of Orders Shipped" From Orders o
Join Shippers sh on o.ShipperID=sh.ShipperID
Group By o.ShipperID,sh.CompanyName 
order by "Number of Orders Shipped" Desc 


--17. Which shipper supplied the most number of products between 10th August,1996 and 20th September,1998. Get the shipper's name and the number of products.
Select Top 1 sh.CompanyName, Count(od.ProductId) As "No of Products Shipped" From Orders o
Join OrderDetails od on od.OrderID=o.OrderID
Join Shippers sh on o.ShipperID=sh.ShipperID
where o.ShippedDate between '10 August 1996' and '20 September 1998'
Group By o.ShipperID,sh.CompanyName order by "No of Products Shipped" desc


--18. Which employee didn't order any product 4th of April 1997
--Using Left join
Select Distinct e.EmployeeID, e.FirstName+' '+e.LastName As "Full Name" From Employee e 
Left join Orders on Orders.EmployeeID=e.EmployeeID and Orders.OrderDate = '4 April 1997'
where Orders.OrderID IS NULL

--Using Sub Query
Select  EmployeeID, FirstName+' '+LastName As "Full Name" From Employee
where EmployeeID not in 
(Select e.EmployeeId From Employee e join Orders on Orders.EmployeeID = e.EmployeeID where OrderDate = '4 April 1997')


--19. How many products where shipped to Steven Buchanan
Select Count(od.ProductID) As "No of Products Shipped" From Employee e join Orders o on o.EmployeeID=e.EmployeeID 
join OrderDetails od on od.OrderID=o.OrderID
where e.FirstName='Steven' and LastName='Buchanan'


--20. How many orders where shipped to Michael Suyama by Federal Shipping
Select Count(o.OrderId) As "No of Orders Shipped" From Employee e 
join Orders o on o.EmployeeID=e.EmployeeID
join Shippers sh on sh.ShipperID=o.ShipperID
where e.FirstName='Michael' and LastName='Suyama' and sh.CompanyName='Federal Shipping'


--21. How many orders are placed for the products supplied from UK and Germany
Select COUNT(Distinct o.OrderID) As"Orders Placed" From Orders o
join OrderDetails od on od.OrderID=o.OrderID
join Products p on p.ProductID=od.ProductID
join Suppliers su on su.SupplierID=p.SupplierID
where su.Country in ('UK','Germany')


--22. How much amount Exotic Liquids received due to the order placed for its products in the month of January,1997
Select SUM((od.Quantity*od.UnitPrice)-(od.Quantity*od.UnitPrice*od.Discount)) as "Amount" From Orders o
join OrderDetails od on od.OrderID=o.OrderID
join Products p on p.ProductID=od.ProductID
join Suppliers su on su.SupplierID=p.SupplierID
where su.CompanyName='Exotic Liquids' and MONTH(o.OrderDate) = 1 and YEAR(OrderDate) = 1997


--23. In which days of January, 1997, the supplier Tokyo Traders haven't received any orders.
Select value as "Days"  From GENERATE_SERIES(1,DAY(EOMONTH('1 January 1997')))
where value not in 
(Select DAY(o.OrderDate) From Orders o
join OrderDetails od on od.OrderID=o.OrderID
join Products p on p.ProductID=od.ProductID
join Suppliers su on su.SupplierID=p.SupplierID
where su.CompanyName='Tokyo Traders' and MONTH(o.OrderDate) = 1 and YEAR(OrderDate) = 1997)


--24. Which of the employees did not place any order for the products supplied by Ma Maison in the month of May
Select * From Employee where EmployeeId not in 
(Select e.EmployeeID From Employee e
join Orders o on e.EmployeeID=o.EmployeeID
join OrderDetails od on od.OrderID=o.OrderID
join Products p on p.ProductID=od.ProductID
join Suppliers su on su.SupplierID=p.SupplierID
where su.CompanyName='Ma Maison' and MONTH(o.OrderDate) = 5)

--25. Which shipper shipped the least number of products for the month of September and October,1997 combined.
Select sh.ShipperID,sh.CompanyName, Count(*) As "No of Products Shipped" From Orders o
join OrderDetails od on od.OrderID=o.OrderID
join Products p on p.ProductID=od.ProductID
join Shippers sh on sh.ShipperID=o.ShipperID
where MONTH(OrderDate) in (9,10) and YEAR(OrderDate)=1997 
Group by sh.ShipperID,sh.CompanyName Order by "No of Products Shipped"

--Practise
Select *,result."No of Products Shipped" From Shippers sh join
(Select Count(*) As "No of Products Shipped",ShipperID From Orders o
join OrderDetails od on od.OrderID=o.OrderID
join Products p on p.ProductID=od.ProductID
where MONTH(OrderDate) in (9,10) and YEAR(OrderDate)=1997 Group by ShipperID ) As result
on sh.ShipperID = result.ShipperId Order by result."No of Products Shipped"


--26. What are the products that weren't shipped at all in the month of August, 1997
Select * From Products where ProductId not in 
(Select p.ProductID From Orders o
join OrderDetails od on od.OrderID=o.OrderID
join Products p on p.ProductID=od.ProductID
where MONTH(ShippedDate) = 8 and YEAR(ShippedDate)=1997
Group by p.ProductID)


--27. What are the products that weren't ordered by each of the employees. List each employee and the products that he didn't order.
Select e.EmployeeID, e.FirstName+' '+e.LastName As "Full Name", p.ProductID, p.ProductName 
From Employee e Cross join Products p left join
(Select distinct o.EmployeeId,od.ProductID From Orders o
join OrderDetails od on od.OrderID=o.OrderID) As OrderedDetails 
on e.EmployeeID=OrderedDetails.EmployeeID and p.ProductID=OrderedDetails.ProductID
where OrderedDetails.EmployeeID is null


--28. Who is busiest shipper in the months of April, May and June during the year 1996 and 1997
Select sh.ShipperID,sh.CompanyName, Count(*) As "No of Orders Shipped" From Orders o
join Shippers sh on sh.ShipperID=o.ShipperID
where MONTH(OrderDate) in (4,5,6) and YEAR(OrderDate) in (1996,1997)
Group by sh.ShipperID,sh.CompanyName Order by "No of Orders Shipped" Desc


--29. Which country supplied the maximum products for all the employees in the year 1997
Select su.Country, COUNT(p.ProductID) As "No of Products Supplied" from Orders o 
join OrderDetails od on od.OrderID=o.OrderID
join Products p on p.ProductID=od.ProductID 
join Suppliers su on su.SupplierID=p.SupplierID
where Year(o.OrderDate) = 1997 
Group by su.Country order by "No of Products Supplied" Desc


--30. What is the average number of days taken by all shippers to ship the product after the order has been placed by the employees
Select sh.ShipperID, sh.CompanyName, Avg(DATEDIFF(DAY,o.OrderDate,o.ShippedDate)) As "Avg Days To Ship" From Orders o
join Shippers sh on o.ShipperID=sh.ShipperID
where o.ShippedDate is not null
Group by sh.ShipperID, sh.CompanyName


--31. Who is the quickest shipper of all.
Select Top 1 sh.ShipperID, sh.CompanyName, Avg(DATEDIFF(DAY,o.OrderDate,o.ShippedDate)) As "Avg Days To Ship" From Orders o
join Shippers sh on o.ShipperID=sh.ShipperID
Group by sh.ShipperID, sh.CompanyName order by "Avg Days To Ship"


--32. Which order took the least number of shipping days. Get the orderid, employees full name, number of
--products, number of days took to ship and shipper company name.

Select o.OrderID, e.FirstName+' '+e.LastName As "Full Name", DATEDIFF(DAY,o.OrderDate,o.ShippedDate) As "Shipping Days",
	   "OrderedDetails".[No of Products], sh.CompanyName
From Employee e
join Orders o on e.EmployeeID = o.EmployeeID
join Shippers sh on sh.ShipperID=o.ShipperID
join (Select Count(od.OrderID) As "No of Products", od.OrderID 
	 From Orders o 
	 join OrderDetails od on od.OrderID = o.OrderID 
	 Group by od.OrderID) As "OrderedDetails" on o.OrderID="OrderedDetails".OrderID
Where DATEDIFF(DAY,o.OrderDate,o.ShippedDate) in 
	(Select MIN(DATEDIFF(DAY,o.OrderDate,o.ShippedDate)) From Orders o 
join Shippers sh on sh.ShipperID=o.ShipperID)
Order by [No of Products] 