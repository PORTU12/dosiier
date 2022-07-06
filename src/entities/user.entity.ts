import { Exclude } from "class-transformer";
import { ProduitEntity } from "src/entities/produit.entity";
import { UserRoleEnum } from "src/produit/enums/user-role.enum";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      length: 50,
      unique: true
    })
    username: string;
  
    @Column({
      unique: true
    })
    email: string;
  
    @Column()
    @Exclude()
    password: string;
  
    @Column()
    @Exclude()
    salt: string;
  
    @Column({
      type: 'enum',
      enum: UserRoleEnum,
      default: UserRoleEnum.USER
    })
    role: string;
  
    @OneToMany(
      type => ProduitEntity,
      (produit) => produit.user,
      {
        nullable: true,
        cascade: true
      }
    )
    produit: ProduitEntity[];
}