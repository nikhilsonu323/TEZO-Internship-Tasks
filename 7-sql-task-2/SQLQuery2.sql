--1. Which orders took the least number and maximum number of shipping days? Get the orderid, employees
--full name, number of products, number of days taken to ship the product and shipper company name. Use
--1 and 2 in the final result set to distinguish the 2 orders.


Select o.OrderID, e.FirstName+' '+e.LastName As "Full Name", DATEDIFF(DAY,o.OrderDate,o.ShippedDate) As "Shipping Days",
	   "OrderedDetails".[No of Products], sh.CompanyName, 1 As Result
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

UNION

Select o.OrderID, e.FirstName+' '+e.LastName As "Full Name", DATEDIFF(DAY,o.OrderDate,o.ShippedDate) As "Shipping Days",
	   "OrderedDetails".[No of Products], sh.CompanyName, 2 As Result
From Employee e
join Orders o on e.EmployeeID = o.EmployeeID
join Shippers sh on sh.ShipperID=o.ShipperID
join (Select Count(od.OrderID) As "No of Products", od.OrderID 
	 From Orders o 
	 join OrderDetails od on od.OrderID = o.OrderID 
	 Group by od.OrderID) As "OrderedDetails" on o.OrderID="OrderedDetails".OrderID
Where DATEDIFF(DAY,o.OrderDate,o.ShippedDate) in 
	(Select MAX(DATEDIFF(DAY,o.OrderDate,o.ShippedDate)) From Orders o 
join Shippers sh on sh.ShipperID=o.ShipperID)
Order by "Shipping Days",[No of Products] 







--2. Which is cheapest and the costliest of products purchased in the second week of October, 1997. Get the
--product ID, product Name and unit price. Use 1 and 2 in the final result set to distinguish the 2 products.


with [ProductRanks] (ProductId, "Price Rank")
As ( (Select p.ProductID,DENSE_RANK() OVER(order by p.UnitPrice) from Products p 
	join OrderDetails od on p.ProductID=od.ProductID
	join Orders o on o.OrderID=od.OrderID
	where Month(o.OrderDate)=10 and Year(o.OrderDate)=1997 and 
	DATEPART(WEEK, o.OrderDate)-DATEPART(WEEK,DATEFROMPARTS(YEAR(o.OrderDate),MONTH(o.OrderDate),1))+1 = 2) )
Select p.ProductID, p.ProductName, p.UnitPrice, '1' As Result From Products p 
join [ProductRanks] pr on pr.ProductId = p.ProductID and pr.[Price Rank] = 1
UNION
Select p.ProductID, p.ProductName, p.UnitPrice, '2' As Result From Products p 
join [ProductRanks] pr on pr.ProductId = p.ProductID and pr.[Price Rank] = (Select Max([Price Rank]) From [ProductRanks])




