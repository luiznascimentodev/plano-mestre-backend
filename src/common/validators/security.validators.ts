import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class StrongPasswordValidator {
  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  @MaxLength(128, { message: 'A senha deve ter no máximo 128 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, {
    message:
      'A senha deve conter pelo menos: 1 letra maiúscula, 1 letra minúscula, 1 número e 1 caractere especial (@$!%*?&)',
  })
  password: string;
}

export class EmailValidator {
  @IsEmail({}, { message: 'Email inválido' })
  @MaxLength(255, { message: 'Email muito longo' })
  email: string;
}

export class SanitizedString {
  @IsString()
  @MaxLength(1000, { message: 'Texto muito longo' })
  value: string;
}
