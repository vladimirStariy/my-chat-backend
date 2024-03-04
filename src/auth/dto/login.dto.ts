import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
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
}