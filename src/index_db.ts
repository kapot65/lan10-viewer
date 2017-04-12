/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 
 var testData = [{
        path: ['test_session', 'test_group', 'set_1', 'file'],
        hist: [0, 10, 200, 10, 0],
        bins: [0, 100, 200, 300, 400]
        
    }
 ]
 
class IndexDB {
    private points: Array< {path: Array<string>, 
                            hist: Array<number>, 
                            bins: Array<number>} >
    
    constructor(parameters) {
        this.points = testData;
    };
     
    name(input: Array< {path: Array<string>, 
                        hist: Array<number>, 
                        bins: Array<number>} >) {

    }
}

export { testData };

