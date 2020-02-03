import {ChildEntity, Column} from "typeorm";
import {Rankable} from "./Rankable";

@ChildEntity()
export class Group extends Rankable {

    @Column()
    public name: string;
}
