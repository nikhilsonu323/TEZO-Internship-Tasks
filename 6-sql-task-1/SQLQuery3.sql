--12. Select firstname ,lastname,age and salary of everyone whose age is above 24 and below 43.
Select FirstName, LastName, Age, Salary From Employees where Age between 25 and 42

--13. Select firstname, title and lastname whose age is in the range 28 and 62 and salary greater than 31250
Select FirstName, LastName, Title From Employees where Age between 28 and 62  and Salary>31250

--14. Select all columns for everyone whose age is not more than 48 and salary not less than 21520
Select * From Employees where Age<=48 and Salary>=21520

--15. Select firstname and age of everyone whose firstname starts with "John" and salary in the range 25000 and 35000
Select Firstname, Age, Id, Salary From Employees where Firstname Like 'John%' and Salary between 25000 and 35000