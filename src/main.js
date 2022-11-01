const { db } = require("./db");

async function executeSelectQuery(query, onlyOne=false) {
    const result = (await db.query(query))[0]
    return onlyOne ? result[0] : result;
}

async function main() {
    let result;

    result = await executeSelectQuery(`SELECT COUNT(*) AS 'num employees' FROM employee_detail;`, true);
    console.log(`There are ${result['num employees']} employees!`);

    result = await executeSelectQuery(`
        SELECT e.name, j.job_title AS position
        FROM employee_detail e
        INNER JOIN current_job_detail j
        ON e.employee_id = j.employee_id
        WHERE j.salary = (
            SELECT MAX(salary)
            FROM current_job_detail
        );
    `, true);
    console.log(`The person with the highest salary is ${result.name} and their position is ${result.position}.`)

    result = await executeSelectQuery(`
        SELECT COUNT(*) AS 'num sr devs'
        FROM current_job_detail
        WHERE job_title = 'Senior Developer';
    `);
    console.log(`There are ${result['num sr devs']} Sr. Devs in the company.`)

    result = await executeSelectQuery(`
        SELECT 
            cjd.job_title AS 'position',
            MAX(cjd.salary) AS 'highest',
            MIN(cjd.salary) AS 'lowest'
        FROM current_job_detail cjd
        GROUP BY cjd.job_title;
    `);
    console.log("The salary brackets are as follows:");
    console.table(result);

    result = await executeSelectQuery(`
        SELECT e.name, cjb.salary
        FROM employee_detail e
        INNER JOIN current_job_detail cjb
        ON e.employee_id = cjb.employee_id
        WHERE cjb.job_title != "Developer";
    `);
    console.log("And the salaries of the people who aren't strictly developers are as follows:")
    console.table(result);
}

main();