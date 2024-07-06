
    import { parse } from './parser3.js'
    import { drawCalendar } from './GradeCalculation.js';
    import { resetCalendar } from './GradeCalculation.js';
    function submit() {
        var textField = document.getElementById("entry");
        var text = textField.value;
        const result = parse(text);
        cleanUp(result);
        console.log(JSON.stringify(result, null, 2));
        var accessible_result = accessify(result);
        drawCalendar(accessible_result[0]);
        
    }
    function reset() {
        document.getElementById("entry").value = '';
        resetCalendar();
    }
    function cleanUp(result) {
        if(result != null && typeof(result) != 'undefined' && result.constructor === Array) //https://stackoverflow.com/questions/767486/how-do-i-check-if-a-variable-is-an-array-in-javascript
        {
            for(let itr = result.length; itr >= 0; itr--)
            {
                if(result[itr] != null && result[itr].constructor == Array)
                {
                    cleanUp(result[itr]);
                    if(result[itr].length === 0)
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
        console.log(user);
        var course = assignments_outer[3];

        for(let assignment of assignments)
        {
            
            let assgn_category = assignment[1];
            for(let category of categories)
            {
                if(assgn_category === category[0])
                {
                    assignment[1] = [assgn_category, category[1]];
                }
            }
            console.log("assignment[2]: " + assignment[2]);
            if(typeof(assignment[2]) != 'undefined' && assignment[2] != null && !assignment.includes(", 20"))
            {
                assignment[2] = assignment[2].slice(0, 6) + ", 2024" + assignment[2].slice(6);
            }
        }
        console.log("*************************************************");
        console.log(JSON.stringify(assignments, null, 2));
        return [assignments, categories];

    }
    window.submit = submit;
    window.reset = reset;
    window.cleanUp = cleanUp;
    export function returnParsedData(){
        return 
    }
