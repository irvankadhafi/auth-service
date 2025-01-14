import { Entity, PrimaryColumn } from 'typeorm';

@Entity('actions')
export class Action {
    @PrimaryColumn()
    id: string;

    constructor(id: string) {
        this.id = id;
    }
}