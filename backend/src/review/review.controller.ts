import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/user-role.enum';

@Controller('review')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReviewController {
   constructor(private readonly reviewService: ReviewService) {}

  @Get('all')
  @Roles(Role.USER)
  async findAll() {
    return await this.reviewService.findAll();
  }

  @Get()
  @Roles(Role.USER)
  async getReviewsByUserId(@CurrentUser() user: User) {
    return this.reviewService.findReviewsByUserId(user);
  }

  @Get('product/:productId')
  @Roles(Role.USER)
  async findByProductId(@Param('productId') productId: number) {
    return this.reviewService.findReviewsByProductId(productId);
  }

  @Post()
  @Roles(Role.USER)
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewService.createReview(createReviewDto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteReview(@Param('id') id: number) {
    return this.reviewService.deleteReview(id);
  }
}
