export class Folder {
    constructor(
        public id: number,
        public type: number,
        public name: string, 
        public image: string, 
        public x: number, 
        public y: number, 
        public size: string,
        public nestable: boolean,
        public text: string,
        public folders?: Folder[]
        ) {}    
}