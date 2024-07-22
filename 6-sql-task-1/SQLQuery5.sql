--22. Select all columns for everyone by their length of firstname in ascending order.
Select * From Employees Order By Len(Firstname)

--23. Select the number of employees whose age is above 45
Select Count(*) From Employees Where Age>45

--24. Show the results by adding 5 to ages and removing 250 from salaries of all employees
Select Age+5 As Age, Salary-250 As Salary From Employees

--25. Select the number of employees whose lastname ends with "re" or "ri" or "ks"
Select * From Employees Where LastName Like '%re' or LastName Like '%ri' or LastName Like '%ks'

--26. Select the average salary of all your employees
Select Avg(salary) As "Average Salary" From Employees

--27. Select the average salary of Freshers
Select Avg(salary) As "Average Freshers Salary" From Employees where Title='Fresher'

--28. Select the average age of Programmers
Select Avg(age) as "Average Age Of Programmers" From Employees Where Title='Programmer'

--29. Select the average salary of employees whose age is not less than 35 and not more than 50
Select Avg(Salary) as "Average salary" From Employees Where Age between 35 and 50

--30. Select the number of Freshers
Select Count(*) as "Freshers Count" From Employees where Title='Fresher'

--31. What percentage of programmers constitute your employees
Select Cast(Avg(Case when Title='Programmer' Then 100 Else 0 End) As Varchar) + '%' As "Percent Of Programmers" From Employees

Select ((Select Count(*) From Employees where Title='Programmer') *1.0 /(Select Count(*) From Employees))*100  As "Percent Of Programmers"

--32. What is the combined salary that you need to pay to the employees whose age is not less than 40
Select Sum(Salary) As "Avg Salary" from Employees where Age >= 40

--33. What is the combined salary that you need to pay to all the Freshers and Programmers for 1 month
Select Sum(Salary) As "Combined Salary" from Employees where Title='Fresher' or Title='Programmer'

--34. What is the combined salary that you need to pay to all the Freshers whose age is greater than 27 for 3years
Select Sum(Salary)*3*12 As "Combined Salary" from Employees where Title='Fresher' and Age>27
