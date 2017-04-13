/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
 var testPaths: string[] = [
    'test_session/test_group/set_1/point1.df',
    'test_session/test_group/set_1/point2.df',
    'test_session/test_group/set_1/point3.df',
    'test_session/test_group/set_2/point1.df',
    'test_session/test_group/set_2/point4.df',
    'test_session/test_group2/set_1/point6.df',
    'test_session/test_group2/set_1/point3.df',
 ]
 
var testHist: { [key:string]:{ hist: number[], bins: number[] }; } = {};
for (let path of testPaths) {
    var hist: number[] = [];
    var bins: number[] = [];
    
    for (let i = 0; i < 100; i++) {
        hist[i] = Math.random();
        bins[i] = i;    
    }
    
    testHist[path] = {
        hist: hist,
        bins: bins
    }
}
 
var testMeta: { [key:string]:{}; } = {
    'test_session/test_group/set_1/point1.df': {
        meta: "Meta"
    },
    'test_session/test_group/set_1/point2.df': {
        meta: "Meta"
    },
    'test_session/test_group/set_1/point3.df': {
        meta: "Meta"
    },
    'test_session/test_group/set_2/point1.df': {
        meta: "Meta"
    },
    'test_session/test_group/set_2/point4.df': {
        meta: "Meta"
    },
    'test_session/test_group2/set_1/point6.df': {
        meta: "Meta"
    },
    'test_session/test_group2/set_1/point3.df': {
        meta: "Meta"
    }
}
 
 
class IndexDB {
    private points: Array< {path: Array<string>, 
                            hist: Array<number>, 
                            bins: Array<number>} >
    
    constructor() {  
    };
    
    /**
     * @todo заменить на реальную функцию
     */
    getPoints(): string[] {
        return testPaths;
    }
    
    /**
     * @todo заменить на реальную функцию
     */
    getHist(path: string): {hist: number[], bins: number[]} {
        return testHist[path];
    }
    
    /**
     * @todo заменить на реальную функцию
     */
    getMeta(path: string): {} {
        return testMeta[path];
    }
    
}

export { IndexDB };

