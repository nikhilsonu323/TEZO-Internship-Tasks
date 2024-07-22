--Lisa Ray just got married to Michael Moore. She has requested that her last name be updated to Moore.
update Employees set LastName='Moore' where FirstName='Lisa' and LastName='Ray'

--Ginger Finger's birthday is today, add 1 to his age and a bonus of 5000
update Employees set Age = Age+1, Bonus=5000 where FirstName='Ginger' and LastName='Finger'

--All 'Programmer's are now called "Engineer"s. Update all titles accordingly.
update Employees set Title='Engineer' where Title='Programmer'

--Everyone whose making under 30000 are to receive a 3500 bonus.
update Employees set Bonus=3500 where Salary<30000

--Everyone whose making over 35500 are to be deducted 15% of their salaries
update Employees set Salary=Salary-((Salary*15)/100) where Salary>35500
