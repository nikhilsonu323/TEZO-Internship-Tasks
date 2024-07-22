--5. Select all columns for everyone with a salary over 38000.
Select * from Employees where salary > 38000

--6. Select first and last names for everyone that's under 24 years old.
Select Firstname, Lastname from Employees where age < 24

--7. Select first name, last name, and salary for anyone with "Programmer" in their title.
Select Firstname, Lastname, Salary from Employees where Title Like '%Programmer%'

--8. Select all columns for everyone whose last name contains "O".
Select * from Employees where Lastname Like '%O%'

--9. Select the lastname for everyone whose first name equals "Kelly".
Select Lastname from Employees where Firstname = 'Kelly'

--10. Select all columns for everyone whose last name ends in "Moore".
Select * from Employees where LastName Like '%Moore'

--11. Select all columns for everyone who are 35 and above.
Select * from Employees where Age >= 35
