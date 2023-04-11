export class ContextListItemModel {
    constructor(public id: number, public text: string, public hasSubitems: boolean, public icon?: string, public subItems?: {id: number; text: string, icon?: string}[]) {}    
}