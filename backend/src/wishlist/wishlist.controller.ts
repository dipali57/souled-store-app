import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { WishlistService } from './wishlist.service';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/user-role.enum';

@Controller('wishlist')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.USER)
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Post('add')
  add(@Body() dto: AddToWishlistDto, @CurrentUser() user: User) {
    return this.wishlistService.add(dto.productId, user);
  }

  @Get('my')
  getMy(@CurrentUser() user: User) {
    return this.wishlistService.getMyWishlist(user.id);
  }

  @Delete('remove')
  remove(@Body() dto: AddToWishlistDto, @CurrentUser() user: User) {
    return this.wishlistService.remove(dto.productId, user.id);
  }
}
