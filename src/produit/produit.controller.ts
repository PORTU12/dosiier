import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { ProduitService } from './produit.service';
import { ProduitDto } from '../dto/create-produit.dto'
import { UpdateProduitDto } from '../dto/update-produit.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/Auth/JwtAuth.guards';
import { UserEntity } from 'src/entities/user.entity';
import { ProduitEntity } from 'src/entities/produit.entity';
import { User } from 'src/decorators/user.decorateurs';
import { AuthEntity } from 'src/entities/Auth.entity';

@ApiTags('Produits')

@Controller('produit')
export class ProduitController {
  constructor(private readonly produitService: ProduitService) {}

  @Post()
  async create(@Body() createProduitDto: ProduitDto): Promise<ProduitEntity> {
    const response = await this.produitService.createProduit(createProduitDto);
    return response;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@User() request): Promise<ProduitEntity[]>{
    const produit = await this.produitService.findAllProduct(request)
    return produit;
  }
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id, @User() user): Promise<ProduitEntity>  {
    return this.produitService.findOneProduct(id, user);
  }

  @Put(':id')
  Modifier(@Param('id') id: number, @Body() updateProduitDto: UpdateProduitDto): Promise<UpdateResult> {
    return this.produitService.ModifProduit(id, updateProduitDto);
  }

  @Delete(':id')
  Supprimer(@Param('id') id: number): Promise<DeleteResult>{
    return this.produitService.SupprProduit(id);
  }
}
