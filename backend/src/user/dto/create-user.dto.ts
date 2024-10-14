import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserDispoDTO {
  @ApiProperty()
  goingTo?: string;

  @ApiProperty()
  startDay?: string;

  @ApiProperty()
  endDay?: string;

  @ApiProperty()
  startAt?: string;

  @ApiProperty()
  endAt?: string;

  @ApiProperty()
  comment?: string;
}
export class UserDTO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  businessNumber?: string | null;

  @ApiProperty()
  businessLicense?: string | null;
  // @ApiProperty({ type: () => Role, required: false })
  // role?: string; // Adjust according to Prisma schema
}
