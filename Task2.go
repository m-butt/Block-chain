package main

import "fmt"

type employee struct {
	name     string
	salary   int
	position string
}
type company struct {
	companyName string
	employees   []employee
}

func main() {
	emp1 := employee{"Daniyal", 50000, "React Developer"}
	emp2 := employee{"Muhammad", 60000, "Full-Stack Developer"}
	emp3 := employee{"Mehmood", 70000, "Kafka Developer"}
	emplys := []employee{emp1, emp2, emp3}
	comp := company{"Tetra", emplys}
	fmt.Println(comp.companyName, comp.employees)

}
