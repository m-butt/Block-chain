package main

import (
	"crypto/sha256"
	"fmt"
	"strings"
)

type student struct {
	rollnumber int
	name       string
	address    string
}

func Newstudent(rollnumber int, name string, address string) *student {
	s := new(student)
	s.rollnumber = rollnumber
	s.name = name
	s.address = address
	return s
}

type studentlist struct {
	list []*student
}

func (ls *studentlist) createstudent(rollnumber int, name string, address string) *student {
	st := Newstudent(rollnumber, name, address)
	ls.list = append(ls.list, st)
	return st
}
func calculatehash(key interface{}) [32]byte {
	bytekey := []byte(fmt.Sprintf("%v", key.(interface{})))
	return sha256.Sum256(bytekey)
}
func main() {
	student := new(studentlist)
	student.createstudent(0561, "Muhammad", "Fast")
	student.createstudent(0562, "Ahmed Butt", "Fast")
	for no := 0; no < 2; no = no + 1 {
		fmt.Printf("%s List %d %s \n", strings.Repeat("=", 25), no, strings.Repeat("=", 25))
		fmt.Println("Student rollnp: ", student.list[no].rollnumber)
		fmt.Println("Student name: ", student.list[no].name)
		fmt.Println("Student address: ", student.list[no].address)
		sha := calculatehash((*student.list[no]))
		fmt.Println("Hash: ", sha)
	}
}
