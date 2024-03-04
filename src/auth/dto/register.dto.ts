import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty({
    description: "User email",
    example: "greatchat@gmail.com",
    required: true
  })
  readonly email: string;
  @ApiProperty({
    description: "User password",
    example: "CoolPassword",
    required: true
  })
  readonly password: string;
  @ApiProperty({
    description: "User name",
    example: "CoolDude",
    required: true
  })
  readonly username: string;
}