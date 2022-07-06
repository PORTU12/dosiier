import { ConflictException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginCredentialsDto } from 'src/dto/LoginCredentialsDto';
import { UserSubscribeDto } from 'src/dto/UserSubscribe.dto';
import { AuthEntity } from 'src/entities/Auth.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { UserEntity } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(@InjectRepository(AuthEntity)
    private authRepository: Repository<UserEntity>,
    private jwtService: JwtService){}

    async findAll(){
        return this.authRepository.find()
    }

    async subscribe(userData: UserSubscribeDto): Promise<UserEntity> {
        const auth = this.authRepository.create({...userData})
        auth.salt = await bcrypt.genSalt();
        auth.password = await bcrypt.hash(auth.password, auth.salt);
        try{
            await this.authRepository.save(auth)
        } catch(error){
            throw new ConflictException('not found')
        } return {
            id: auth.id,
            username: auth.username,
            email: auth.email,
            salt: auth.salt,
            produit: auth.produit,
            password: auth.password,
            role: auth.role
        }
    }
    async Login(credentials: LoginCredentialsDto){
        //RECUPERE LE LOGIN ET PASSWORD
        const {username, password} = credentials;
        //S'INSCRIRE VIA LE loginname ou LE loginpassword
        const payload =  {email: credentials.username, password: credentials.password};
        //VERIFIER S'IL Y'A UN USER AVEC LE LOGIN OU CE MDP
        const users = await this.authRepository.findOne({where: {username, password}})
    
        if (!users)
        throw new HttpException(`Introuvable`, HttpStatus.NOT_FOUND);
        return {
                access_token: this.jwtService.sign(payload)
        }
    }
}