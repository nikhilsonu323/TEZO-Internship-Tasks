--39. How many employees are having each unique title. Select the title and display the number of employees present in ascending order
Select Count(*) As "Count Of Employees Having unique Titles" From (Select Title From Employees Group By Title Having Count(*)=1) As "Unique Titles"

Select Title , Count(*) As "Employees Count" From Employees Group By Title Order By "Employees Count"

--40. What is the average salary of each unique title of the employees. Select the title and display the average salary of employees in each
Select Title , Avg(Salary) As "Average Salary" From Employees Group By Title

--41. What is the average salary of employees excluding Freshers
Select Avg(Salary) As "Average Salary" From Employees where Title!='Fresher'

--42. What is the average age of employees of each unique title.
Select Title , Avg(Age) As "Average Age" From Employees Group By Title

--43. In the age range of 25 to 40 get the number of employees under each unique title.
Select Title, COUNT(*) As "Number of Employees" From Employees where age between 25 and 40 Group By Title

--44. Show the average salary of each unique title of employees only if the average salary is not less than 25000
Select Title , Avg(Salary) As "Average Salary" From Employees Group By Title Having Avg(Salary)>=25000

--45. Show the sum of ages of each unique title of employee only if the sum of age is greater than 30
Select Title , Sum(Age) As "Age" From Employees Group By Title Having Sum(Age)>30
