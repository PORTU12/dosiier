import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthEntity } from 'src/entities/Auth.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ProduitDto } from '../dto/create-produit.dto';
import { UpdateProduitDto } from '../dto/update-produit.dto';
import { ProduitEntity } from '../entities/produit.entity';
import { UserRoleEnum } from './enums/user-role.enum';

@Injectable()
export class ProduitService {
  constructor(@InjectRepository(ProduitEntity) 
  private ProduitRepository: Repository<ProduitEntity>){}

  createProduit(createProduitDto: ProduitDto){
      /*const newProduit = this.ProduitRepository.create();
      produit = newProduit.auth*/
    return this.ProduitRepository.save(createProduitDto);
  }

  async findAllProduct(user): Promise<ProduitEntity[]>{
    if (user.role === UserRoleEnum.ADMIN)
      return await this.ProduitRepository.find();
    return await this.ProduitRepository.find(user);
  }

  async findOneProduct(id: number, user){
    const product = await this.ProduitRepository.findOne(id);
    if(! product) {
      throw new NotFoundException(`Le cv d'id ${id} n'existe pas`);
    }
    return product;
  }

  ModifProduit(id: number, updateProduitDto: UpdateProduitDto){
    return this.ProduitRepository.update(id, updateProduitDto);
  }

  SupprProduit(id: number): Promise<DeleteResult>{
    return this.ProduitRepository.delete(id);
  }
}