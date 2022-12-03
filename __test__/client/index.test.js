// The describe() function takes two arguments - a string description, and a test suite as a callback function.  

import { handleSubmit } from "../../src/client";



// A test suite may contain one or more related tests    
describe("Testing the submit functionality", () => {
    test("Testing the handleSubmit() function", () => {
            expect(handleSubmit).toBeDefined();
})});