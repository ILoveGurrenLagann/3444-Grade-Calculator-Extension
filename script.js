
    import { parse } from './parser3.js'
    import { drawCalendar } from './calendar.js';
    import { resetCalendar } from './calendar.js';
    import { Course } from './GradeCalculation.js';
    import { AssignmentType } from './GradeCalculation.js';
    var gradeGoal = 0;
    var currCourse;
    var selectedCourse;
    function submit() {
        let errorBox = document.getElementById("errorBox");
        if(gradeGoal != 0)
        {
            if(errorBox.type === "text")
                {
                    errorBox.type = "hidden";
                }
            var textField = document.getElementById("entry");
            var text = textField.value;
            text = text + '\n';
            const result = parse(text);
            let courseName = result[0][3];
            let weightSection = result[1][4];
            //console.log(JSON.stringify(result, null, 2));
            cleanUp(result);
            //console.log(JSON.stringify(result, null, 2));
            var accessible_result = accessify(result);
            //console.log(JSON.stringify(accessible_result, null, 2));
            currCourse = new Course(courseName, gradeGoal);
            weightSection.forEach(weight =>
                {
                    if(weight[0] === "Total" && weight[1] === "100")
                    {
                        weight[1] = 0;
                    }
                    currCourse.addAssignmentType(weight[0], (weight[1] / 100));
                }
            );
            drawCalendar(accessible_result[0]);
            currCourse.readAssignmentType();
            /*assignment example: [
                    "Extra Credit - Web Accessibility for Blind People",    <== assignment[0]
                    [                                                       <== assignment[1]
                        "Group assignments",                                <== assignment[1][0]
                        "35"                                                <== assignment[1][1]
                    ],
                    "Jun 23 by 11:59pm, 2024",                              <== assignment[2]
                    [                                                       <== assignment[3]
                        "-"                                                 <== assignment[3][0]
                    ]
                    ]
            */
            var dropdown = document.getElementById("calcSelect");
            accessible_result[0].forEach(assignment =>
            {
                //course.addGrade(title, type, score, dueDate);
               //console.log( /* assignment[0] + " " + assignment[1][0] + " "  + */assignment[3][0]/*  + " " + assignment[2] + " "  */)
                currCourse.addGrade(assignment[0], assignment[1][0], assignment[3][0], assignment[2]);
                if(assignment[3][0] === '-')
                {
                    var opt = document.createElement('option');
                    opt.value = assignment[0];
                    opt.textContent = assignment[0];
                    dropdown.appendChild(opt);
                } 
            });
            currCourse.calculateAverage();
            currCourse.calcFutureGradesByType();
            
            //dropdown.appendChild()
            //console.log("incr");
            var calcButton = document.getElementById("Calculate");
            currCourse.getNeededGrade("SRS In-class Review");
            //console.log(currCourse.getAverage());

        }
        else
        {
            errorBox.type = "text";
            errorBox.style = "background-color:transparent;border:4px solid #cc0000;"
            errorBox.value = "Grade Goal Not Set!"
        }
    }
    function calculate()
    {
        let dropdown = document.getElementById("calcSelect");
        let selection = dropdown.options[dropdown.selectedIndex].value;
        console.log(selection);
        let output = document.getElementById("grade-needed");
        let grade = currCourse.getNeededGrade(selection);
        output.value = grade;
    }
    function setGradeGoal(goal)
    {
        switch(goal)
        {
            case 'A':
                gradeGoal = 90;
                break;
            case 'B':
                gradeGoal = 80;
                break;
            case 'C':
                gradeGoal = 70;
                break;
            case 'D':
                gradeGoal = 60;
                break;

        }
    }
    function reset() {
        document.getElementById("entry").value = '';
        resetCalendar();
        gradeGoal = 0;
    }
    function cleanUp(result) {
        if(result != null && typeof(result) != 'undefined' && result.constructor === Array) //https://stackoverflow.com/questions/767486/how-do-i-check-if-a-variable-is-an-array-in-javascript
        {
            for(let itr = result.length; itr >= 0; itr--)
            {
                if(result[itr] != null && result[itr].constructor == Array)
                {
                    cleanUp(result[itr]);
                    if(itr != 3 &&  result[itr].length === 0)
                    {
                        result.splice(itr, 1);
                    }
                }
                else if(typeof(result[itr]) === 'string')
                {
                    if(result[itr] === '')
                    {
                        result.splice(itr, 1);
                    }
                }
                else if(typeof(result[itr]) === "undefined" || result[itr] === null)
                {
                    result.splice(itr, 1);
                }
            }

        }
        else if(typeof(result) === 'string')
        {
            if(result === '')
            {
                result.splice(result[itr], 1);
            }
        }
        else if(typeof(result) === "undefined" || result === null)
        {
            result.splice(result[itr], 1);
        }
    }
    function accessify(result){
        var assignments_outer = result[0];
        var assignments = assignments_outer[4];
        var categories = result[1][2];
        var user = assignments_outer[1];
        //console.log(user);
        var course = assignments_outer[3];

        for(let assignment of assignments)
        {
            var grade;
            //console.log(JSON.stringify(assignment, null, 2));
            let assgn_category = assignment[1];
            //console.log(assgn_grade);
            if(assignment.length === 5) //if status is present, remove it from the result
            {
                assignment.splice(3, 1);
            }
            let assgn_grade = assignment[3];
            if(assgn_grade.length === 1)
            {
                assgn_grade.push("100");
            }
            //console.log(JSON.stringify(assignment, null, 2));
            //console.log("\tpost splice assgn_grade: " + assgn_grade);
            if(assgn_grade[0] != '-')
            {
                grade = parseInt((assgn_grade[0] / assgn_grade[1]) * 100);
            }
            else
            {
                grade = '-';
            }
            
           
            
            assgn_grade.splice(0, 2, grade);
            for(let category of categories)
            {
                if(assgn_category === category[0])
                {
                    assignment[1] = [assgn_category, category[1]];
                }
            }
            if(typeof(assignment[2]) != 'undefined' && assignment[2] != null && !assignment.includes(", 20"))
            {
                assignment[2] = assignment[2].slice(0, 6) + ", 2024" + assignment[2].slice(6);
            }
        }
        //console.log("*************************************************");
        //console.log(JSON.stringify(assignments, null, 2));
        return [assignments, categories];

    }
    window.setGradeGoal = setGradeGoal;
    window.submit = submit;
    window.reset = reset;
    window.cleanUp = cleanUp;
    window.calculate = calculate;
    export function returnParsedData(){
        return 
    }