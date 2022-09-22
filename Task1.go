package main

import "fmt"

type Person struct {
	name   string
	age    int
	job    string
	salary int
}

func Printclass(class Person) {
	fmt.Println("Name: ", class.name)
	fmt.Println("Age: ", class.age)
	fmt.Println("Job: ", class.job)
	fmt.Println("Salary: ", class.salary)
}
func main() {
	var pers1 Person
	var pers2 Person
	// Pers1 specification
	pers1.name = "Hege"
	pers1.age = 45
	pers1.job = "Teacher"
	pers1.salary = 6000
	// Pers2 specification
	pers2.name = "Cecilie"
	pers2.age = 24
	pers2.job = "Marketing"
	pers2.salary = 4500
	Printclass(pers1)
	fmt.Println()
	Printclass(pers2)
}
