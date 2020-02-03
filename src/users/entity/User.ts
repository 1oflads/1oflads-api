import {ChildEntity, Column} from "typeorm";
import {Rankable} from "./Rankable";

@ChildEntity()
export class User extends Rankable {

    @Column()
    public username: string;

    @Column()
    public password: string;

}
