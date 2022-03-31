/**
 * In this Kata we are going to mimic the SQL syntax with JavaScript (or TypeScript).

    To do this, you must implement the query() function. This function returns and object with the next methods:

    {
    select: ...,
    from: ...,
    where: ...,
    orderBy: ...,
    groupBy: ...,
    having: ...,
    execute: ...
    }
 */

// https://www.codewars.com/kata/545434090294935e7d0010ab

// https://stackoverflow.com/questions/38687965/typescript-generics-argument-type-inference

type SelectPredicate<T> = (elem: T) => any
type WhereCondition<T> = (elem: T) => boolean


export class QuerySQL<T> {

    private list: T[] = [];

    private selection: SelectPredicate<T> = null;

    private whereConditions: WhereCondition<T>[] = []

    private groupByCondition: string = null
    
    constructor(list: T[]) {
        this.list = list
    }

    public select(predicate: SelectPredicate<T>): QuerySQL<T> {
        this.selection = predicate
        return this
    }

    public where(condition: WhereCondition<T>): QuerySQL<T> {
        this.whereConditions = [condition]
        return this
    }
  
    public andWhere(condition: WhereCondition<T>): QuerySQL<T> {
        this.whereConditions.push(condition)
        return this
    }

    public groupBy(accessor: string): QuerySQL<T> {
        this.groupByCondition = accessor
        return this
    } 

    public execute(): T[] {
        let finalList = []

        finalList = this.executeWhere()
        finalList = this.executeGroupBy(finalList)
        finalList = this.executeSelect(finalList)

        return finalList
    }

    private executeSelect(finalList: T[]): T[] {
        if (!this.selection) return finalList
        
        // recursive
    }

    private executeGroupBy(finalList: T[]): T[] {
        if (!this.groupByCondition) return finalList
        
        const groups = [...new Set(this.list.map(x => x[this.groupByCondition]))]
        let listAfterGroupBy = []
        for (const group of groups) {
            listAfterGroupBy.push([group, ...finalList.filter(x => x[this.groupByCondition] === group)])
        }

        return listAfterGroupBy

    }

    private executeWhere(): T[] {
        if (this.whereConditions.length === 0) return this.list

        const listAfterWhere = this.list.filter((elem: T) => {
            let pass = true
            this.whereConditions.forEach(wc => { if (!wc(elem)) pass = false })
            return pass
        })

        return listAfterWhere
    }
  
}



var persons = [
    {id: 1, name: 'Peter', profession: 'teacher', age: 20, maritalStatus: 'married'},
    {id: 2, name: 'Michael', profession: 'teacher', age: 50, maritalStatus: 'single'},
    {id: 3, name: 'Peter', profession: 'teacher', age: 20, maritalStatus: 'married'},
    {id: 4, name: 'Anna', profession: 'scientific', age: 20, maritalStatus: 'married'},
    {id: 5, name: 'Anna', profession: 'scientific', age: 20, maritalStatus: 'single'},
    {id: 6, name: 'Rose', profession: 'scientific', age: 50, maritalStatus: 'married'},
    {id: 7, name: 'Anna', profession: 'politician', age: 50, maritalStatus: 'married'}
];
  
// console.log(new QuerySQL(persons).execute()) // PASS
// console.log(new QuerySQL(persons).where(x => x.age > 25).andWhere(x => x.maritalStatus == 'single').execute()) // PASS
// console.log(new QuerySQL(persons).groupBy('profession').execute() ) // PASS
// console.log(new QuerySQL(persons).groupBy('profession').where(x => x.age > 25).execute() ) // PASS