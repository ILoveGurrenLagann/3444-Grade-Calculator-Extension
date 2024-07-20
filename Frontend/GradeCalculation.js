export function drawCalendar(assignments){
    const calendarBody = document.getElementById('calendar-body');

    assignments.forEach(assignment => 
    {
        console.log(JSON.stringify(assignment, null, 2))
        const row = document.createElement('tr');
        const dateCell = document.createElement('td');
        const nameCell = document.createElement('td');
        const gradeCell = document.createElement('td');

        dateCell.textContent = assignment[2];
        nameCell.textContent = assignment[0];
        gradeCell.textContent = assignment[3];

        row.appendChild(dateCell);
        row.appendChild(nameCell);
        row.appendChild(gradeCell);
        calendarBody.appendChild(row);
    });
}
export function resetCalendar()
{
    const calendarBody = document.getElementById('calendar-body');
    let rows = calendarBody.rows;
    for(let it = rows.length - 1; it >= 0; it--)
    {
        calendarBody.deleteRow(it);   
    }
    
}
class Course {
    constructor(name, average) {
      this.name = name;
      this.average = 100;
      this.desiredAverage = 0; //replace with user input in whatever way you like
      this.assignmentTypes = [];
    }

    addAssignmentType(assignmentType) {
        if (assignmentType instanceof AssignmentType) {
            this.assignmentTypes.push(assignmentType);
        } else {
            throw new Error("Argument must be an assignmentType");
        }
    }

    calculateAverage(){
        let assignmentTypeAverageArray = [];
        let assignmentWeightArray = [];

        this.assignmentTypes.forEach((assignmentType) => {

            const assignmentAvg = assignmentType.getAssignmentTypeAverage();
            const assignmentWeight = assignmentType.getAssignmentWeight();

            assignmentTypeAverageArray.push(assignmentAvg);

            if(assignmentWeight != 0){
                assignmentWeightArray.push(assignmentWeight);
            }
        });

        //AverageCalcuation here.
        const totalWeight = assignmentWeightArray.reduce((sum, weight) => sum + weight, 0);
        const weightedAverage = assignmentTypeAverageArray.reduce((sum, avg, index) => sum + (avg * assignmentWeightArray[index]), 0) / totalWeight;
        this.average = weightedAverage;
        return;
    }

    // This will calculate the grade needed for the first future assignment in each assignment weight type.
    // In list mode, should be listed with a higher weight, earlier time, earlier date preferance. 
    //EX: tests should be listed earlier than homework even if they are due at the same time.
    calcFutureGradesByType(){
        //let gradesNeededForEachWeight = [];
        let index = 0;
        this.calculateAverage();
        let scoreNeeded = 0;

        this.assignmentTypes.forEach((assignmentType) => {
            index = assignmentType.grades.indexOf("-"); //selects the first empty grade in each type's list, calculates based off that.
  
            scoreNeeded = ((this.desiredAverage * (1 - assignmentType.weight) * this.average)/assignmentType.weight); //calculates needed score for first future assignment of that weight.
            assignmentType.grades[index].setScoreNeeded();
        });
        
    }

}

class AssignmentType {
    constructor(name, weight) {
      this.name = name;
      this.weight = weight;
      this.grades = [];
    }

    addGrade(grade) {
        if (grade instanceof Grade) {
            this.grades.push(grade);
        } else {
            throw new Error("Argument must be a grade");
        }
    }

    getAssignmentWeight(){
        return this.weight;
    }

    getAssignmentTypeAverage(){
        if (this.grades.length === 0) return 0;

        let total = 0;
        for(var i = 0; i < this.grades.length; i++) {
        total += this.grades[i].score;
        }
        return total / this.grades.length;
    }
}

class Grade {
    constructor(title, type, score, dueDate) {
        
        this.title = title;
        this.type = type;
        this.score = score;
        this.dueDate = dueDate;
        this.scoreNeeded = -1;
    }

    setScoreNeeded(scoreNeeded){
        this.scoreNeeded = scoreNeeded;
    }

    getScoreNeeded(){
        return this.scoreNeeded;
    }
}

