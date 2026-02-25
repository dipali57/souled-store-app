import { Gender, Role } from "src/common/enums/user-role.enum";

export class UserResponseDto {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: Role;
  gender: Gender | null;
  mobile: string | null;
  createdAt: Date;
  updatedAt: Date;
}
