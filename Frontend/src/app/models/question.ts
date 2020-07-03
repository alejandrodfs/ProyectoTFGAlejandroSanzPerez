export class Question{
    constructor(
        public _id: string,
        public title: string,
        public description: string,
        public text: string,
        public questionBefore: string,
        public answerBefore: string,
        public image: string,
        public urlVideo : string,
        public Idform: string
    ){}
}