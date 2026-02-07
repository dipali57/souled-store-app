import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';

@Controller('review')
export class ReviewController {
   constructor(private readonly reviewService: ReviewService) {}

  @Get('all')
  async findAll() {
    return await this.reviewService.findAll();
  }

  @Get()
  async getReviewsByUserId(@CurrentUser() user: User) {
    return this.reviewService.findReviewsByUserId(user);
  }

  @Get('product/:productId')
  async findByProductId(@Param('productId') productId: number) {
    return this.reviewService.findReviewsByProductId(productId);
  }

  @Post()
  async create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() user: User,
  ) {
    return this.reviewService.createReview(createReviewDto, user);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: number) {
    return this.reviewService.deleteReview(id);
  }
}
