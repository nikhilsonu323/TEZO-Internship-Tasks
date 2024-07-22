--35. Select the eldest employee's firstname, lastname and age whose salary is less than 35000
Select * From Employees where Age = (Select Max(Age) From Employees where Salary<35000) and Salary<35000

--36. Who is the youngest General Manager
Select * From Employees where Age = (Select Min(Age) From Employees where Title='General Manager') and Title='General Manager'

--37. Select the eldest fresher whose salary is less than 35000
Select * From Employees where Age = (Select Max(Age) From Employees where Salary<35000 and Title='Fresher') and Salary<35000 and Title='Fresher'

--38. Select firstname and age of everyone whose firstname starts with "John" or "Michael" and salary in the range 17000 and 26000
Select FirstName, Age From Employees where (FirstName like '%John%' or FirstName like '%Michael%') and Salary between 17000 and 26000
